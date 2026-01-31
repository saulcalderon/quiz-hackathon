"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LobbyPlayer } from "@/types";

interface PlayerGridProps {
  players: LobbyPlayer[];
  hostId?: string;
  currentUserId?: string | null;
}

export function PlayerGrid({ players, hostId, currentUserId }: PlayerGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {players.map((player, index) => (
          <motion.div
            key={player.userId}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: index * 0.05,
            }}
            className="relative"
          >
            <div className={`bg-background border-4 shadow-brutal p-4 flex flex-col items-center ${
              player.userId === currentUserId ? 'border-accent' : 'border-black'
            }`}>
              {/* Host Crown */}
              {player.userId === hostId && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary border-4 border-black flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
              )}

              <Avatar userId={player.userId} size="lg" className="mb-2" />

              <div className="font-heading text-sm uppercase truncate w-full text-center">
                {player.userId === currentUserId ? 'You' : `Player ${index + 1}`}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {player.score} pts
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 4 - players.length) }).map(
          (_, index) => (
            <motion.div
              key={`empty-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted border-4 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center min-h-[140px]"
            >
              <div className="w-16 h-16 bg-gray-200 border-4 border-dashed border-gray-300 mb-2" />
              <span className="text-gray-400 text-sm">Waiting...</span>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
