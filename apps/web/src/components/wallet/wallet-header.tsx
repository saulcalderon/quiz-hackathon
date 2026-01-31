"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Plus, Star, LogOut, Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StripeCheckoutModal } from "@/components/wallet/stripe-checkout-modal";
import { formatCredits } from "@/lib/utils";

const topUpOptions = [
  { amount: 100, price: "$1", priceInCents: 100 },
  { amount: 500, price: "$5", priceInCents: 500 },
  { amount: 1000, price: "$10", priceInCents: 1000 },
  { amount: 2500, price: "$25", priceInCents: 2500 },
];

export function WalletHeader() {
  const { signOut } = useAuth();
  const { balance, xp, isLoading, refetch } = useWallet();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof topUpOptions[0] | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectPackage = (option: typeof topUpOptions[0]) => {
    setSelectedPackage(option);
    setShowTopUpModal(false);
    setShowStripeModal(true);
  };

  const handlePaymentSuccess = async () => {
    // Refetch to update balance after successful payment
    await refetch();
  };

  return (
    <>
      <header className="bg-background border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary border-4 border-black flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="font-heading text-xl uppercase hidden sm:block">
              StakeStudy
            </span>
          </Link>

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

            {/* Profile Link */}
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </Link>

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
                  <Link href="/profile" className="flex-1">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Perfil
                    </Button>
                  </Link>
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

      {/* Top Up Modal - Package Selection */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Buy Credits"
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
                onClick={() => handleSelectPackage(option)}
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
            Secure payments powered by Stripe.
          </p>
        </div>
      </Modal>

      {/* Stripe Checkout Modal */}
      {selectedPackage && (
        <StripeCheckoutModal
          isOpen={showStripeModal}
          onClose={() => {
            setShowStripeModal(false);
            setSelectedPackage(null);
          }}
          credits={selectedPackage.amount}
          priceLabel={selectedPackage.price}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
