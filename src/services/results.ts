import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResultsService {
  async storeDrawnNumbers(numbers: number[]): Promise<boolean> {
    const latestRound = await prisma.round.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!latestRound) {
      return false;
    }

    if (latestRound.isActive) {
      return false;
    }

    if (latestRound.drawnNumbers.length > 0) {
      return false;
    }

    await prisma.round.update({
      where: { id: latestRound.id },
      data: { drawnNumbers: numbers },
    });

    return true;
  }
}

export const resultsService = new ResultsService();
