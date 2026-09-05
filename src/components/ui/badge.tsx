import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "emerald"
    | "cyan"
    | "violet"
    | "rose"
    | "amber";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-primary/10 text-primary border-primary/20",
    secondary:
      "bg-secondary text-secondary-foreground border-border/50",
    outline:
      "text-muted-foreground border-border/80 bg-background/50",
    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    cyan:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    violet:
      "bg-purple-500/10 text-purple-400 border-purple-500/30",
    rose:
      "bg-rose-500/10 text-rose-400 border-rose-500/30",
    amber:
      "bg-amber-500/10 text-amber-400 border-amber-500/30",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide transition-colors",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
