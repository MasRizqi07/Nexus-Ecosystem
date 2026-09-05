import { create } from "zustand";
import type { SortingAlgorithm, VisualizerStep } from "@/types";
import {
  generateRandomArray,
  generateReversedArray,
  generateNearlySortedArray,
  getSortingGenerator,
} from "@/lib/visualizer-engine";

interface VisualizerState {
  array: number[];
  algorithm: SortingAlgorithm;
  steps: VisualizerStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // 1x to 10x
  arraySize: number;

  // Actions
  setAlgorithm: (algo: SortingAlgorithm) => void;
  setSpeed: (speed: number) => void;
  setArraySize: (size: number) => void;
  resetArray: (type?: "random" | "reversed" | "nearly-sorted") => void;
  setCustomArray: (arr: number[]) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seekToStep: (index: number) => void;
  cleanup: () => void;
}

// Module-scoped timer IDs to prevent stale timers across component unmounts
let activeTimeoutId: NodeJS.Timeout | null = null;
let activeAnimFrameId: number | null = null;

function clearAllActiveTimers() {
  if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }
  if (activeAnimFrameId) {
    cancelAnimationFrame(activeAnimFrameId);
    activeAnimFrameId = null;
  }
}

function generateStepsForArray(algorithm: SortingAlgorithm, arr: number[]): VisualizerStep[] {
  const gen = getSortingGenerator(algorithm, arr);
  const steps: VisualizerStep[] = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  if (result.value) {
    steps.push(result.value);
  }
  return steps;
}

export const useVisualizerStore = create<VisualizerState>((set, get) => {
  const initialArray = generateRandomArray(20);
  const initialSteps = generateStepsForArray("quick", initialArray);

  const scheduleNextTick = () => {
    clearAllActiveTimers();
    const { currentStepIndex, steps, speed, isPlaying } = get();

    if (!isPlaying || currentStepIndex >= steps.length - 1) {
      set({ isPlaying: false });
      return;
    }

    // Dynamic speed interval: 1x -> 350ms, 5x -> 70ms, 10x -> 25ms
    const delay = Math.max(16, Math.floor(350 / speed));

    activeTimeoutId = setTimeout(() => {
      activeAnimFrameId = requestAnimationFrame(() => {
        const nextIdx = get().currentStepIndex + 1;
        set({ currentStepIndex: nextIdx });

        if (nextIdx < get().steps.length - 1 && get().isPlaying) {
          scheduleNextTick();
        } else {
          set({ isPlaying: false });
          clearAllActiveTimers();
        }
      });
    }, delay);
  };

  return {
    array: initialArray,
    algorithm: "quick",
    steps: initialSteps,
    currentStepIndex: 0,
    isPlaying: false,
    speed: 5,
    arraySize: 20,

    setAlgorithm: (algorithm: SortingAlgorithm) => {
      clearAllActiveTimers();
      const currentArray = get().array;
      const newSteps = generateStepsForArray(algorithm, currentArray);
      set({
        algorithm,
        steps: newSteps,
        currentStepIndex: 0,
        isPlaying: false,
      });
    },

    setSpeed: (speed: number) => {
      set({ speed });
    },

    setArraySize: (arraySize: number) => {
      clearAllActiveTimers();
      const newArr = generateRandomArray(arraySize);
      const newSteps = generateStepsForArray(get().algorithm, newArr);
      set({
        arraySize,
        array: newArr,
        steps: newSteps,
        currentStepIndex: 0,
        isPlaying: false,
      });
    },

    resetArray: (type = "random") => {
      clearAllActiveTimers();
      const size = get().arraySize;
      const newArr =
        type === "reversed"
          ? generateReversedArray(size)
          : type === "nearly-sorted"
          ? generateNearlySortedArray(size)
          : generateRandomArray(size);

      const newSteps = generateStepsForArray(get().algorithm, newArr);
      set({
        array: newArr,
        steps: newSteps,
        currentStepIndex: 0,
        isPlaying: false,
      });
    },

    setCustomArray: (arr: number[]) => {
      clearAllActiveTimers();
      const newSteps = generateStepsForArray(get().algorithm, arr);
      set({
        array: arr,
        arraySize: arr.length,
        steps: newSteps,
        currentStepIndex: 0,
        isPlaying: false,
      });
    },

    play: () => {
      const { currentStepIndex, steps } = get();
      if (currentStepIndex >= steps.length - 1) {
        // Rewind to start if already finished
        set({ currentStepIndex: 0, isPlaying: true });
      } else {
        set({ isPlaying: true });
      }
      scheduleNextTick();
    },

    pause: () => {
      clearAllActiveTimers();
      set({ isPlaying: false });
    },

    stepForward: () => {
      clearAllActiveTimers();
      const { currentStepIndex, steps } = get();
      if (currentStepIndex < steps.length - 1) {
        set({ currentStepIndex: currentStepIndex + 1, isPlaying: false });
      }
    },

    stepBackward: () => {
      clearAllActiveTimers();
      const { currentStepIndex } = get();
      if (currentStepIndex > 0) {
        set({ currentStepIndex: currentStepIndex - 1, isPlaying: false });
      }
    },

    seekToStep: (index: number) => {
      clearAllActiveTimers();
      const { steps } = get();
      const safeIndex = Math.max(0, Math.min(steps.length - 1, index));
      set({ currentStepIndex: safeIndex, isPlaying: false });
    },

    cleanup: () => {
      clearAllActiveTimers();
      set({ isPlaying: false });
    },
  };
});
