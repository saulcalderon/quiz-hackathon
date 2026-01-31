"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Zap, Trophy, Brain, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type AuthMode = "magic" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signInWithPassword, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (authMode === "magic") {
      const result = await signIn(email);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      setSuccess(true);
      setIsLoading(false);
      return;
    }

    // Password auth
    if (isSignUp) {
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      // After sign up, try to sign in directly
      const signInResult = await signInWithPassword(email, password);
      if (signInResult.error) {
        setSuccess(true); // Show check email message if email confirmation required
        setIsLoading(false);
        return;
      }
    } else {
      const result = await signInWithPassword(email, password);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    setIsLoading(false);
  };

  const features = [
    { icon: Brain, text: "AI-Generated Questions" },
    { icon: Trophy, text: "Compete & Win Credits" },
    { icon: Zap, text: "Real-time Battles" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-6xl uppercase mb-6"
          >
            StakeStudy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8"
          >
            Where your knowledge pays the bills. Compete in AI-generated quizzes
            and win real credits.
          </motion.p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-background border-4 border-black flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="font-heading text-lg uppercase">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="font-heading text-4xl uppercase text-primary">
                StakeStudy
              </h1>
              <p className="text-sm mt-2">Where knowledge pays</p>
            </div>

            <h2 className="font-heading text-3xl uppercase mb-2">
              {success ? "Check Your Email" : isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            <p className="text-gray-600 mb-6">
              {success
                ? "We sent you a magic link. Click it to sign in."
                : authMode === "magic"
                ? "Enter your email to receive a magic link"
                : isSignUp
                ? "Create your account"
                : "Enter your credentials"}
            </p>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-accent border-4 border-black mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-10 h-10" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Didn&apos;t receive it? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={authMode === "magic" ? error : undefined}
                  required
                />

                {authMode === "password" && (
                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={error}
                    required
                    minLength={6}
                  />
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  {authMode === "magic" ? (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send Magic Link
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      {isSignUp ? "Create Account" : "Sign In"}
                    </>
                  )}
                </Button>

                {authMode === "password" && (
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "magic" ? "password" : "magic");
                    setError("");
                  }}
                  className="w-full text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {authMode === "magic"
                    ? "Use email & password instead"
                    : "Use magic link instead"}
                </button>
              </form>
            )}

            <p className="text-xs text-gray-500 mt-6 text-center">
              By signing in, you agree to compete fairly and not cheat.
              Knowledge is power!
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
