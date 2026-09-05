import type { SortingAlgorithm, AlgorithmMetadata, VisualizerStep } from "@/types";

export const ALGORITHM_METADATA: Record<SortingAlgorithm, AlgorithmMetadata> = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    bestTime: "O(n)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order until the entire array is sorted.",
  },
  selection: {
    id: "selection",
    name: "Selection Sort",
    bestTime: "O(n²)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Divides the array into a sorted and unsorted region. Continuously finds the minimum element from the unsorted part and places it at the sorted boundary.",
  },
  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    bestTime: "O(n)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position among previously sorted items.",
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    bestTime: "O(n log n)",
    avgTime: "O(n log n)",
    worstTime: "O(n log n)",
    spaceComplexity: "O(n)",
    description:
      "A divide-and-conquer algorithm that recursively divides the array in half until single elements remain, then merges sorted subarrays back together.",
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    bestTime: "O(n log n)",
    avgTime: "O(n log n)",
    worstTime: "O(n²)",
    spaceComplexity: "O(log n)",
    description:
      "Selects a 'pivot' element and partitions the array into values less than and greater than the pivot, recursively sorting each sub-partition.",
  },
};

/**
 * Generates random array of specified length
 */
export function generateRandomArray(size: number, min = 10, max = 100): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

/**
 * Generates reversed array (worst case for quadratic algorithms)
 */
export function generateReversedArray(size: number): number[] {
  const step = Math.floor(90 / size);
  return Array.from({ length: size }, (_, i) => 100 - i * step);
}

/**
 * Generates nearly sorted array
 */
export function generateNearlySortedArray(size: number): number[] {
  const arr = Array.from({ length: size }, (_, i) => Math.floor(10 + (i * 85) / size));
  // Swap 2 or 3 pairs randomly
  for (let k = 0; k < Math.max(1, Math.floor(size / 8)); k++) {
    const i = Math.floor(Math.random() * size);
    const j = Math.floor(Math.random() * size);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// ================= STEP-BY-STEP GENERATORS =================

/**
 * BUBBLE SORT GENERATOR
 */
export function* bubbleSortGenerator(initialArr: number[]): Generator<VisualizerStep> {
  const a = [...initialArr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: [],
    description: "Initial state. Ready to initiate Bubble Sort traversal.",
    comparisonCount: comparisons,
    swapCount: swaps,
  };

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield {
        array: [...a],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        pivotIndex: null,
        sortedIndices: [...sortedIndices],
        description: `Comparing elements at index ${j} (${a[j]}) and index ${j + 1} (${a[j + 1]}).`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };

      if (a[j] > a[j + 1]) {
        swaps++;
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;

        yield {
          array: [...a],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          pivotIndex: null,
          sortedIndices: [...sortedIndices],
          description: `Swapped: ${a[j + 1]} was greater than ${a[j]}.`,
          comparisonCount: comparisons,
          swapCount: swaps,
        };
      }
    }
    sortedIndices.push(n - 1 - i);
  }
  sortedIndices.push(0);

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: `Sorting complete in ${comparisons} comparisons and ${swaps} swaps.`,
    comparisonCount: comparisons,
    swapCount: swaps,
  };
}

/**
 * SELECTION SORT GENERATOR
 */
export function* selectionSortGenerator(initialArr: number[]): Generator<VisualizerStep> {
  const a = [...initialArr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: [],
    description: "Initial state. Ready to begin Selection Sort.",
    comparisonCount: comparisons,
    swapCount: swaps,
  };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield {
        array: [...a],
        comparingIndices: [minIdx, j],
        swappingIndices: [],
        pivotIndex: minIdx,
        sortedIndices: [...sortedIndices],
        description: `Comparing current minimum at index ${minIdx} (${a[minIdx]}) with element at index ${j} (${a[j]}).`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };

      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;

      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        pivotIndex: null,
        sortedIndices: [...sortedIndices],
        description: `Found new minimum (${a[i]}). Swapping to index ${i}.`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };
    }
    sortedIndices.push(i);
  }
  sortedIndices.push(n - 1);

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: `Selection sort completed in ${comparisons} comparisons and ${swaps} swaps.`,
    comparisonCount: comparisons,
    swapCount: swaps,
  };
}

/**
 * INSERTION SORT GENERATOR
 */
export function* insertionSortGenerator(initialArr: number[]): Generator<VisualizerStep> {
  const a = [...initialArr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [0];

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: [0],
    description: "Index 0 is trivially sorted. Starting insertion from index 1.",
    comparisonCount: comparisons,
    swapCount: swaps,
  };

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    yield {
      array: [...a],
      comparingIndices: [i],
      swappingIndices: [],
      pivotIndex: i,
      sortedIndices: [...sortedIndices],
      description: `Selected key element ${key} at index ${i} for insertion.`,
      comparisonCount: comparisons,
      swapCount: swaps,
    };

    while (j >= 0) {
      comparisons++;
      yield {
        array: [...a],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        pivotIndex: i,
        sortedIndices: [...sortedIndices],
        description: `Comparing key (${key}) with element at index ${j} (${a[j]}).`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };

      if (a[j] > key) {
        swaps++;
        a[j + 1] = a[j];
        yield {
          array: [...a],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          pivotIndex: null,
          sortedIndices: [...sortedIndices],
          description: `Shifted element ${a[j]} one position to the right.`,
          comparisonCount: comparisons,
          swapCount: swaps,
        };
        j--;
      } else {
        break;
      }
    }
    a[j + 1] = key;
    sortedIndices.push(i);

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [j + 1],
      pivotIndex: null,
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      description: `Inserted key ${key} into position ${j + 1}.`,
      comparisonCount: comparisons,
      swapCount: swaps,
    };
  }

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: `Insertion sort completed in ${comparisons} comparisons and ${swaps} operations.`,
    comparisonCount: comparisons,
    swapCount: swaps,
  };
}

