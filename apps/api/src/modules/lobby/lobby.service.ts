import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AiService } from '../ai/ai.service';
import { LobbyStatus, Lobby, Participation } from '@prisma/client';
import { getNanoid } from '../../common/nanoid';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QuestionSet, QuestionForClient } from '../../common/types/question.types';

type LobbyWithParticipations = Lobby & {
  participations: (Participation & { user: { id: string; xp: number } })[];
};

@Injectable()
export class LobbyService {
  private readonly logger = new Logger(LobbyService.name);
  private supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerService: LedgerService,
    private readonly aiService: AiService,
  ) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase credentials not set, realtime features disabled');
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async createLobby(hostId: string, entryFee: number): Promise<Lobby> {
    const nanoid = await getNanoid();
    const code = nanoid(6).toUpperCase();

    return this.prisma.lobby.create({
      data: {
        code,
        hostId,
        entryFee,
        status: LobbyStatus.WAITING,
      },
    });
  }

  async getLobby(code: string): Promise<LobbyWithParticipations> {
    const lobby = await this.prisma.lobby.findUnique({
      where: { code },
      include: {
        participations: {
          include: {
            user: {
              select: { id: true, xp: true },
            },
          },
        },
        host: {
          select: { id: true },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    return lobby;
  }

  async joinLobby(code: string, userId: string): Promise<Participation> {
    const lobby = await this.getLobby(code);

    if (lobby.status !== LobbyStatus.WAITING) {
      throw new BadRequestException('Lobby is not accepting players');
    }

    const existingParticipation = lobby.participations.find((p) => p.userId === userId);

    if (existingParticipation) {
      return existingParticipation;
    }

    // Check balance
    const balance = await this.ledgerService.getBalance(userId);
    if (balance < lobby.entryFee) {
      throw new BadRequestException('Insufficient balance to join');
    }

    const participation = await this.prisma.participation.create({
      data: {
        userId,
        lobbyId: lobby.id,
      },
    });

    await this.broadcast(code, 'player_joined', {
      playerId: userId,
      playerCount: lobby.participations.length + 1,
    });

    return participation;
  }

  async leaveLobby(code: string, userId: string): Promise<void> {
    const lobby = await this.getLobby(code);

    if (lobby.status !== LobbyStatus.WAITING) {
      throw new BadRequestException('Cannot leave an active game');
    }

    // Host cannot leave - they must close the lobby
    if (lobby.hostId === userId) {
      throw new BadRequestException('Host cannot leave. Close the lobby instead.');
    }

    const participation = lobby.participations.find((p) => p.userId === userId);

    if (!participation) {
      return; // Not in lobby, nothing to do
    }

    await this.prisma.participation.delete({
      where: { id: participation.id },
    });

    await this.broadcast(code, 'player_left', {
      playerId: userId,
      playerCount: lobby.participations.length - 1,
    });

    this.logger.log(`Player ${userId} left lobby ${code}`);
  }

  async generateQuestions(code: string, hostId: string, topic: string, notes?: string): Promise<void> {
    const lobby = await this.getLobby(code);

    if (lobby.hostId !== hostId) {
      throw new ForbiddenException('Only the host can generate questions');
    }

    if (lobby.status !== LobbyStatus.WAITING) {
      throw new BadRequestException('Cannot generate questions after lobby started');
    }

    const questions = await this.aiService.generateQuestions(topic, notes);

    await this.prisma.lobby.update({
      where: { id: lobby.id },
      data: { questions },
    });

    this.logger.log(`Generated questions for lobby ${code}`);
  }

  async startLobby(code: string, hostId: string): Promise<Lobby> {
    const lobby = await this.getLobby(code);

    if (lobby.hostId !== hostId) {
      throw new ForbiddenException('Only the host can start the lobby');
    }

    if (lobby.status !== LobbyStatus.WAITING) {
      throw new BadRequestException('Lobby already started');
    }

    if (!lobby.questions) {
      throw new BadRequestException('Questions must be generated before starting');
    }

    if (lobby.participations.length < 2) {
      throw new BadRequestException('Need at least 2 players to start');
    }

    // Deduct entry fees atomically
    const totalPot = lobby.entryFee * lobby.participations.length;

    await this.prisma.$transaction(async (tx) => {
      for (const participation of lobby.participations) {
        await this.ledgerService.deductEntryFee(participation.userId, lobby.id, lobby.entryFee);
      }

      await tx.lobby.update({
        where: { id: lobby.id },
        data: {
          status: LobbyStatus.ACTIVE,
          totalPot,
        },
      });
    });

    const updatedLobby = await this.prisma.lobby.findUniqueOrThrow({
      where: { id: lobby.id },
    });

    await this.broadcast(code, 'lobby_started', {
      totalPot,
      questionCount: (lobby.questions as QuestionSet).length,
    });

    return updatedLobby;
  }

  async getCurrentQuestion(code: string): Promise<QuestionForClient | null> {
    const lobby = await this.getLobby(code);

    if (lobby.status !== LobbyStatus.ACTIVE) {
      return null;
    }

    const questions = lobby.questions as QuestionSet;
    const currentIndex = lobby.currentQuestion;

    if (currentIndex >= questions.length) {
      return null;
    }

    const question = questions[currentIndex];

    return {
      index: currentIndex,
      text: question.text,
      options: question.options,
      difficulty: question.difficulty,
    };
  }

  async broadcastQuestion(code: string): Promise<void> {
    const question = await this.getCurrentQuestion(code);

    if (question) {
      await this.broadcast(code, 'question', question);
    }
  }

  async advanceQuestion(code: string, hostId: string): Promise<QuestionForClient | null> {
    const lobby = await this.getLobby(code);

    if (lobby.hostId !== hostId) {
      throw new ForbiddenException('Only the host can advance questions');
    }

    const questions = lobby.questions as QuestionSet;
    const currentIndex = lobby.currentQuestion;

    // Broadcast round end with correct answer
    if (currentIndex < questions.length) {
      const currentQ = questions[currentIndex];
      const leaderboard = lobby.participations
        .map((p) => ({
          userId: p.userId,
          score: p.score,
          speedXp: p.speedXp,
        }))
        .sort((a, b) => b.score - a.score);

      await this.broadcast(code, 'round_end', {
        questionIndex: currentIndex,
        correctIndex: currentQ.correctIndex,
        leaderboard,
      });
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      // Game over
      return null;
    }

    await this.prisma.lobby.update({
      where: { code },
      data: { currentQuestion: nextIndex },
    });

    const nextQuestion = await this.getCurrentQuestion(code);
    if (nextQuestion) {
      await this.broadcast(code, 'question', nextQuestion);
    }

    return nextQuestion;
  }

  async finishLobby(code: string, hostId: string): Promise<{ winnerId: string; payout: number }> {
    const lobby = await this.getLobby(code);

    if (lobby.hostId !== hostId) {
      throw new ForbiddenException('Only the host can finish the lobby');
    }

    if (lobby.status !== LobbyStatus.ACTIVE) {
      throw new BadRequestException('Lobby is not active');
    }

    // Find winner (highest score)
    const sortedParticipations = [...lobby.participations].sort((a, b) => b.score - a.score);

    const winner = sortedParticipations[0];

    if (!winner) {
      throw new BadRequestException('No participants found');
    }

    // Distribute pot
    await this.ledgerService.distributePot(lobby.id, winner.userId, lobby.totalPot);

    // Update lobby status
    await this.prisma.lobby.update({
      where: { id: lobby.id },
      data: { status: LobbyStatus.FINISHED },
    });

    // Update XP for all players
    for (const p of lobby.participations) {
      await this.prisma.user.update({
        where: { id: p.userId },
        data: { xp: { increment: p.speedXp } },
      });
    }

    const payout = lobby.totalPot * 0.9;

    await this.broadcast(code, 'game_over', {
      winnerId: winner.userId,
      winnerScore: winner.score,
      payout,
      leaderboard: sortedParticipations.map((p) => ({
        userId: p.userId,
        score: p.score,
        speedXp: p.speedXp,
      })),
    });

    return { winnerId: winner.userId, payout };
  }

  private async broadcast(code: string, event: string, payload: unknown): Promise<void> {
    if (!this.supabase) {
      this.logger.warn(`Broadcast skipped (no Supabase): ${event}`);
      return;
    }

    const channel = this.supabase.channel(`lobby:${code}`);
    await channel.send({
      type: 'broadcast',
      event,
      payload,
    });

    this.logger.debug(`Broadcast ${event} to lobby:${code}`);
  }
}
