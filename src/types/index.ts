export * from "@/db/schema";
export * from "@/lib/validators";

export type SortingAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

export interface AlgorithmMetadata {
  id: SortingAlgorithm;
  name: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  spaceComplexity: string;
  description: string;
}

export interface VisualizerStep {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  pivotIndex: number | null;
  sortedIndices: number[];
  description: string;
  comparisonCount: number;
  swapCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // cents
  imageUrl: string;
  category: string;
  quantity: number;
}
