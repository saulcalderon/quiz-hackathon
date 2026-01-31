"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WinnerReveal } from "@/components/results/winner-reveal";
import { Podium } from "@/components/results/podium";
import { FinalLeaderboard } from "@/components/results/final-leaderboard";
import { LeaderboardEntry, Lobby } from "@/types";
import { formatCredits } from "@/lib/utils";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { refetch: refetchWallet } = useWallet();

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [lobbyData, leaderboardData] = await Promise.all([
          api.get<Lobby>(`/lobbies/${code}`),
          api.get<LeaderboardEntry[]>(`/lobbies/${code}/leaderboard`),
        ]);

        setLobby(lobbyData);
        setLeaderboard(leaderboardData);

        // Refresh wallet balance
        await refetchWallet();
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to load results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [code, refetchWallet]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-40 mb-8" />
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-32 h-48" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !lobby) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <h2 className="font-heading text-2xl uppercase mb-4">
            Results Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Could not load the game results.
          </p>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const winnerId = leaderboard[0]?.userId;
  const isWinner = winnerId === user?.id;
  const userRank = leaderboard.findIndex((e) => e.userId === user?.id) + 1;
  const payout = Math.floor(lobby.totalPot * 0.9);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Winner Reveal */}
      <WinnerReveal isWinner={isWinner} payout={payout} rank={userRank} />

      {/* Podium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Podium
          leaderboard={leaderboard}
          currentUserId={user?.id}
          payout={payout}
        />
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 grid grid-cols-3 gap-4 mb-8"
      >
        <Card className="text-center py-4">
          <div className="font-heading text-2xl">
            {formatCredits(lobby.totalPot)}
          </div>
          <div className="text-xs text-gray-500 uppercase">Total Pot</div>
        </Card>
        <Card className="text-center py-4 bg-primary">
          <div className="font-heading text-2xl">
            {formatCredits(payout)}
          </div>
          <div className="text-xs uppercase">Winner Payout</div>
        </Card>
        <Card className="text-center py-4">
          <div className="font-heading text-2xl">
            {leaderboard.length}
          </div>
          <div className="text-xs text-gray-500 uppercase">Players</div>
        </Card>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-8"
      >
        <FinalLeaderboard leaderboard={leaderboard} currentUserId={user?.id} />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/dashboard")}
          className="flex-1"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            navigator.share?.({
              title: "StakeStudy Results",
              text: isWinner
                ? `I just won ${formatCredits(payout)} credits on StakeStudy!`
                : `I just played StakeStudy and placed #${userRank}!`,
              url: window.location.href,
            });
          }}
          className="flex-1"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Results
        </Button>
      </motion.div>
    </div>
  );
}
