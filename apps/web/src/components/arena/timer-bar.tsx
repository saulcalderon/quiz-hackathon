"use client";

import { motion } from "framer-motion";

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

export function TimerBar({ timeRemaining, totalTime }: TimerBarProps) {
  const percentage = (timeRemaining / totalTime) * 100;

  const getColor = () => {
    if (percentage > 50) return "bg-accent";
    if (percentage > 25) return "bg-primary";
    return "bg-red-500";
  };

  return (
    <div className="w-full h-4 bg-muted border-4 border-black overflow-hidden">
      <motion.div
        className={`h-full ${getColor()}`}
        initial={{ width: "100%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
      />
    </div>
  );
}
