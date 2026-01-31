"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Plus, Star, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatCredits } from "@/lib/utils";

export function WalletHeader() {
  const { signOut } = useAuth();
  const { balance, xp, isLoading, topUp } = useWallet();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isTopingUp, setIsTopingUp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTopUp = async (amount: number) => {
    setIsTopingUp(true);
    try {
      await topUp(amount);
      setShowTopUpModal(false);
    } catch (error) {
      console.error("Top up failed:", error);
    } finally {
      setIsTopingUp(false);
    }
  };

  const topUpOptions = [
    { amount: 100, price: "$1" },
    { amount: 500, price: "$5" },
    { amount: 1000, price: "$10" },
    { amount: 2500, price: "$25" },
  ];

  return (
    <>
      <header className="bg-background border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary border-4 border-black flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="font-heading text-xl uppercase hidden sm:block">
              StakeStudy
            </span>
          </div>

          {/* Desktop: Wallet & User */}
          <div className="hidden md:flex items-center gap-4">
            {/* XP Badge */}
            <div className="flex items-center gap-1 px-3 py-1 bg-secondary text-white border-4 border-black">
              <Star className="w-4 h-4" />
              <span className="font-heading text-sm">
                {isLoading ? "..." : formatCredits(xp)} XP
              </span>
            </div>

            {/* Credits Display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-4 py-2 bg-primary border-4 border-black">
                <Coins className="w-5 h-5" />
                <span className="font-heading text-lg">
                  {isLoading ? "..." : formatCredits(balance)}
                </span>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowTopUpModal(true)}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Top Up
              </Button>
            </div>

            {/* Sign Out */}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t-4 border-black overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Credits & XP */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-2 bg-primary border-4 border-black">
                      <Coins className="w-5 h-5" />
                      <span className="font-heading">
                        {isLoading ? "..." : formatCredits(balance)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-2 bg-secondary text-white border-4 border-black">
                      <Star className="w-4 h-4" />
                      <span className="font-heading text-sm">
                        {isLoading ? "..." : formatCredits(xp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => {
                      setShowTopUpModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Top Up
                  </Button>
                  <Button variant="outline" size="md" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Top Up Modal */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Top Up Credits"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select a package to add credits to your wallet.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {topUpOptions.map((option) => (
              <Button
                key={option.amount}
                variant="outline"
                onClick={() => handleTopUp(option.amount)}
                disabled={isTopingUp}
                className="flex flex-col items-center py-4"
              >
                <span className="font-heading text-2xl">
                  {formatCredits(option.amount)}
                </span>
                <span className="text-sm text-gray-600">{option.price}</span>
              </Button>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">
            This is a demo. In production, this would connect to a payment
            processor.
          </p>
        </div>
      </Modal>
    </>
  );
}
