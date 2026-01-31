import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';

@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  async createLobby(@CurrentUser() user: User, @Body() dto: CreateLobbyDto) {
    const lobby = await this.lobbyService.createLobby(user.id, dto.entryFee);
    return {
      id: lobby.id,
      code: lobby.code,
      entryFee: lobby.entryFee,
      status: lobby.status,
    };
  }

  @Get(':code')
  async getLobby(@Param('code') code: string) {
    const lobby = await this.lobbyService.getLobby(code.toUpperCase());
    return {
      id: lobby.id,
      code: lobby.code,
      status: lobby.status,
      entryFee: lobby.entryFee,
      totalPot: lobby.totalPot,
      currentQuestion: lobby.currentQuestion,
      hasQuestions: !!lobby.questions,
      players: lobby.participations.map((p) => ({
        userId: p.userId,
        score: p.score,
        speedXp: p.speedXp,
        joinedAt: p.joinedAt,
      })),
    };
  }

  @Post(':code/join')
  async joinLobby(@Param('code') code: string, @CurrentUser() user: User) {
    const participation = await this.lobbyService.joinLobby(
      code.toUpperCase(),
      user.id,
    );
    return {
      lobbyId: participation.lobbyId,
      userId: participation.userId,
      joinedAt: participation.joinedAt,
    };
  }

  @Post(':code/generate')
  async generateQuestions(
    @Param('code') code: string,
    @CurrentUser() user: User,
    @Body() dto: GenerateQuestionsDto,
  ) {
    await this.lobbyService.generateQuestions(
      code.toUpperCase(),
      user.id,
      dto.topic,
      dto.notes,
    );
    return { success: true, message: 'Questions generated' };
  }

  @Post(':code/start')
  async startLobby(@Param('code') code: string, @CurrentUser() user: User) {
    const lobby = await this.lobbyService.startLobby(code.toUpperCase(), user.id);
    return {
      id: lobby.id,
      code: lobby.code,
      status: lobby.status,
      totalPot: lobby.totalPot,
    };
  }

  @Get(':code/question')
  async getCurrentQuestion(@Param('code') code: string) {
    const question = await this.lobbyService.getCurrentQuestion(code.toUpperCase());
    return question || { finished: true };
  }

  @Post(':code/next')
  async advanceQuestion(@Param('code') code: string, @CurrentUser() user: User) {
    const question = await this.lobbyService.advanceQuestion(
      code.toUpperCase(),
      user.id,
    );
    return question || { finished: true };
  }

  @Post(':code/finish')
  async finishLobby(@Param('code') code: string, @CurrentUser() user: User) {
    const result = await this.lobbyService.finishLobby(code.toUpperCase(), user.id);
    return result;
  }
}
