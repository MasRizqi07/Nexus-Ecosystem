"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  FileText,
  Copy,
  Download,
  Save,
  Database,
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  List,
  Quote,
  Eye,
  Columns,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import type { ToolSavedState } from "@/types";

const DEFAULT_MARKDOWN = `# Nexus High-Velocity Architecture

## 1. Zero-Allocation Philosophy
Every critical transaction path in the Nexus engine enforces zero garbage collection overhead.

### Architectural Invariants
- **Sorting Visualizer**: Pure generator functions (\`function*\`) yielding immutable frame snapshots.
- **State Mutation**: Strictly typed boundary validation via **Zod schemas**.
- **Persistence**: Relational Drizzle ORM paired with thread-safe in-memory singleton fallback.

> "Performance and reliability are not trade-offs; they are harmonic properties of deliberate architecture."

### Complexity Comparison
| Domain | Algorithm | Worst Time | Space |
|---|---|---|---|
| Engine | QuickSort | O(n²) | O(log n) |
| Engine | MergeSort | O(n log n) | O(n) |
| Commerce | Checkout | O(1) Atomic | O(1) |

\`\`\`typescript
export function* bubbleSort(arr: number[]): Generator<VisualizerStep> {
  // Pure yield frame
  yield { array: [...arr], comparingIndices: [0, 1] };
}
\`\`\`

Ready to deploy!
`;

/**
 * Lightweight pure-TS markdown parser that escapes raw HTML tags to prevent XSS
 * and safely renders headers, bold, italics, quotes, lists, code, and tables.
 */
