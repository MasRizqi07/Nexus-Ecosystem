import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive"
    | "glow"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexus-cyan/50 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-10 px-4 text-sm rounded-lg gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 p-0 rounded-lg",
    }[size];

    const variantStyles = {
      default:
        "bg-primary text-primary-foreground font-semibold hover:bg-nexus-cyan/90 shadow-md shadow-nexus-cyan/20 hover:shadow-nexus-cyan/30",
      glow:
        "bg-gradient-to-r from-nexus-cyan to-nexus-violet text-background font-bold shadow-lg shadow-nexus-cyan/25 hover:shadow-nexus-cyan/40 hover:brightness-110",
      outline:
        "border border-border/80 bg-background/50 hover:bg-muted/60 text-foreground hover:border-nexus-cyan/50 hover:text-nexus-cyan",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40",
      ghost:
        "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/20",
      link:
        "text-nexus-cyan underline-offset-4 hover:underline p-0 h-auto",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles, variantStyles, className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
