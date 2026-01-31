"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionCard } from "@/components/arena/question-card";
import { OptionGrid } from "@/components/arena/option-grid";
import { WagerModal } from "@/components/arena/wager-modal";
import { LiveScoreboard } from "@/components/arena/live-scoreboard";
import { HostArenaControls } from "@/components/arena/host-arena-controls";
import {
  QuestionForClient,
  LeaderboardEntry,
  RoundResult,
  Lobby,
} from "@/types";
import { formatCredits } from "@/lib/utils";

const QUESTION_TIME = 20; // seconds

export default function ArenaPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  // Game state
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionForClient | null>(null);
  const [totalQuestions] = useState(10);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [previousRanks, setPreviousRanks] = useState<Map<string, number>>(
    new Map()
  );

  // UI state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Wager state
  const [showWagerModal, setShowWagerModal] = useState(false);
  const [hasUsedDouble, setHasUsedDouble] = useState(false);
  const [isDoubledQuestion, setIsDoubledQuestion] = useState(false);

  // Refs
  const answerStartTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isHost = lobby?.hostId === user?.id;

  // Fetch initial data
  const fetchGameState = useCallback(async () => {
    try {
      const [lobbyData, questionData, leaderboardData] = await Promise.all([
        api.get<Lobby>(`/lobbies/${code}`),
        api.get<QuestionForClient | { finished: boolean }>(
          `/lobbies/${code}/question`
        ),
        api.get<LeaderboardEntry[]>(`/lobbies/${code}/leaderboard`),
      ]);

      setLobby(lobbyData);
      setLeaderboard(leaderboardData);

      if ("finished" in questionData && questionData.finished) {
        router.push(`/results/${code}`);
        return;
      }

      if ("text" in questionData) {
        setCurrentQuestion(questionData);
        answerStartTime.current = Date.now();
        setTimeRemaining(QUESTION_TIME);
        setSelectedOption(null);
        setCorrectOption(null);
        setHasAnswered(false);
        setIsDoubledQuestion(false);
      }
    } catch (error) {
      console.error("Failed to fetch game state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [code, router]);

  // Initial load
  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  // Timer countdown
  useEffect(() => {
    if (!currentQuestion || hasAnswered || correctOption !== null) return;

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
  }, [currentQuestion, hasAnswered, correctOption]);

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
        setSelectedOption(null);
        setCorrectOption(null);
        setHasAnswered(false);
        setIsDoubledQuestion(false);

        // Show wager modal if not used yet (random chance for demo)
        if (!hasUsedDouble && Math.random() > 0.5) {
          setShowWagerModal(true);
        }
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
        setCorrectOption(result.correctIndex);
        setLeaderboard(result.leaderboard);
      })
      .on("broadcast", { event: "game_over" }, () => {
        router.push(`/results/${code}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code, router, hasUsedDouble, leaderboard]);

  const handleSelectOption = async (optionIndex: number) => {
    if (hasAnswered || correctOption !== null) return;

    const responseTime = Date.now() - answerStartTime.current;
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    try {
      await api.post(`/lobbies/${code}/answer`, {
        questionIndex: currentQuestion?.index ?? 0,
        selectedOption: optionIndex,
        responseTimeMs: responseTime,
      });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const handleDouble = async () => {
    if (hasUsedDouble || !currentQuestion) return;

    try {
      await api.post(`/lobbies/${code}/double`, {
        questionIndex: currentQuestion.index,
      });
      setHasUsedDouble(true);
      setIsDoubledQuestion(true);
      setShowWagerModal(false);
    } catch (error) {
      console.error("Failed to activate double:", error);
    }
  };

  const handleAdvance = () => {
    fetchGameState();
  };

  const handleFinish = () => {
    router.push(`/results/${code}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-64 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <h2 className="font-heading text-2xl uppercase mb-4">
            Waiting for Questions
          </h2>
          <p className="text-gray-600">
            The game is being set up. Please wait...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-xl md:text-2xl uppercase">Arena</h1>
          {isDoubledQuestion && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-primary border-2 border-black"
            >
              <Zap className="w-4 h-4" />
              <span className="font-heading text-sm">2X</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-secondary text-white border-2 border-black">
            <Trophy className="w-4 h-4" />
            <span className="font-heading text-sm">
              {formatCredits(lobby?.totalPot ?? 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content - 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            questionNumber={(currentQuestion.index ?? 0) + 1}
            totalQuestions={totalQuestions}
            timeRemaining={timeRemaining}
            totalTime={QUESTION_TIME}
          />

          {/* Options */}
          <OptionGrid
            options={currentQuestion.options}
            selectedOption={selectedOption}
            correctOption={correctOption}
            disabled={hasAnswered || timeRemaining === 0}
            onSelect={handleSelectOption}
          />

          {/* Host Controls */}
          {isHost && correctOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HostArenaControls
                code={code}
                canAdvance={true}
                onAdvance={handleAdvance}
                onFinish={handleFinish}
              />
            </motion.div>
          )}

          {/* Waiting message for non-hosts */}
          {!isHost && correctOption !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-4 bg-muted border-4 border-black"
            >
              <p className="font-heading uppercase">
                Waiting for host to continue...
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-4">
          {/* Double Down Button */}
          {!hasUsedDouble && !hasAnswered && correctOption === null && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowWagerModal(true)}
              className="w-full"
            >
              <Zap className="w-5 h-5 mr-2" />
              Double Down
            </Button>
          )}

          {/* Scoreboard */}
          <LiveScoreboard
            leaderboard={leaderboard}
            currentUserId={user?.id}
            previousRanks={previousRanks}
          />
        </div>
      </div>

      {/* Wager Modal */}
      <WagerModal
        isOpen={showWagerModal}
        onClose={() => setShowWagerModal(false)}
        onConfirm={handleDouble}
        hasUsedDouble={hasUsedDouble}
      />
    </div>
  );
}
