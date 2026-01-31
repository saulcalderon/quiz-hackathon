"use client";

import { useMemo } from "react";

interface AvatarProps {
  userId?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

// DiceBear avatar styles
const avatarStyles = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "big-ears",
  "big-smile",
  "bottts",
  "croodles",
  "fun-emoji",
  "lorelei",
  "micah",
  "miniavs",
  "personas",
  "pixel-art",
];

export function Avatar({ userId, size = "md", className = "" }: AvatarProps) {
  const avatarUrl = useMemo(() => {
    const id = userId || "anonymous";
    // Use a consistent style based on userId hash
    const styleIndex =
      id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      avatarStyles.length;
    const style = avatarStyles[styleIndex];

    return `https://api.dicebear.com/7.x/${style}/svg?seed=${id}&backgroundColor=ffff00,a020f0,00ff00`;
  }, [userId]);

  return (
    <div
      className={`
        ${sizeStyles[size]}
        border-4 border-black
        overflow-hidden
        bg-muted
        ${className}
      `}
    >
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
