export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type Question = {
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
};

export type QuestionSet = Question[];

export type QuestionForClient = Omit<Question, 'correctIndex'> & {
  index: number;
};

export type AnswerSubmission = {
  questionIndex: number;
  selectedOption: 0 | 1 | 2 | 3;
  responseTimeMs: number;
};

export type RoundResult = {
  questionIndex: number;
  correctIndex: 0 | 1 | 2 | 3;
  leaderboard: LeaderboardEntry[];
};

export type LeaderboardEntry = {
  userId: string;
  score: number;
  speedXp: number;
};
