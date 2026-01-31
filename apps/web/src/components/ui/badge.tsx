"use client";

import { LobbyStatus } from "@/types";

interface BadgeProps {
  variant?: "default" | "primary" | "secondary" | "accent" | "outline";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-muted text-foreground",
  primary: "bg-primary text-foreground",
  secondary: "bg-secondary text-white",
  accent: "bg-accent text-foreground",
  outline: "bg-transparent border-2 border-black text-foreground",
};

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-heading uppercase tracking-wider
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Specialized badge for lobby status
interface StatusBadgeProps {
  status: LobbyStatus;
  className?: string;
}

const statusStyles: Record<LobbyStatus, { variant: BadgeProps["variant"]; label: string }> = {
  WAITING: { variant: "primary", label: "Waiting" },
  ACTIVE: { variant: "accent", label: "In Progress" },
  FINISHED: { variant: "secondary", label: "Finished" },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { variant, label } = statusStyles[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
