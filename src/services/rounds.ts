import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RoundsService {
  async createNewRound(): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.round.updateMany({
        where: { isActive: true },
        data: { isActive: false, closedAt: new Date() },
      });

      await tx.round.create({
        data: {
          isActive: true,
          drawnNumbers: [],
        },
      });
    });
  }

  async closeCurrentRound(): Promise<void> {
    await prisma.round.updateMany({
      where: { isActive: true },
      data: { isActive: false, closedAt: new Date() },
    });
  }

  async getCurrentRound() {
    return await prisma.round.findFirst({
      where: { isActive: true },
    });
  }

  async getLatestRound() {
    return await prisma.round.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  async countTicketsInCurrentRound(): Promise<number> {
    const currentRound = await this.getCurrentRound();
    if (!currentRound) return 0;

    return await prisma.ticket.count({
      where: { roundId: currentRound.id },
    });
  }
}

export const roundsService = new RoundsService();
