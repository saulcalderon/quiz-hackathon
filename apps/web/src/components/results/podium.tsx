"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/types";
import { formatCredits } from "@/lib/utils";

interface PodiumProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
  payout: number;
}

export function Podium({ leaderboard, currentUserId, payout }: PodiumProps) {
  const top3 = leaderboard.slice(0, 3);

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = ["h-32", "h-44", "h-24"];
  const delays = [0.3, 0.1, 0.5];
  const colors = ["bg-secondary", "bg-primary", "bg-accent"];
  const positions = ["2nd", "1st", "3rd"];

  return (
    <div className="flex items-end justify-center gap-4 mt-8">
      {podiumOrder.map((entry, index) => {
        if (!entry) return null;

        const actualPosition = index === 1 ? 0 : index === 0 ? 1 : 2;
        const isWinner = actualPosition === 0;
        const isCurrentUser = entry.userId === currentUserId;

        return (
          <motion.div
            key={entry.userId}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: delays[index],
            }}
            className="flex flex-col items-center"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delays[index] + 0.2 }}
              className="relative mb-2"
            >
              {isWinner && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2"
                >
                  <Crown className="w-8 h-8 text-primary fill-primary" />
                </motion.div>
              )}
              <Avatar
                userId={entry.userId}
                size={isWinner ? "xl" : "lg"}
                className={isCurrentUser ? "ring-4 ring-primary" : ""}
              />
            </motion.div>

            {/* Name */}
            <div className="font-heading text-sm uppercase mb-1">
              {isCurrentUser ? "You" : `Player ${actualPosition + 1}`}
            </div>

            {/* Score */}
            <div className="text-sm text-gray-600 mb-2">
              {formatCredits(entry.score)} pts
            </div>

            {/* Podium block */}
            <div
              className={`
                w-24 md:w-32 ${heights[index]} ${colors[index]}
                border-4 border-black
                flex flex-col items-center justify-start pt-4
              `}
            >
              <div className="font-heading text-2xl md:text-3xl">
                {positions[index]}
              </div>
              {isWinner && (
                <div className="text-xs mt-1 font-medium">
                  +{formatCredits(payout)}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
