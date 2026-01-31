"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useWallet } from "@/contexts/wallet-context";
import { api, ApiError } from "@/lib/api";
import { formatCredits } from "@/lib/utils";

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLobbyModal({ isOpen, onClose }: CreateLobbyModalProps) {
  const router = useRouter();
  const { balance } = useWallet();
  const [entryFee, setEntryFee] = useState("50");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const entryFeeNum = parseInt(entryFee) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (entryFeeNum < 1) {
      setError("Entry fee must be at least 1 credit");
      return;
    }

    if (topic.length < 3) {
      setError("Topic must be at least 3 characters");
      return;
    }

    setIsLoading(true);

    try {
      const lobby = await api.post<{ code: string }>("/lobbies", {
        entryFee: entryFeeNum,
        topic,
        notes: notes || undefined,
      });

      // Join the lobby as host
      await api.post(`/lobbies/${lobby.code}/join`);

      // Generate questions
      await api.post(`/lobbies/${lobby.code}/generate`, {
        topic,
        notes: notes || undefined,
      });

      router.push(`/lobby/${lobby.code}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create lobby");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const presetFees = [25, 50, 100, 250];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Game" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entry Fee */}
        <div>
          <label className="block font-heading text-sm uppercase tracking-wide mb-2">
            Entry Fee (Credits)
          </label>
          <div className="flex gap-2 mb-2">
            {presetFees.map((fee) => (
              <button
                key={fee}
                type="button"
                onClick={() => setEntryFee(fee.toString())}
                className={`
                  flex-1 py-2 px-3
                  border-4 border-black
                  font-heading text-sm
                  transition-colors
                  ${
                    entryFeeNum === fee
                      ? "bg-primary"
                      : "bg-muted hover:bg-gray-200"
                  }
                `}
              >
                {formatCredits(fee)}
              </button>
            ))}
          </div>
          <Input
            type="number"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            min="1"
            placeholder="Custom amount"
          />
          <p className="mt-1 text-xs text-gray-500">
            Your balance: {formatCredits(balance)} credits
          </p>
        </div>

        {/* Topic */}
        <Input
          label="Quiz Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Organic Chemistry, World War II, JavaScript"
          required
        />

        {/* Notes */}
        <Textarea
          label="Study Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your study notes or key concepts here. The AI will use this to generate more targeted questions."
          rows={4}
        />

        {error && (
          <div className="p-3 bg-red-100 border-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-muted border-4 border-black">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-0.5 text-secondary" />
            <div className="text-sm">
              <p className="font-medium mb-1">AI-Generated Questions</p>
              <p className="text-gray-600">
                Our AI will generate 10 questions based on your topic. The more
                detailed your notes, the better the questions!
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="flex-1"
          >
            <Coins className="w-5 h-5 mr-2" />
            Create Game
          </Button>
        </div>
      </form>
    </Modal>
  );
}
