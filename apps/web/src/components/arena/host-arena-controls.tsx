"use client";

import { useState } from "react";
import { SkipForward, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface HostArenaControlsProps {
  code: string;
  canAdvance: boolean;
  onAdvance: () => void;
  onFinish: () => void;
}

export function HostArenaControls({
  code,
  canAdvance,
  onAdvance,
  onFinish,
}: HostArenaControlsProps) {
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleAdvance = async () => {
    setIsAdvancing(true);
    try {
      const result = await api.post<{ finished?: boolean }>(
        `/lobbies/${code}/next`
      );
      if (result.finished) {
        // No more questions - finish the game and distribute winnings
        await api.post(`/lobbies/${code}/finish`);
        onFinish();
      } else {
        onAdvance();
      }
    } catch (error) {
      console.error("Failed to advance:", error);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await api.post(`/lobbies/${code}/finish`);
      onFinish();
    } catch (error) {
      console.error("Failed to finish:", error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="primary"
        size="md"
        onClick={handleAdvance}
        isLoading={isAdvancing}
        disabled={!canAdvance}
        className="flex-1"
      >
        <SkipForward className="w-4 h-4 mr-1" />
        Next Question
      </Button>

      <Button
        variant="secondary"
        size="md"
        onClick={handleFinish}
        isLoading={isFinishing}
      >
        <Flag className="w-4 h-4 mr-1" />
        End Game
      </Button>
    </div>
  );
}
