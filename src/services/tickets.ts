import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTicketData {
  idNumber: string;
  selectedNumbers: number[];
}

export class TicketsService {
  async createTicket(data: CreateTicketData): Promise<string> {
    const currentRound = await prisma.round.findFirst({
      where: { isActive: true },
    });

    if (!currentRound) {
      throw new Error('No active round available');
    }

    const ticket = await prisma.ticket.create({
      data: {
        roundId: currentRound.id,
        idNumber: data.idNumber,
        selectedNumbers: data.selectedNumbers,
      },
    });

    return ticket.id;
  }

  async getTicketById(ticketId: string) {
    return await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        round: true,
      },
    });
  }
}

export const ticketsService = new TicketsService();
