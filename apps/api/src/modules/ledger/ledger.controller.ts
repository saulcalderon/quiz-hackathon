import { Controller, Get, Post, Body } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { TopupDto } from './dto/topup.dto';

@Controller('users/me')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get()
  async getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      balance: user.balance,
      xp: user.xp,
      createdAt: user.createdAt,
    };
  }

  @Get('balance')
  async getBalance(@CurrentUser() user: User) {
    const balance = await this.ledgerService.getBalance(user.id);
    return { balance };
  }

  @Get('transactions')
  async getTransactions(@CurrentUser() user: User) {
    return this.ledgerService.getTransactions(user.id);
  }

  @Post('topup')
  async topup(@CurrentUser() user: User, @Body() dto: TopupDto) {
    const updated = await this.ledgerService.topup(user.id, dto.amount);
    return {
      id: updated.id,
      balance: updated.balance,
      xp: updated.xp,
    };
  }
}
