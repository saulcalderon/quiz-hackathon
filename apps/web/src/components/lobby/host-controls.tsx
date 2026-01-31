"use client";

import { useState } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

interface HostControlsProps {
  code: string;
  hasQuestions: boolean;
  playerCount: number;
  onGameStarted: () => void;
}

export function HostControls({
  code,
  hasQuestions,
  playerCount,
  onGameStarted,
}: HostControlsProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  const canStart = hasQuestions && playerCount >= 2;

  const handleStart = async () => {
    setIsStarting(true);
    setError("");

    try {
      await api.post(`/lobbies/${code}/start`);
      onGameStarted();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to start game");
      }
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status messages */}
      {!hasQuestions && (
        <div className="flex items-center gap-2 p-3 bg-primary/20 border-4 border-primary text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating questions...
        </div>
      )}

      {hasQuestions && playerCount < 2 && (
        <div className="flex items-center gap-2 p-3 bg-muted border-4 border-black text-sm">
          <AlertCircle className="w-4 h-4" />
          Need at least 2 players to start
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-100 border-4 border-red-500 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Start Button */}
      <Button
        variant="accent"
        size="lg"
        onClick={handleStart}
        disabled={!canStart || isStarting}
        isLoading={isStarting}
        className="w-full text-xl py-6"
      >
        <Play className="w-6 h-6 mr-2" />
        Start Game
      </Button>

      <p className="text-xs text-center text-gray-500">
        {canStart
          ? "All players will be charged the entry fee when you start"
          : "Share the code with friends to fill the lobby"}
      </p>
    </div>
  );
}
