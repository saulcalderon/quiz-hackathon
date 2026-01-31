import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SupabaseAuthGuard } from './modules/auth/auth.guard';
import { LedgerModule } from './modules/ledger/ledger.module';
import { AiModule } from './modules/ai/ai.module';
import { LobbyModule } from './modules/lobby/lobby.module';
import { QuizModule } from './modules/quiz/quiz.module';

@Module({
  imports: [PrismaModule, AuthModule, LedgerModule, AiModule, LobbyModule, QuizModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
})
export class AppModule {}
