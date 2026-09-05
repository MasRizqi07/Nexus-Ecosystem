import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueDisplay?: string;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueDisplay,
  className,
  disabled = false,
}: SliderProps) {
  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100)
  );

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        {label && (
          <span className="font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        )}
        <span className="font-mono font-semibold text-nexus-cyan">
          {valueDisplay ?? value}
        </span>
      </div>
      <div className="relative flex items-center h-6 select-none touch-none">
        <div className="relative w-full h-2 rounded-full bg-nexus-surface border border-border/60 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-nexus-cyan to-nexus-violet rounded-full transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label={label || "Slider"}
        />
        {/* Thumb handle */}
        <div
          className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-nexus-cyan bg-background shadow-md shadow-nexus-cyan/40 -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
