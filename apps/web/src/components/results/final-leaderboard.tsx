"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types";
import { formatCredits } from "@/lib/utils";

interface FinalLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
}

export function FinalLeaderboard({
  leaderboard,
  currentUserId,
}: FinalLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-5 h-5 text-primary" />;
      case 1:
        return <Medal className="w-5 h-5 text-secondary" />;
      case 2:
        return <Award className="w-5 h-5 text-accent" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 0:
        return "bg-primary/20";
      case 1:
        return "bg-secondary/20";
      case 2:
        return "bg-accent/20";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardTitle className="mb-4">Final Standings</CardTitle>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;

            return (
              <motion.div
                key={entry.userId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 p-3
                  border-4 border-black
                  ${getRankBg(index)}
                  ${isCurrentUser ? "ring-2 ring-primary ring-offset-2" : ""}
                `}
              >
                {/* Rank */}
                <div className="w-10 h-10 flex items-center justify-center bg-background border-2 border-black font-heading text-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(index)}
                </div>

                {/* Avatar */}
                <Avatar userId={entry.userId} size="sm" />

                {/* Name */}
                <div className="flex-1">
                  <div className="font-heading text-sm uppercase">
                    {isCurrentUser ? "You" : `Player ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{formatCredits(entry.speedXp)} XP
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="font-heading text-lg">
                    {formatCredits(entry.score)}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
