import { type ClassValue, clsx } from "clsx";

// Simple class name utility (can add twMerge later if needed)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format credits with commas
export function formatCredits(amount: number): string {
  return new Intl.NumberFormat("en-US").format(Math.floor(amount));
}

// Format time remaining (seconds to MM:SS)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Generate a random 6-character code
export function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Truncate string with ellipsis
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
