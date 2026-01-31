"use client";

import { motion } from "framer-motion";

interface OptionGridProps {
  options: [string, string, string, string];
  selectedOption: number | null;
  correctOption: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
}

const optionLabels = ["A", "B", "C", "D"];
const optionColors = [
  "bg-primary",
  "bg-secondary text-white",
  "bg-accent",
  "bg-orange-400",
];

export function OptionGrid({
  options,
  selectedOption,
  correctOption,
  disabled,
  onSelect,
}: OptionGridProps) {
  const getOptionStyle = (index: number) => {
    // Show correct/incorrect after answer revealed
    if (correctOption !== null) {
      if (index === correctOption) {
        return "bg-accent border-accent";
      }
      if (index === selectedOption && index !== correctOption) {
        return "bg-red-500 text-white border-red-500";
      }
      return "bg-muted opacity-50";
    }

    // Selected state
    if (index === selectedOption) {
      return `${optionColors[index]} shadow-none translate-x-2 translate-y-2`;
    }

    // Default state
    return `${optionColors[index]}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <motion.button
          key={index}
          onClick={() => !disabled && onSelect(index)}
          disabled={disabled}
          className={`
            relative
            p-4 md:p-6
            border-4 border-black
            text-left
            transition-all duration-100
            ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            ${getOptionStyle(index)}
            ${selectedOption === null && !disabled ? "shadow-brutal hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1" : ""}
          `}
          whileTap={!disabled && selectedOption === null ? { scale: 0.98 } : {}}
        >
          <div className="flex items-start gap-3">
            <span
              className={`
              w-10 h-10 flex-shrink-0
              flex items-center justify-center
              font-heading text-xl
              ${correctOption !== null ? "bg-black/10" : "bg-black/20"}
              border-2 border-black/30
            `}
            >
              {optionLabels[index]}
            </span>
            <span className="font-medium text-lg leading-tight pt-1.5">
              {option}
            </span>
          </div>

          {/* Selected indicator */}
          {selectedOption === index && correctOption === null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-black text-white flex items-center justify-center text-sm"
            >
              ✓
            </motion.div>
          )}

          {/* Correct indicator */}
          {correctOption === index && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-8 h-8 bg-black text-white flex items-center justify-center text-lg"
            >
              ✓
            </motion.div>
          )}

          {/* Wrong indicator */}
          {selectedOption === index &&
            correctOption !== null &&
            correctOption !== index && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-8 h-8 bg-white text-red-500 border-2 border-red-500 flex items-center justify-center text-lg"
              >
                ✗
              </motion.div>
            )}
        </motion.button>
      ))}
    </div>
  );
}
