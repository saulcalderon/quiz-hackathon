import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, User } from '@prisma/client';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string): Promise<number> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { balance: true },
    });
    return user.balance;
  }

  async getTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        lobby: {
          select: { code: true },
        },
      },
    });
  }

  async topup(userId: string, amount: number): Promise<User> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          userId,
          amount,
          type: TransactionType.TOPUP,
        },
      });

      return tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: amount },
        },
      });
    });
  }

  async deductEntryFee(
    userId: string,
    lobbyId: string,
    amount: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { balance: true },
      });

      if (user.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      await tx.transaction.create({
        data: {
          userId,
          lobbyId,
          amount: -amount,
          type: TransactionType.ENTRY,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: amount },
        },
      });
    });
  }

  async distributePot(
    lobbyId: string,
    winnerId: string,
    totalPot: number,
  ): Promise<void> {
    const houseFee = totalPot * 0.1;
    const winnerPayout = totalPot * 0.9;

    await this.prisma.$transaction(async (tx) => {
      // Record house fee
      await tx.transaction.create({
        data: {
          userId: winnerId,
          lobbyId,
          amount: houseFee,
          type: TransactionType.HOUSE_FEE,
        },
      });

      // Record winner payout
      await tx.transaction.create({
        data: {
          userId: winnerId,
          lobbyId,
          amount: winnerPayout,
          type: TransactionType.WIN,
        },
      });

      // Credit winner's balance
      await tx.user.update({
        where: { id: winnerId },
        data: {
          balance: { increment: winnerPayout },
        },
      });
    });
  }
}
