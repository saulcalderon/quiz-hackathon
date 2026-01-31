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
  /** Increments each time a successful payment is made - useful for triggering transaction refreshes */
  paymentCount: number;
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
  const [paymentCount, setPaymentCount] = useState(0);

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
      const data = await api.get<User>("/users/me");
      setUserId(data.id);
      setBalance(data.balance);
      setXp(data.xp);
      // Increment payment count to trigger transaction refresh in profile page
      setPaymentCount((prev) => prev + 1);
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
        const data = await api.post<User>("/users/me/topup", { amount });
        setBalance(data.balance);
        setXp(data.xp);
        setPaymentCount((prev) => prev + 1);
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
        paymentCount,
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
