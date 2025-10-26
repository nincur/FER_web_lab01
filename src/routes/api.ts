import { Router, Request, Response } from 'express';
import { m2mAuth, m2mErrorHandler } from '../auth/m2m';
import { roundsService } from '../services/rounds';
import { resultsService } from '../services/results';
import { storeResultsSchema } from '../utils/validation';

const router = Router();

router.post('/new-round', m2mAuth, async (req: Request, res: Response) => {
  try {
    await roundsService.createNewRound();
    return res.status(204).send();
  } catch (error) {
    console.error('Error creating new round:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/close', m2mAuth, async (req: Request, res: Response) => {
  try {
    await roundsService.closeCurrentRound();
    return res.status(204).send();
  } catch (error) {
    console.error('Error closing round:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/store-results', m2mAuth, async (req: Request, res: Response) => {
  try {
    const parseResult = storeResultsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input', details: parseResult.error });
    }

    const { numbers } = parseResult.data;

    const success = await resultsService.storeDrawnNumbers(numbers);

    if (!success) {
      return res.status(400).json({ error: 'Cannot store results at this time' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error storing results:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.use(m2mErrorHandler);

export default router;
