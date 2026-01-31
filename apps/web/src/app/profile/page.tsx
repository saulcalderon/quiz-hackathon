"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Coins, Star, User, Calendar, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { api } from "@/lib/api";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCredits } from "@/lib/utils";
import { Transaction } from "@/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const { balance, xp, isLoading: isWalletLoading, refetch: refetchWallet, paymentCount } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoadingTransactions(true);
      const data = await api.get<Transaction[]>("/users/me/transactions");
      // Ensure it's always an array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchWallet(), fetchTransactions()]);
    setIsRefreshing(false);
  };

  // Fetch transactions on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  // Refresh transactions when a new payment is made
  useEffect(() => {
    if (user && paymentCount > 0) {
      fetchTransactions();
    }
  }, [paymentCount, user, fetchTransactions]);

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "TOPUP":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "WIN":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "ENTRY":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "HOUSE_FEE":
        return <Minus className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getTransactionLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "TOPUP":
        return "Top Up";
      case "WIN":
        return "Win";
      case "ENTRY":
        return "Game Entry";
      case "HOUSE_FEE":
        return "House Fee";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-start justify-between"
      >
        <div>
          <h1 className="font-heading text-4xl md:text-5xl uppercase mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your tokens and view your history</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - User Info & Balance */}
        <div className="space-y-6">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardTitle className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="font-heading text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">User ID</label>
                  <p className="font-mono text-sm text-gray-600 break-all">{user.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Member Since</label>
                    <p className="text-sm">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-primary">
              <CardTitle className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5" />
                Available Tokens
              </CardTitle>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-background border-4 border-black flex items-center justify-center">
                    <Coins className="w-8 h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 uppercase">Balance</label>
                    <p className="font-heading text-3xl">
                      {isWalletLoading ? "..." : formatCredits(balance)}
                    </p>
                    <p className="text-xs text-gray-600">Tokens available to bet</p>
                  </div>
                </div>
                <div className="pt-4 border-t-4 border-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Experience (XP)</span>
                    </div>
                    <span className="font-heading text-xl">
                      {isWalletLoading ? "..." : formatCredits(xp)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardTitle className="mb-4">Transaction History</CardTitle>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-muted border-4 border-black"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getTransactionIcon(transaction.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm">
                            {getTransactionLabel(transaction.type)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {transaction.lobby 
                              ? `Lobby: ${transaction.lobby.code}` 
                              : transaction.type === "TOPUP" 
                                ? "Stripe Payment" 
                                : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-heading text-lg ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCredits(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
