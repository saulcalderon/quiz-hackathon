import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LobbyStatus } from '@prisma/client';
import { QuestionSet } from '../../common/types/question.types';

const BASE_POINTS = 100;
const MAX_SPEED_BONUS = 50;
const ANSWER_TIME_LIMIT_MS = 30000;

type AnswerRecord = {
  questionIndex: number;
  selectedOption: number;
  responseTimeMs: number;
  correct: boolean;
  pointsEarned: number;
  speedXpEarned: number;
};

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async submitAnswer(
    code: string,
    userId: string,
    questionIndex: number,
    selectedOption: number,
    responseTimeMs: number,
  ): Promise<{
    correct: boolean;
    pointsEarned: number;
    speedXpEarned: number;
    totalScore: number;
  }> {
    const lobby = await this.prisma.lobby.findUnique({
      where: { code },
      include: {
        participations: {
          where: { userId },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    if (lobby.status !== LobbyStatus.ACTIVE) {
      throw new BadRequestException('Lobby is not active');
    }

    if (questionIndex !== lobby.currentQuestion) {
      throw new BadRequestException('Invalid question index');
    }

    const participation = lobby.participations[0];
    if (!participation) {
      throw new BadRequestException('You are not in this lobby');
    }

    // Check if already answered
    const existingAnswers = (participation.answers as AnswerRecord[]) || [];
    const alreadyAnswered = existingAnswers.some(
      (a) => a.questionIndex === questionIndex,
    );

    if (alreadyAnswered) {
      throw new BadRequestException('Already answered this question');
    }

    const questions = lobby.questions as QuestionSet;
    const question = questions[questionIndex];

    if (!question) {
      throw new BadRequestException('Question not found');
    }

    const correct = question.correctIndex === selectedOption;

    // Calculate points
    let pointsEarned = 0;
    let speedXpEarned = 0;

    if (correct) {
      // Check if Double-or-Nothing is active for this question
      const isDoubled = participation.doubledQ === questionIndex;

      pointsEarned = isDoubled ? BASE_POINTS * 2 : BASE_POINTS;

      // Speed bonus: max 50 XP, decreases linearly over 30 seconds
      const responseTimeSec = responseTimeMs / 1000;
      speedXpEarned = Math.max(0, Math.round(MAX_SPEED_BONUS - (responseTimeSec / (ANSWER_TIME_LIMIT_MS / 1000)) * MAX_SPEED_BONUS));
    } else {
      // If doubled and wrong, lose accumulated points for this question
      if (participation.doubledQ === questionIndex) {
        pointsEarned = -BASE_POINTS; // Penalty for wrong doubled answer
      }
    }

    // Record the answer
    const newAnswer: AnswerRecord = {
      questionIndex,
      selectedOption,
      responseTimeMs,
      correct,
      pointsEarned,
      speedXpEarned,
    };

    const updatedAnswers = [...existingAnswers, newAnswer];

    await this.prisma.participation.update({
      where: { id: participation.id },
      data: {
        answers: updatedAnswers,
        score: { increment: pointsEarned },
        speedXp: { increment: speedXpEarned },
      },
    });

    const updatedParticipation = await this.prisma.participation.findUniqueOrThrow({
      where: { id: participation.id },
    });

    return {
      correct,
      pointsEarned,
      speedXpEarned,
      totalScore: updatedParticipation.score,
    };
  }

  async activateDouble(
    code: string,
    userId: string,
    questionIndex: number,
  ): Promise<{ success: boolean }> {
    const lobby = await this.prisma.lobby.findUnique({
      where: { code },
      include: {
        participations: {
          where: { userId },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    if (lobby.status !== LobbyStatus.ACTIVE) {
      throw new BadRequestException('Lobby is not active');
    }

    const participation = lobby.participations[0];
    if (!participation) {
      throw new BadRequestException('You are not in this lobby');
    }

    if (participation.doubledQ !== null) {
      throw new BadRequestException('Double-or-Nothing already used');
    }

    const questions = lobby.questions as QuestionSet;
    const question = questions[questionIndex];

    if (!question) {
      throw new BadRequestException('Question not found');
    }

    // Only allow doubling on hard questions
    if (question.difficulty !== 'hard') {
      throw new BadRequestException('Double-or-Nothing only available for hard questions');
    }

    await this.prisma.participation.update({
      where: { id: participation.id },
      data: { doubledQ: questionIndex },
    });

    return { success: true };
  }

  async getLeaderboard(code: string): Promise<
    Array<{
      userId: string;
      score: number;
      speedXp: number;
      rank: number;
    }>
  > {
    const lobby = await this.prisma.lobby.findUnique({
      where: { code },
      include: {
        participations: {
          orderBy: { score: 'desc' },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    return lobby.participations.map((p, index) => ({
      userId: p.userId,
      score: p.score,
      speedXp: p.speedXp,
      rank: index + 1,
    }));
  }

  async getParticipationStatus(
    code: string,
    userId: string,
  ): Promise<{
    hasAnsweredCurrent: boolean;
    answeredQuestions: number[];
    doubledQuestion: number | null;
    score: number;
  }> {
    const lobby = await this.prisma.lobby.findUnique({
      where: { code },
      include: {
        participations: {
          where: { userId },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    const participation = lobby.participations[0];
    if (!participation) {
      throw new BadRequestException('You are not in this lobby');
    }

    const answers = (participation.answers as AnswerRecord[]) || [];
    const answeredQuestions = answers.map((a) => a.questionIndex);
    const hasAnsweredCurrent = answeredQuestions.includes(lobby.currentQuestion);

    return {
      hasAnsweredCurrent,
      answeredQuestions,
      doubledQuestion: participation.doubledQ,
      score: participation.score,
    };
  }
}
