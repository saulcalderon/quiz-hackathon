// User types
export type User = {
  id: string;
  balance: number;
  xp: number;
  createdAt: string;
};

// Lobby types
export type LobbyStatus = "WAITING" | "ACTIVE" | "FINISHED";

export type LobbyPlayer = {
  userId: string;
  score: number;
  speedXp: number;
  joinedAt: string;
};

export type Lobby = {
  id: string;
  code: string;
  status: LobbyStatus;
  entryFee: number;
  totalPot: number;
  currentQuestion: number;
  hasQuestions: boolean;
  players: LobbyPlayer[];
  hostId?: string;
};

// Question types
export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionForClient = {
  index: number;
  text: string;
  options: [string, string, string, string];
  difficulty: QuestionDifficulty;
};

export type AnswerSubmission = {
  questionIndex: number;
  selectedOption: 0 | 1 | 2 | 3;
  responseTimeMs: number;
};

export type LeaderboardEntry = {
  userId: string;
  score: number;
  speedXp: number;
};

export type RoundResult = {
  questionIndex: number;
  correctIndex: 0 | 1 | 2 | 3;
  leaderboard: LeaderboardEntry[];
};

// Real-time event payloads
export type PlayerJoinedPayload = {
  playerId: string;
  playerCount: number;
};

export type LobbyStartedPayload = {
  totalPot: number;
  questionCount: number;
};

export type GameOverPayload = {
  winnerId: string;
  winnerScore: number;
  payout: number;
  leaderboard: LeaderboardEntry[];
};

// Transaction types
export type TransactionType = "TOPUP" | "ENTRY" | "WIN" | "HOUSE_FEE";

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  createdAt: string;
  lobbyId?: string;
};