/**
 * MERGE SORT GENERATOR
 */
export function* mergeSortGenerator(initialArr: number[]): Generator<VisualizerStep> {
  const a = [...initialArr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: [],
    description: "Initial state. Preparing recursive divide-and-conquer Merge Sort.",
    comparisonCount: comparisons,
    swapCount: swaps,
  };

  function* merge(start: number, mid: number, end: number): Generator<VisualizerStep> {
    const left = a.slice(start, mid + 1);
    const right = a.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      comparisons++;
      yield {
        array: [...a],
        comparingIndices: [start + i, mid + 1 + j],
        swappingIndices: [],
        pivotIndex: null,
        sortedIndices: [],
        description: `Merging: Comparing ${left[i]} from left subarray with ${right[j]} from right subarray.`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };

      if (left[i] <= right[j]) {
        a[k] = left[i];
        i++;
      } else {
        a[k] = right[j];
        j++;
      }
      swaps++;
      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [k],
        pivotIndex: null,
        sortedIndices: [],
        description: `Placed ${a[k]} into position ${k}.`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };
      k++;
    }

    while (i < left.length) {
      a[k] = left[i];
      swaps++;
      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [k],
        pivotIndex: null,
        sortedIndices: [],
        description: `Copying remaining element ${a[k]} to position ${k}.`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };
      i++;
      k++;
    }

    while (j < right.length) {
      a[k] = right[j];
      swaps++;
      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [k],
        pivotIndex: null,
        sortedIndices: [],
        description: `Copying remaining element ${a[k]} to position ${k}.`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };
      j++;
      k++;
    }
  }

  function* recursiveMergeSort(start: number, end: number): Generator<VisualizerStep> {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    yield* recursiveMergeSort(start, mid);
    yield* recursiveMergeSort(mid + 1, end);
    yield* merge(start, mid, end);
  }

  yield* recursiveMergeSort(0, n - 1);

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: `Merge sort completed in ${comparisons} comparisons and ${swaps} write operations.`,
    comparisonCount: comparisons,
    swapCount: swaps,
  };
}

/**
 * QUICK SORT GENERATOR
 */
export function* quickSortGenerator(initialArr: number[]): Generator<VisualizerStep> {
  const a = [...initialArr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: [],
    description: "Initial state. Preparing recursive Quick Sort partitioning.",
    comparisonCount: comparisons,
    swapCount: swaps,
  };

  function* partition(low: number, high: number): Generator<VisualizerStep, number, unknown> {
    const pivot = a[high];
    let i = low - 1;

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [],
      pivotIndex: high,
      sortedIndices: [...sortedIndices],
      description: `Selected pivot element ${pivot} at index ${high}.`,
      comparisonCount: comparisons,
      swapCount: swaps,
    };

    for (let j = low; j < high; j++) {
      comparisons++;
      yield {
        array: [...a],
        comparingIndices: [j, high],
        swappingIndices: [],
        pivotIndex: high,
        sortedIndices: [...sortedIndices],
        description: `Comparing element ${a[j]} at index ${j} against pivot ${pivot}.`,
        comparisonCount: comparisons,
        swapCount: swaps,
      };

      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          swaps++;
          const temp = a[i];
          a[i] = a[j];
          a[j] = temp;

          yield {
            array: [...a],
            comparingIndices: [],
            swappingIndices: [i, j],
            pivotIndex: high,
            sortedIndices: [...sortedIndices],
            description: `Swapped index ${i} (${a[i]}) and index ${j} (${a[j]}) into lower partition.`,
            comparisonCount: comparisons,
            swapCount: swaps,
          };
        }
      }
    }

    swaps++;
    const temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;
    sortedIndices.push(i + 1);

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [i + 1, high],
      pivotIndex: i + 1,
      sortedIndices: [...sortedIndices],
      description: `Pivot ${pivot} positioned at final sorted index ${i + 1}.`,
      comparisonCount: comparisons,
      swapCount: swaps,
    };

    return i + 1;
  }

  function* recursiveQuickSort(low: number, high: number): Generator<VisualizerStep> {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* recursiveQuickSort(low, pi - 1);
      yield* recursiveQuickSort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.push(low);
    }
  }

  yield* recursiveQuickSort(0, n - 1);

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: `Quick sort completed in ${comparisons} comparisons and ${swaps} swaps.`,
    comparisonCount: comparisons,
    swapCount: swaps,
  };
}

/**
 * Helper to get generator instance for an algorithm
 */
export function getSortingGenerator(
  algorithm: SortingAlgorithm,
  array: number[]
): Generator<VisualizerStep> {
  switch (algorithm) {
    case "bubble":
      return bubbleSortGenerator(array);
    case "selection":
      return selectionSortGenerator(array);
    case "insertion":
      return insertionSortGenerator(array);
    case "merge":
      return mergeSortGenerator(array);
    case "quick":
      return quickSortGenerator(array);
  }
}
