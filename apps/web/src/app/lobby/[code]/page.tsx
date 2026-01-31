"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/contexts/wallet-context";
import { useLobby } from "@/hooks/use-lobby";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { PlayerGrid } from "@/components/lobby/player-grid";
import { HostControls } from "@/components/lobby/host-controls";
import { LobbyDetails } from "@/components/lobby/lobby-details";

export default function LobbyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const { userId } = useWallet();
  const { lobby, isLoading, error, leaveLobby } = useLobby(code.toUpperCase());
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGameStarted = () => {
    router.push(`/arena/${code.toUpperCase()}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <SkeletonCard />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !lobby) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <h2 className="font-heading text-2xl uppercase mb-4">
            Lobby Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This lobby doesn&apos;t exist or has been closed.
          </p>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const isHost = lobby.hostId === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={leaveLobby}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Leave Lobby
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl md:text-4xl uppercase">
            Game Lobby
          </h1>

          {/* Copy Code Button */}
          <Button
            variant="outline"
            size="md"
            onClick={handleCopyCode}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {code.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content - 2 cols */}
        <div className="md:col-span-2 space-y-6">
          {/* Lobby Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <LobbyDetails
              code={lobby.code}
              status={lobby.status}
              entryFee={lobby.entryFee}
              totalPot={lobby.totalPot}
              playerCount={lobby.players.length}
            />
          </motion.div>

          {/* Players */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-xl uppercase mb-4">Players</h2>
            <PlayerGrid players={lobby.players} hostId={lobby.hostId} currentUserId={userId} />
          </motion.div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-6">
          {/* Host Controls or Waiting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isHost ? (
              <Card>
                <h3 className="font-heading text-lg uppercase mb-4">
                  Host Controls
                </h3>
                <HostControls
                  code={lobby.code}
                  hasQuestions={lobby.hasQuestions}
                  playerCount={lobby.players.length}
                  onGameStarted={handleGameStarted}
                />
              </Card>
            ) : (
              <Card className="text-center">
                <div className="py-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 mx-auto mb-4 bg-primary border-4 border-black flex items-center justify-center"
                  >
                    <span className="font-heading text-2xl">⏳</span>
                  </motion.div>
                  <h3 className="font-heading text-lg uppercase mb-2">
                    Waiting for Host
                  </h3>
                  <p className="text-sm text-gray-600">
                    The game will start when the host is ready
                  </p>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Share Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-muted">
              <h3 className="font-heading text-sm uppercase mb-2">
                Share This Code
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Send this code to friends so they can join
              </p>
              <div className="bg-background border-4 border-black p-3 text-center">
                <span className="font-heading text-3xl tracking-[0.5em]">
                  {lobby.code}
                </span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
