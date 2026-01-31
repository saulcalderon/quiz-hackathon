"use client";

import { motion } from "framer-motion";
import { QuestionForClient } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TimerBar } from "./timer-bar";

interface QuestionCardProps {
  question: QuestionForClient;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  totalTime: number;
}

const difficultyVariants = {
  easy: "primary",
  medium: "secondary",
  hard: "accent",
} as const;

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  totalTime,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border-4 border-black shadow-brutal"
    >
      {/* Timer */}
      <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <span className="font-heading text-sm uppercase text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge variant={difficultyVariants[question.difficulty]}>
            {question.difficulty}
          </Badge>
        </div>
        <div className="font-heading text-2xl tabular-nums">
          {timeRemaining}s
        </div>
      </div>

      {/* Question */}
      <div className="p-6 md:p-8">
        <h2 className="font-heading text-2xl md:text-3xl uppercase leading-tight">
          {question.text}
        </h2>
      </div>
    </motion.div>
  );
}
