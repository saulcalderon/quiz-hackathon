"use client";

import { Coins, Users, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCredits } from "@/lib/utils";
import { LobbyStatus } from "@/types";

interface LobbyDetailsProps {
  code: string;
  status: LobbyStatus;
  entryFee: number;
  totalPot: number;
  playerCount: number;
}

export function LobbyDetails({
  code,
  status,
  entryFee,
  totalPot,
  playerCount,
}: LobbyDetailsProps) {
  const potentialPot = entryFee * playerCount;

  return (
    <Card className="bg-secondary text-white">
      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={status} />
        <div className="font-heading text-2xl tracking-[0.3em]">{code}</div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="w-10 h-10 mx-auto mb-2 bg-white/20 border-2 border-white/40 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div className="font-heading text-lg">{formatCredits(entryFee)}</div>
          <div className="text-xs text-white/70 uppercase">Entry Fee</div>
        </div>

        <div>
          <div className="w-10 h-10 mx-auto mb-2 bg-white/20 border-2 border-white/40 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="font-heading text-lg">{playerCount}</div>
          <div className="text-xs text-white/70 uppercase">Players</div>
        </div>

        <div>
          <div className="w-10 h-10 mx-auto mb-2 bg-primary text-black border-2 border-white/40 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="font-heading text-lg">
            {formatCredits(status === "ACTIVE" ? totalPot : potentialPot)}
          </div>
          <div className="text-xs text-white/70 uppercase">
            {status === "ACTIVE" ? "Total Pot" : "Potential Pot"}
          </div>
        </div>
      </div>
    </Card>
  );
}
