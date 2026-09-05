import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border/80 bg-nexus-surface/80 px-3.5 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground/50 transition-all focus-visible:outline-none focus-visible:border-nexus-cyan/60 focus-visible:ring-1 focus-visible:ring-nexus-cyan/40 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive/80 focus-visible:border-destructive focus-visible:ring-destructive/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
