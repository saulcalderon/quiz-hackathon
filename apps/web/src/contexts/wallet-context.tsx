"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { api } from "@/lib/api";
import { User } from "@/types";

interface WalletContextType {
  userId: string | null;  // Internal database user ID
  balance: number;
  xp: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  topUp: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { user, session } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!user || !session) {
      setUserId(null);
      setBalance(0);
      setXp(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ data: User }>("/users/me");
      setUserId(response.data.id);
      setBalance(response.data.balance);
      setXp(response.data.xp);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setError("Failed to load balance");
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  const topUp = useCallback(
    async (amount: number) => {
      if (!user) return;

      try {
        setError(null);
        const response = await api.post<{ data: User }>("/users/me/topup", { amount });
        setBalance(response.data.balance);
        setXp(response.data.xp);
      } catch (err) {
        console.error("Failed to top up:", err);
        setError("Failed to top up");
        throw err;
      }
    },
    [user]
  );

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <WalletContext.Provider
      value={{
        userId,
        balance,
        xp,
        isLoading,
        error,
        refetch: fetchBalance,
        topUp,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
