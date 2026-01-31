"use client";

import { motion } from "framer-motion";
import { Zap, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface WagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  hasUsedDouble: boolean;
}

export function WagerModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  hasUsedDouble,
}: WagerModalProps) {
  if (hasUsedDouble) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-4 bg-primary border-4 border-black flex items-center justify-center"
        >
          <Zap className="w-10 h-10" />
        </motion.div>

        <h2 className="font-heading text-3xl uppercase mb-2">Double Down!</h2>

        <p className="text-gray-600 mb-6">
          Confident about this question? Double your points if you answer
          correctly, but lose double if wrong!
        </p>

        <div className="bg-muted border-4 border-black p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="font-heading text-2xl text-accent">+2x</div>
              <div className="text-xs text-gray-600">If Correct</div>
            </div>
            <div>
              <div className="font-heading text-2xl text-red-500">-2x</div>
              <div className="text-xs text-gray-600">If Wrong</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-1" />
            Skip
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            <Zap className="w-4 h-4 mr-1" />
            Double!
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          You can only use this once per game
        </p>
      </div>
    </Modal>
  );
}