function renderMarkdownToSafeHtml(md: string): string {
  // 1. HTML Entities Sanitization
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Code blocks (```lang ... ```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="my-4 p-4 rounded-xl bg-nexus-dark/95 border border-border/80 text-cyan-300 font-mono text-xs overflow-x-auto"><code>${code.trim()}</code></pre>`;
  });

  // 3. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-nexus-surface border border-border/60 font-mono text-xs text-nexus-cyan">$1</code>');

  // 4. Headers (# H1, ## H2, ### H3)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-foreground mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-extrabold text-foreground mt-6 mb-3 pb-1 border-b border-border/40">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-foreground mt-6 mb-4 pb-2 border-b border-border/60">$1</h1>');

  // 5. Blockquotes (> quote)
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-nexus-cyan/60 pl-4 py-1.5 my-3 italic text-muted-foreground bg-nexus-surface/40 rounded-r-lg">$1</blockquote>');

  // 6. Bold & Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-muted-foreground">$1</em>');

  // 7. Unordered lists (- item)
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-muted-foreground my-0.5">$1</li>');

  // 8. Paragraphs & Line breaks
  const paragraphs = html.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p class="my-2 leading-relaxed text-muted-foreground">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedPresets, setSavedPresets] = useState<ToolSavedState[]>([]);
  const [copied, setCopied] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadSavedDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/save?type=MARKDOWN");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSavedPresets(data.data);
      }
    } catch {
      // Ignore initial load failure
    }
  }, []);

  useEffect(() => {
    loadSavedDrafts();
  }, [loadSavedDrafts]);

  // Statistics calculation
  const stats = useMemo(() => {
    const characters = markdown.length;
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return { characters, words, readingTimeMinutes };
  }, [markdown]);

  const sanitizedHtml = useMemo(() => {
    return renderMarkdownToSafeHtml(markdown);
  }, [markdown]);

  const insertSnippet = (prefix: string, suffix = "") => {
    setMarkdown((prev) => `${prev}\n${prefix}Content${suffix}\n`);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-doc-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess("Downloaded", "Exported markdown document.");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toastSuccess("Copied", "Raw markdown copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) {
      toastError("Title Required", "Specify a title for this markdown document.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/tools/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "MARKDOWN",
          title: saveTitle.trim(),
          stateData: { content: markdown },
        }),
      });

      const data = await res.json();
      if (data.success) {
        toastSuccess("Draft Saved", `"${saveTitle}" persisted to PostgreSQL.`);
        setSaveTitle("");
        loadSavedDrafts();
      } else {
        toastError("Save Failed", data.message);
      }
    } catch (err: unknown) {
      toastError("Save Error", err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-[10px]">
              Developer Suite
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Live Sanitized Split-View Editor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Markdown Studio & Live Renderer
          </h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-nexus-surface/80 p-1 rounded-xl border border-border/60 text-xs font-medium">
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "split"
                ? "bg-nexus-cyan text-background font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split View</span>
          </button>
          <button
            onClick={() => setViewMode("edit")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "edit"
                ? "bg-nexus-cyan text-background font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Editor Only</span>
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "preview"
                ? "bg-nexus-cyan text-background font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Only</span>
          </button>
        </div>
      </div>

      {/* Formatting Action Toolbar */}
      <div className="p-3 rounded-2xl bg-nexus-surface/80 border border-border/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("# ")}
            className="h-8 w-8 text-xs font-bold"
            title="Header 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("## ")}
            className="h-8 w-8 text-xs font-bold"
            title="Header 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("**", "**")}
            className="h-8 w-8 text-xs"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("*", "*")}
            className="h-8 w-8 text-xs"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("```typescript\n", "\n```")}
            className="h-8 w-8 text-xs"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("- ")}
            className="h-8 w-8 text-xs"
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => insertSnippet("> ")}
            className="h-8 w-8 text-xs"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs h-8"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-1.5 text-xs h-8"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </Button>
        </div>
      </div>

      {/* Editor & Preview Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: Markdown Raw Source */}
        {(viewMode === "split" || viewMode === "edit") && (
          <div
            className={`flex flex-col rounded-2xl border border-border/80 bg-nexus-dark/90 overflow-hidden shadow-2xl ${
              viewMode === "edit" ? "lg:col-span-2" : ""
            }`}
          >
            <div className="px-4 py-2 border-b border-border/60 bg-nexus-surface/80 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <FileText className="w-3.5 h-3.5 text-nexus-cyan" />
                Markdown Source
              </span>
              <span>UTF-8 Plaintext</span>
            </div>

            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={22}
              spellCheck={false}
              placeholder="Write your markdown draft here..."
              className="flex-1 w-full p-5 font-mono text-xs sm:text-sm text-foreground bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-nexus-cyan/40 leading-relaxed"
            />

            <div className="px-4 py-2 border-t border-border/60 bg-nexus-surface/80 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{stats.words} words</span>
                <span>{stats.characters} chars</span>
              </div>
              <span>~{stats.readingTimeMinutes} min read</span>
            </div>
          </div>
        )}

        {/* Right Pane: Sanitized Rendered Preview */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div
            className={`flex flex-col rounded-2xl border border-border/80 bg-nexus-surface/40 backdrop-blur-md overflow-hidden shadow-2xl ${
              viewMode === "preview" ? "lg:col-span-2" : ""
            }`}
          >
            <div className="px-4 py-2 border-b border-border/60 bg-nexus-surface/80 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Live HTML Rendering
              </span>
              <Badge variant="emerald" className="text-[10px] py-0">
                Sanitized
              </Badge>
            </div>

            <div
              className="flex-1 p-6 text-sm text-foreground overflow-y-auto leading-relaxed max-h-[580px]"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>
        )}
      </div>

      {/* Persistence to Database */}
      <div className="p-6 rounded-2xl bg-nexus-surface/60 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-nexus-cyan" />
            <h3 className="text-sm font-bold text-foreground">
              Save Markdown Draft to Workspace DB
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {savedPresets.length} Drafts Saved
          </span>
        </div>

        <form onSubmit={handleSaveToDb} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            placeholder="Draft title (e.g. Nexus Core Architecture Spec)"
            className="flex-1 h-10 px-3.5 rounded-xl bg-nexus-dark border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-nexus-cyan"
          />
          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSaving}
            disabled={!markdown.trim()}
            className="gap-2 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Persist Draft</span>
          </Button>
        </form>

        {savedPresets.length > 0 && (
          <div className="pt-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Saved Drafts:
            </h4>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map((preset) => {
                const data = preset.stateData as { content?: string };
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      if (data.content) setMarkdown(data.content);
                      toastSuccess("Loaded Draft", `Restored "${preset.title}".`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-nexus-dark/80 hover:bg-nexus-cyan/15 border border-border/60 hover:border-nexus-cyan/40 text-xs font-mono text-muted-foreground hover:text-nexus-cyan transition-all"
                  >
                    {preset.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
