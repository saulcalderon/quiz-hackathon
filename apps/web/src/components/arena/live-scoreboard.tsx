"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/types";
import { formatCredits } from "@/lib/utils";

interface LiveScoreboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
  previousRanks?: Map<string, number>;
}

export function LiveScoreboard({
  leaderboard,
  currentUserId,
  previousRanks,
}: LiveScoreboardProps) {
  const getRankChange = (userId: string, currentRank: number) => {
    if (!previousRanks) return 0;
    const prevRank = previousRanks.get(userId);
    if (prevRank === undefined) return 0;
    return prevRank - currentRank; // Positive = moved up
  };

  return (
    <div className="bg-background border-4 border-black shadow-brutal">
      <div className="p-3 border-b-4 border-black bg-secondary text-white">
        <h3 className="font-heading text-sm uppercase">Live Scores</h3>
      </div>

      <div className="divide-y-4 divide-black">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((entry, index) => {
            const rankChange = getRankChange(entry.userId, index);
            const isCurrentUser = entry.userId === currentUserId;

            return (
              <motion.div
                key={entry.userId || `player-${index}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`
                  flex items-center gap-3 p-3
                  ${isCurrentUser ? "bg-primary/20" : ""}
                `}
              >
                {/* Rank */}
                <div
                  className={`
                  w-8 h-8 flex items-center justify-center
                  font-heading text-lg
                  ${index === 0 ? "bg-primary" : index === 1 ? "bg-secondary text-white" : index === 2 ? "bg-accent" : "bg-muted"}
                  border-2 border-black
                `}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <Avatar userId={entry.userId} size="sm" />

                {/* Name & Score */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-sm truncate">
                    {isCurrentUser ? "You" : `Player ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatCredits(entry.score)} pts
                  </div>
                </div>

                {/* Rank Change */}
                {rankChange !== 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      flex items-center gap-0.5 text-xs font-medium
                      ${rankChange > 0 ? "text-accent" : "text-red-500"}
                    `}
                  >
                    {rankChange > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(rankChange)}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
