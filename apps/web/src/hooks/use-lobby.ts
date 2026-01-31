"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { Lobby } from "@/types";

export function useLobby(code: string) {
  const router = useRouter();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLobby = useCallback(async () => {
    try {
      const data = await api.get<Lobby>(`/lobbies/${code}`);
      setLobby(data);
      setError(null);
    } catch (err) {
      setError("Failed to load lobby");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchLobby();

    // Subscribe to real-time updates
    const supabase = createClient();
    const channel = supabase.channel(`lobby:${code}`);

    channel
      .on("broadcast", { event: "player_joined" }, () => {
        // Refetch lobby to get updated player list
        fetchLobby();
      })
      .on("broadcast", { event: "lobby_started" }, () => {
        // Navigate to arena
        router.push(`/arena/${code}`);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code, fetchLobby, router]);

  return {
    lobby,
    isLoading,
    error,
    refetch: fetchLobby,
  };
}
