"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Coins } from "lucide-react";
import { formatCredits } from "@/lib/utils";

interface WinnerRevealProps {
  isWinner: boolean;
  payout: number;
  rank: number;
}

export function WinnerReveal({ isWinner, payout, rank }: WinnerRevealProps) {
  useEffect(() => {
    if (isWinner) {
      // Fire confetti!
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#FFFF00", "#A020F0", "#00FF00"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isWinner]);

  if (isWinner) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-24 h-24 bg-primary border-4 border-black shadow-brutal mb-4"
        >
          <Trophy className="w-12 h-12" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-5xl md:text-7xl uppercase mb-2"
        >
          You Won!
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-2xl"
        >
          <Coins className="w-8 h-8" />
          <span className="font-heading text-4xl">
            +{formatCredits(payout)}
          </span>
          <span className="text-gray-600">credits</span>
        </motion.div>
      </motion.div>
    );
  }

  // Non-winner display
  const messages = [
    "Better luck next time!",
    "So close!",
    "Keep studying!",
  ];
  const message = messages[Math.min(rank - 1, messages.length - 1)];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary text-white border-4 border-black shadow-brutal mb-4">
        <span className="font-heading text-3xl">#{rank}</span>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl uppercase mb-2">
        {message}
      </h1>

      <p className="text-gray-600">
        You placed #{rank} this round. Study harder and try again!
      </p>
    </motion.div>
  );
}
