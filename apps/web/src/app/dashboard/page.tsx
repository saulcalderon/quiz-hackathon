"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { JoinByCode } from "@/components/dashboard/join-by-code";
import { CreateLobbyModal } from "@/components/dashboard/create-lobby-modal";

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { icon: Trophy, label: "Games Won", value: "0" },
    { icon: Users, label: "Games Played", value: "0" },
    { icon: Zap, label: "Win Rate", value: "0%" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-4xl md:text-5xl uppercase mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Join a game or create your own quiz arena
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Join Game */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <JoinByCode />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardTitle className="mb-4">Your Stats</CardTitle>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-muted border-4 border-black flex items-center justify-center">
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="font-heading text-xl">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Create Game CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-primary">
              <CardTitle className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6" />
                Host a Game
              </CardTitle>
              <CardContent>
                <p className="mb-4">
                  Create your own quiz arena. Choose a topic, set the entry fee,
                  and invite friends to compete!
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowCreateModal(true)}
                  className="w-full"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardTitle className="mb-4">How It Works</CardTitle>
              <CardContent>
                <ol className="space-y-3">
                  {[
                    "Create or join a game with credits",
                    "AI generates questions from your topic",
                    "Answer fast and correctly to earn points",
                    "Winner takes 90% of the pot!",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-secondary text-white flex items-center justify-center font-heading text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Create Game Modal */}
      <CreateLobbyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
