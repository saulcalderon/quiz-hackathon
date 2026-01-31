"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { api, ApiError } from "@/lib/api";

export function JoinByCode() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Code must be 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post(`/lobbies/${code.toUpperCase()}/join`);
      router.push(`/lobby/${code.toUpperCase()}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to join lobby");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setCode(value);
      setError("");
    }
  };

  return (
    <Card>
      <CardTitle className="flex items-center gap-2 mb-4">
        <Hash className="w-6 h-6" />
        Join Game
      </CardTitle>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-heading text-sm uppercase tracking-wide mb-2">
            Room Code
          </label>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="ABC123"
            className={`
              w-full
              bg-background
              border-4 border-black
              px-4 py-4
              text-center
              font-heading text-3xl uppercase tracking-[0.5em]
              outline-none
              transition-all
              focus:ring-4 focus:ring-primary
              placeholder:text-gray-300 placeholder:tracking-[0.5em]
              ${error ? "ring-4 ring-red-500" : ""}
            `}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={code.length !== 6}
          className="w-full"
        >
          Join Game
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </Card>
  );
}
