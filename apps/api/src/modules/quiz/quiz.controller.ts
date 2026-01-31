import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('lobbies/:code')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('answer')
  async submitAnswer(@Param('code') code: string, @CurrentUser() user: User, @Body() dto: SubmitAnswerDto) {
    return this.quizService.submitAnswer(
      code.toUpperCase(),
      user.id,
      dto.questionIndex,
      dto.selectedOption,
      dto.responseTimeMs,
    );
  }

  @Post('double')
  async activateDouble(
    @Param('code') code: string,
    @CurrentUser() user: User,
    @Body() body: { questionIndex: number },
  ) {
    return this.quizService.activateDouble(code.toUpperCase(), user.id, body.questionIndex);
  }

  @Get('leaderboard')
  async getLeaderboard(@Param('code') code: string) {
    return this.quizService.getLeaderboard(code.toUpperCase());
  }

  @Get('my-status')
  async getMyStatus(@Param('code') code: string, @CurrentUser() user: User) {
    return this.quizService.getParticipationStatus(code.toUpperCase(), user.id);
  }
}
