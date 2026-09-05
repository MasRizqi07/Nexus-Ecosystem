"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  ArrowDownUp,
  Sliders,
  Info,
  Layers,
} from "lucide-react";
import { useVisualizerStore } from "@/stores/use-visualizer-store";
import { ALGORITHM_METADATA } from "@/lib/visualizer-engine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { customArraySchema } from "@/lib/validators";
import type { SortingAlgorithm } from "@/types";

const ALGORITHMS: { id: SortingAlgorithm; label: string }[] = [
  { id: "quick", label: "Quick Sort" },
  { id: "merge", label: "Merge Sort" },
  { id: "insertion", label: "Insertion Sort" },
  { id: "selection", label: "Selection Sort" },
  { id: "bubble", label: "Bubble Sort" },
];

export default function VisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    setSpeed,
    arraySize,
    setArraySize,
    resetArray,
    setCustomArray,
    play,
    pause,
    stepForward,
    stepBackward,
    seekToStep,
    cleanup,
  } = useVisualizerStore();

  const [customInputOpen, setCustomInputOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("45, 12, 88, 32, 95, 18, 64, 50, 77, 23");
  const [customInputError, setCustomInputError] = useState<string | null>(null);

  // Strict unmount cleanup lifecycle (Constraint 3)
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const currentStep = steps[currentStepIndex] || {
    array: [],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: [],
    description: "",
    comparisonCount: 0,
    swapCount: 0,
  };

  const meta = ALGORITHM_METADATA[algorithm];
  const maxVal = Math.max(...currentStep.array, 100);

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = customArraySchema.safeParse(customInputValue);
    if (!validation.success) {
      setCustomInputError(validation.error.issues[0]?.message || "Invalid array format");
      return;
    }
    setCustomInputError(null);
    const parsedNumbers = customInputValue
      .split(",")
      .map((s) => Number(s.trim()));
    setCustomArray(parsedNumbers);
    setCustomInputOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Algorithm Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-[10px]">
              Engine Core
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Generator State Machine (`function*`)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Interactive Algorithm Visualizer
          </h1>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-nexus-surface/80 border border-border/60">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setAlgorithm(algo.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algorithm === algo.id
                  ? "bg-nexus-cyan text-background font-bold shadow-md shadow-nexus-cyan/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {algo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Control Console */}
      <div className="p-4 sm:p-5 rounded-2xl bg-nexus-surface/80 border border-border/80 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Playback Transport Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? "secondary" : "glow"}
              size="md"
              onClick={isPlaying ? pause : play}
              className="gap-2 px-5 font-bold"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={stepBackward}
              disabled={currentStepIndex <= 0 || isPlaying}
              title="Step Backward"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={stepForward}
              disabled={currentStepIndex >= steps.length - 1 || isPlaying}
              title="Step Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => resetArray("random")}
              className="gap-1.5 text-xs ml-1"
              title="Reset with New Random Array"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>

          {/* Array Generator Presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground hidden md:inline mr-1">
              Array:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetArray("random")}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <Shuffle className="w-3 h-3" />
              <span>Random</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetArray("nearly-sorted")}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ArrowDownUp className="w-3 h-3" />
              <span>Nearly Sorted</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetArray("reversed")}
              className="h-8 px-2.5 text-xs"
            >
              Reversed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomInputOpen(!customInputOpen)}
              className="h-8 px-2.5 text-xs border-nexus-cyan/40 text-nexus-cyan hover:bg-nexus-cyan/10"
            >
              Custom...
            </Button>
          </div>
        </div>

        {/* Sliders: Speed & Array Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
          <Slider
            label="Playback Speed"
            min={1}
            max={10}
            step={1}
            value={speed}
            onChange={setSpeed}
            valueDisplay={`${speed}x`}
          />
          <Slider
            label="Array Elements"
            min={10}
            max={50}
            step={5}
            value={arraySize}
            onChange={setArraySize}
            valueDisplay={`${arraySize} items`}
            disabled={isPlaying}
          />
        </div>

        {/* Custom Array Input Modal / Form */}
        {customInputOpen && (
          <form
            onSubmit={handleCustomInputSubmit}
            className="p-4 rounded-xl bg-nexus-dark/90 border border-nexus-cyan/30 space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-nexus-cyan" />
                <span>Custom Array Input (Zod Validated)</span>
              </h4>
              <button
                type="button"
                onClick={() => setCustomInputOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Enter 3 to 60 comma-separated integers between 5 and 500.
            </p>
            <input
              type="text"
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              placeholder="e.g. 50, 12, 99, 4, 33, 78, 22"
              className="w-full h-10 px-3 rounded-lg bg-nexus-surface border border-border/80 text-sm font-mono text-foreground focus:outline-none focus:border-nexus-cyan"
            />
            {customInputError && (
              <p className="text-xs text-rose-400 font-medium">
                {customInputError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCustomInputOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm">
                Apply Array
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Main Visualizer Canvas Area */}
      <div className="p-6 rounded-3xl bg-nexus-surface/60 border border-border/80 shadow-2xl space-y-4">
        {/* Step Explanation Banner */}
        <div className="p-3.5 rounded-xl bg-nexus-dark/80 border border-border/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Info className="w-4 h-4 text-nexus-cyan shrink-0" />
            <span className="font-mono text-foreground truncate">
              {currentStep.description || "Ready to execute."}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <span className="text-muted-foreground">
              Comparisons:{" "}
              <strong className="text-nexus-cyan">{currentStep.comparisonCount}</strong>
            </span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              Swaps:{" "}
              <strong className="text-rose-400">{currentStep.swapCount}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Canvas Bars Display */}
        <div className="relative h-72 sm:h-80 w-full flex items-end justify-center gap-1.5 sm:gap-2 px-4 py-2 bg-nexus-dark/60 rounded-2xl border border-border/40 overflow-hidden">
          {currentStep.array.map((value, idx) => {
            const isComparing = currentStep.comparingIndices.includes(idx);
            const isSwapping = currentStep.swappingIndices.includes(idx);
            const isPivot = currentStep.pivotIndex === idx;
            const isSorted = currentStep.sortedIndices.includes(idx);

            const heightPercent = Math.max(8, (value / maxVal) * 100);

            let barColor = "bg-slate-700/80 border-slate-600";
            let glow = "";

            if (isSwapping) {
              barColor = "bg-rose-500 border-rose-400";
              glow = "shadow-lg shadow-rose-500/50";
            } else if (isComparing) {
              barColor = "bg-nexus-cyan border-cyan-300";
              glow = "shadow-lg shadow-nexus-cyan/50";
            } else if (isPivot) {
              barColor = "bg-amber-400 border-amber-300";
              glow = "shadow-lg shadow-amber-400/50";
            } else if (isSorted) {
              barColor = "bg-emerald-500 border-emerald-400";
              glow = "shadow-md shadow-emerald-500/30";
            }

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <div
                  className={`w-full rounded-t-md border-t border-x transition-all duration-150 ${barColor} ${glow}`}
                  style={{ height: `${heightPercent}%` }}
                />
                {currentStep.array.length <= 30 && (
                  <span className="mt-1 font-mono text-[9px] text-muted-foreground group-hover:text-nexus-cyan">
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-700 border border-slate-600" />
            <span className="text-muted-foreground">Unsorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nexus-cyan shadow-sm shadow-nexus-cyan/50" />
            <span className="text-cyan-300 font-semibold">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-rose-300 font-semibold">Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400 shadow-sm shadow-amber-400/50" />
            <span className="text-amber-300 font-semibold">Pivot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-emerald-300 font-semibold">Sorted</span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="pt-2 border-t border-border/40 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">Timeline Scrubber</span>
            <span className="text-nexus-cyan">
              Step {currentStepIndex + 1} / {steps.length}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, steps.length - 1)}
            value={currentStepIndex}
            onChange={(e) => seekToStep(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none bg-nexus-dark cursor-pointer accent-nexus-cyan"
            aria-label="Timeline Step Scrubber"
          />
        </div>
      </div>

      {/* Algorithm Metadata & Complexity Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/80 md:col-span-2">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-nexus-cyan" />
              <h3 className="font-bold text-base text-foreground">
                {meta.name} Execution Mechanics
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {meta.description}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-6 space-y-2.5 text-xs font-mono">
            <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
              Complexity Invariants
            </h4>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Best Time</span>
              <span className="text-emerald-400 font-bold">{meta.bestTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Average Time</span>
              <span className="text-nexus-cyan font-bold">{meta.avgTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Worst Time</span>
              <span className="text-rose-400 font-bold">{meta.worstTime}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Space Complexity</span>
              <span className="text-nexus-violet font-bold">{meta.spaceComplexity}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
