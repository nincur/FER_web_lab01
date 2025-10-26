import { Router, Request, Response } from 'express';
import { requireAuth } from '../auth/oidc';
import { roundsService } from '../services/rounds';
import { ticketsService } from '../services/tickets';
import { ticketSchema } from '../utils/validation';
import { qrGenerator } from '../utils/qr';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).oidc?.user || null;
    const currentRound = await roundsService.getCurrentRound();
    const latestRound = await roundsService.getLatestRound();
    const ticketCount = await roundsService.countTicketsInCurrentRound();

    res.render('index', {
      user,
      isActive: currentRound?.isActive || false,
      ticketCount,
      drawnNumbers: latestRound?.drawnNumbers || [],
      hasDrawnNumbers: (latestRound?.drawnNumbers?.length || 0) > 0,
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).send('Error loading page');
  }
});

router.get('/submit', requireAuth, async (req: Request, res: Response) => {
  try {
    const currentRound = await roundsService.getCurrentRound();

    if (!currentRound) {
      return res.redirect('/?error=no-active-round');
    }

    const user = (req as any).oidc.user;
    res.render('submit', { user, error: null });
  } catch (error) {
    console.error('Error loading submit page:', error);
    res.status(500).send('Error loading page');
  }
});

router.post('/submit', requireAuth, async (req: Request, res: Response) => {
  try {
    const currentRound = await roundsService.getCurrentRound();

    if (!currentRound) {
      return res.redirect('/?error=no-active-round');
    }

    const parseResult = ticketSchema.safeParse(req.body);

    if (!parseResult.success) {
      const user = (req as any).oidc.user;
      const errorMessage = parseResult.error.errors[0]?.message || 'Invalid input';
      return res.render('submit', { user, error: errorMessage });
    }

    const { idNumber, numbers } = parseResult.data;

    const ticketId = await ticketsService.createTicket({
      idNumber,
      selectedNumbers: numbers,
    });

    const qrBuffer = await qrGenerator.generateTicketQR(ticketId);

    res.setHeader('Content-Type', 'image/png');
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error submitting ticket:', error);
    const user = (req as any).oidc.user;
    res.render('submit', { user, error: 'Error processing ticket' });
  }
});

router.get('/ticket/:id', async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketsService.getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }

    res.render('ticket', {
      ticket,
      drawnNumbers: ticket.round.drawnNumbers,
      hasDrawnNumbers: ticket.round.drawnNumbers.length > 0,
    });
  } catch (error) {
    console.error('Error loading ticket:', error);
    res.status(500).send('Error loading ticket');
  }
});

export default router;
