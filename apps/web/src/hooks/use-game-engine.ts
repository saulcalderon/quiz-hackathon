"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import {
  QuestionForClient,
  LeaderboardEntry,
  RoundResult,
  Lobby,
} from "@/types";

const QUESTION_TIME = 20; // seconds

export type GameStatus = "loading" | "waiting" | "playing" | "round_end" | "finished";

export interface GameState {
  status: GameStatus;
  lobby: Lobby | null;
  currentQuestion: QuestionForClient | null;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  leaderboard: LeaderboardEntry[];
  previousRanks: Map<string, number>;
  selectedAnswer: number | null;
  correctAnswer: number | null;
  hasAnswered: boolean;
  isDoubled: boolean;
  hasUsedDouble: boolean;
  error: string | null;
}

export interface GameActions {
  submitAnswer: (optionIndex: number) => Promise<void>;
  activateDouble: () => Promise<void>;
  advanceQuestion: () => Promise<void>;
  finishGame: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGameEngine(code: string, _userId?: string): GameState & GameActions {
  const router = useRouter();

  // Game state
  const [status, setStatus] = useState<GameStatus>("loading");
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionForClient | null>(null);
  const [totalQuestions] = useState(10);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [previousRanks, setPreviousRanks] = useState<Map<string, number>>(new Map());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isDoubled, setIsDoubled] = useState(false);
  const [hasUsedDouble, setHasUsedDouble] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const answerStartTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch game state
  const fetchGameState = useCallback(async () => {
    try {
      setError(null);
      const [lobbyData, questionData, leaderboardData] = await Promise.all([
        api.get<Lobby>(`/lobbies/${code}`),
        api.get<QuestionForClient | { finished: boolean }>(`/lobbies/${code}/question`),
        api.get<LeaderboardEntry[]>(`/lobbies/${code}/leaderboard`),
      ]);

      setLobby(lobbyData);
      setLeaderboard(leaderboardData);
      if ("finished" in questionData && questionData.finished) {
        setStatus("finished");
        router.push(`/results/${code}`);
        return;
      }

      if ("text" in questionData) {
        setCurrentQuestion(questionData);
        answerStartTime.current = Date.now();
        setTimeRemaining(QUESTION_TIME);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setHasAnswered(false);
        setIsDoubled(false);
        setStatus("playing");
      } else {
        setStatus("waiting");
      }
    } catch (err) {
      console.error("Failed to fetch game state:", err);
      setError("Failed to load game");
      setStatus("waiting");
    }
  }, [code, router]);

  // Initial load - this is an intentional fetch on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGameState();
  }, [fetchGameState]);

  // Timer countdown
  useEffect(() => {
    if (status !== "playing" || hasAnswered || correctAnswer !== null) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, hasAnswered, correctAnswer]);

  // Real-time subscriptions
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`lobby:${code}`);

    channel
      .on("broadcast", { event: "question" }, ({ payload }) => {
        const question = payload as QuestionForClient;
        setCurrentQuestion(question);
        answerStartTime.current = Date.now();
        setTimeRemaining(QUESTION_TIME);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setHasAnswered(false);
        setIsDoubled(false);
        setStatus("playing");
      })
      .on("broadcast", { event: "round_end" }, ({ payload }) => {
        const result = payload as RoundResult;

        // Store previous ranks for animation
        const newPreviousRanks = new Map<string, number>();
        leaderboard.forEach((entry, index) => {
          newPreviousRanks.set(entry.userId, index);
        });
        setPreviousRanks(newPreviousRanks);

        // Update state
        setCorrectAnswer(result.correctIndex);
        setLeaderboard(result.leaderboard);
        setStatus("round_end");
      })
      .on("broadcast", { event: "game_over" }, () => {
        setStatus("finished");
        router.push(`/results/${code}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code, router, leaderboard]);

  // Actions
  const submitAnswer = useCallback(
    async (optionIndex: number) => {
      if (hasAnswered || correctAnswer !== null || !currentQuestion) return;

      const responseTime = Date.now() - answerStartTime.current;
      setSelectedAnswer(optionIndex);
      setHasAnswered(true);

      try {
        await api.post(`/lobbies/${code}/answer`, {
          questionIndex: currentQuestion.index,
          selectedOption: optionIndex,
          responseTimeMs: responseTime,
        });
      } catch (err) {
        console.error("Failed to submit answer:", err);
        setError("Failed to submit answer");
      }
    },
    [code, currentQuestion, hasAnswered, correctAnswer]
  );

  const activateDouble = useCallback(async () => {
    if (hasUsedDouble || !currentQuestion) return;

    try {
      await api.post(`/lobbies/${code}/double`, {
        questionIndex: currentQuestion.index,
      });
      setHasUsedDouble(true);
      setIsDoubled(true);
    } catch (err) {
      console.error("Failed to activate double:", err);
      setError("Failed to activate double");
    }
  }, [code, currentQuestion, hasUsedDouble]);

  const advanceQuestion = useCallback(async () => {
    try {
      const result = await api.post<{ finished?: boolean }>(`/lobbies/${code}/next`);
      if (result.finished) {
        // No more questions - finish the game and distribute winnings
        await api.post(`/lobbies/${code}/finish`);
        setStatus("finished");
        router.push(`/results/${code}`);
      } else {
        await fetchGameState();
      }
    } catch (err) {
      console.error("Failed to advance:", err);
      setError("Failed to advance question");
    }
  }, [code, router, fetchGameState]);

  const finishGame = useCallback(async () => {
    try {
      await api.post(`/lobbies/${code}/finish`);
      setStatus("finished");
      router.push(`/results/${code}`);
    } catch (err) {
      console.error("Failed to finish game:", err);
      setError("Failed to finish game");
    }
  }, [code, router]);

  return {
    // State
    status,
    lobby,
    currentQuestion,
    questionIndex: currentQuestion?.index ?? 0,
    totalQuestions,
    timeRemaining,
    leaderboard,
    previousRanks,
    selectedAnswer,
    correctAnswer,
    hasAnswered,
    isDoubled,
    hasUsedDouble,
    error,
    // Actions
    submitAnswer,
    activateDouble,
    advanceQuestion,
    finishGame,
    refetch: fetchGameState,
  };
}
