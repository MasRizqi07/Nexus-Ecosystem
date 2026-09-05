import type { Product, ToolSavedState, User } from "./schema";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d",
    slug: "nexus-edge-ai-compute-blade",
    name: "Nexus Edge AI Compute Blade",
    description: "Enterprise-grade local neural accelerator featuring 128 Tensor Cores and 32GB LPDDR5X. Built for sub-millisecond edge inference and local LLM execution.",
    price: 89900, // $899.00
    category: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
    inventoryCount: 18,
    rating: 49,
    tags: ["Tensor Acceleration", "Edge AI", "PCIe Gen5", "Zero-Latency"],
    isFeatured: true,
    createdAt: new Date("2025-01-15T00:00:00.000Z"),
  },
  {
    id: "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e",
    slug: "quantum-mechanical-cyber-deck",
    name: "Quantum 75% Mechanical Deck",
    description: "Machined aerospace aluminum chassis with hot-swappable hall-effect magnetic switches, gasket-mounted dampening, and programmable OLED telemetry display.",
    price: 24900, // $249.00
    category: "Developer Gear",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    inventoryCount: 42,
    rating: 48,
    tags: ["Hall Effect", "Gasket Mount", "75% Layout", "Custom Firmware"],
    isFeatured: true,
    createdAt: new Date("2025-01-20T00:00:00.000Z"),
  },
  {
    id: "c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f",
    slug: "nexus-cloud-runtime-license",
    name: "Nexus Cloud Serverless Cluster (Annual)",
    description: "Dedicated high-throughput multi-region cluster with isolated worker runtimes, infinite scale edge caching, and 99.999% uptime SLA.",
    price: 120000, // $1,200.00
    category: "Cloud Licenses",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
    inventoryCount: 999,
    rating: 50,
    tags: ["Dedicated Cluster", "Global Edge", "Zero Cold Starts", "Enterprise SLA"],
    isFeatured: true,
    createdAt: new Date("2025-02-01T00:00:00.000Z"),
  },
  {
    id: "d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a",
    slug: "synapse-spatial-audio-monitor",
    name: "Synapse Spatial Audio Headphones",
    description: "Active noise-cancelling planar magnetic studio monitors with ultra-wide frequency response (5Hz-50kHz) and custom binaural spatialization.",
    price: 38900, // $389.00
    category: "Developer Gear",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    inventoryCount: 25,
    rating: 47,
    tags: ["Planar Magnetic", "ANC", "Spatial Audio", "Lossless"],
    isFeatured: false,
    createdAt: new Date("2025-02-10T00:00:00.000Z"),
  },
  {
    id: "e5f6a1b2-c3d4-4e5f-c06b-7c8d9e0f1a2b",
    slug: "nexus-neural-dev-hoodie",
    name: "Nexus 'Zero-Allocation' Tech Hoodie",
    description: "Heavyweight 450 GSM French terry cotton with reflective cybernetic circuitry silkscreening and water-repellent nanotech coating.",
    price: 9500, // $95.00
    category: "Merchandise",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    inventoryCount: 65,
    rating: 49,
    tags: ["450 GSM", "Reflective Ink", "Heavyweight", "Water-Repellent"],
    isFeatured: false,
    createdAt: new Date("2025-02-14T00:00:00.000Z"),
  },
  {
    id: "f6a1b2c3-d4e5-4f6a-d17c-8d9e0f1a2b3c",
    slug: "vector-fpga-development-kit",
    name: "Vector-IV Prototyping FPGA Board",
    description: "Custom Xilinx UltraScale+ FPGA dev kit with 4x 100GbE QSFP28 ports, dual FMC+ expansion, and hardware PCIe Gen4 x16 root complex.",
    price: 175000, // $1,750.00
    category: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    inventoryCount: 8,
    rating: 50,
    tags: ["UltraScale+", "100GbE", "Hardware Acceleration", "PCIe Gen4"],
    isFeatured: true,
    createdAt: new Date("2025-02-18T00:00:00.000Z"),
  },
];

export const INITIAL_TOOL_STATES: ToolSavedState[] = [
  {
    id: "t1a2b3c4-d5e6-4a1b-8c2d-3e4f5a6b7c8d",
    clientId: null,
    toolType: "JSON",
    title: "Kubernetes Deployment Spec Template",
    stateData: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: { name: "nexus-edge-worker", labels: { app: "nexus-worker" } },
      spec: {
        replicas: 3,
        selector: { matchLabels: { app: "nexus-worker" } },
        template: {
          metadata: { labels: { app: "nexus-worker" } },
          spec: {
            containers: [
              {
                name: "worker",
                image: "nexus/worker:latest",
                ports: [{ containerPort: 8080 }],
                resources: { limits: { cpu: "2000m", memory: "2Gi" } },
              },
            ],
          },
        },
      },
    },
    createdAt: new Date("2025-02-01T00:00:00.000Z"),
    updatedAt: new Date("2025-02-01T00:00:00.000Z"),
  },
  {
    id: "t2b3c4d5-e6f1-4b2c-9d3e-4f5a6b7c8d9e",
    clientId: null,
    toolType: "REGEX",
    title: "SemVer & Semantic Release Pattern",
    stateData: {
      pattern: "^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
      flags: "gm",
      testString: "v2.14.0\n3.0.0-beta.1\ninvalid-version\n1.0.0+build.20250101",
    },
    createdAt: new Date("2025-02-05T00:00:00.000Z"),
    updatedAt: new Date("2025-02-05T00:00:00.000Z"),
  },
  {
    id: "t3c4d5e6-f1a2-4c3d-ae4f-5a6b7c8d9e0f",
    clientId: null,
    toolType: "MARKDOWN",
    title: "Nexus High-Throughput Architecture Spec",
    stateData: {
      content: "# Nexus Core Engineering Guidelines\n\n## 1. Zero-Allocation Philosophy\nEvery critical path transaction in the Nexus engine enforces zero garbage collector pressure.\n\n### Complexity Invariants\n- Sorting visualizer generators maintain strictly $O(1)$ auxiliary memory outside the yielded frame buffer.\n- State updates leverage immutable structural sharing.\n\n```typescript\nfunction* bubbleSort(arr: number[]) {\n  // Pure generator step yielding\n  yield { comparing: [i, j] };\n}\n```\n\n> Safety and velocity are not mutually exclusive. They are complementary.",
    },
    createdAt: new Date("2025-02-10T00:00:00.000Z"),
    updatedAt: new Date("2025-02-10T00:00:00.000Z"),
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: "11111111-1111-4111-a111-111111111111",
    email: "admin@nexus.dev",
    name: "Nexus System Administrator",
    role: "ADMIN",
    avatarUrl: null,
    passwordHash: "108183081929743e4e09a8cdcac534af46a6863b5803196488b8af66fb735e01", // admin123
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    id: "22222222-2222-4222-a222-222222222222",
    email: "developer@nexus.dev",
    name: "Nexus Verified Developer",
    role: "USER",
    avatarUrl: null,
    passwordHash: "8a01735c15c2db17386d8e68eb12db6dced7675989e6ca4aa1d8143560cd3f71", // dev123
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
];

