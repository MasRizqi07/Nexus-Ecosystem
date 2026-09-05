"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Check,
  Copy,
  Trash2,
  Save,
  AlertCircle,
  Database,
  ArrowDownToLine,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import type { ToolSavedState } from "@/types";

const SAMPLE_JSON_PRESETS = [
  {
    name: "API Microservice Config",
    data: {
      server: {
        host: "0.0.0.0",
        port: 8080,
        cors: { enabled: true, origins: ["https://nexus.io"] },
      },
      database: {
        poolSize: 20,
        ssl: true,
        timeoutMs: 5000,
      },
      telemetry: {
        metricsEnabled: true,
        logLevel: "debug",
      },
    },
  },
  {
    name: "Cloud IAM Policy",
    data: {
      Version: "2025-10-17",
      Statement: [
        {
          Sid: "VisualizerReadExecution",
          Effect: "Allow",
          Action: ["nexus:ExecuteAlgorithm", "nexus:StreamTelemetry"],
          Resource: "arn:nexus:compute:us-west-1:cluster/*",
        },
      ],
    },
  },
];

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useState<string>(
    JSON.stringify(SAMPLE_JSON_PRESETS[0].data, null, 2)
  );
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<{ bytes: number; keys: number }>({
    bytes: 0,
    keys: 0,
  });
  const [copied, setCopied] = useState(false);

  // Persistence State
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedPresets, setSavedPresets] = useState<ToolSavedState[]>([]);
  const { success: toastSuccess, error: toastError } = useToast();

  const loadSavedPresets = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/save?type=JSON");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSavedPresets(data.data);
      }
    } catch {
      // Ignore network errors in initial load
    }
  }, []);

  useEffect(() => {
    loadSavedPresets();
  }, [loadSavedPresets]);

  // Real-time parsing effect
  useEffect(() => {
    if (!inputJson.trim()) {
      setIsValid(true);
      setErrorMessage(null);
      setStats({ bytes: 0, keys: 0 });
      return;
    }

    try {
      const parsed: unknown = JSON.parse(inputJson);
      setIsValid(true);
      setErrorMessage(null);

      const keysCount =
        typeof parsed === "object" && parsed !== null
          ? Object.keys(parsed).length
          : 0;
      setStats({
        bytes: new Blob([inputJson]).size,
        keys: keysCount,
      });
    } catch (err: unknown) {
      setIsValid(false);
      setErrorMessage(err instanceof Error ? err.message : "Syntax error in JSON");
    }
  }, [inputJson]);

  const handleFormat = () => {
    try {
      const parsed: unknown = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, indentSize));
      toastSuccess("Formatted Successfully", `Indented with ${indentSize} spaces.`);
    } catch {
      toastError("Cannot Format", "Please resolve JSON syntax errors first.");
    }
  };

  const handleMinify = () => {
    try {
      const parsed: unknown = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      toastSuccess("Minified", "Whitespace and line breaks removed.");
    } catch {
      toastError("Cannot Minify", "Please resolve JSON syntax errors first.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    toastSuccess("Copied", "JSON copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !inputJson.trim()) {
      toastError("Invalid JSON", "Cannot save invalid JSON to database.");
      return;
    }
    if (!saveTitle.trim()) {
      toastError("Title Required", "Please specify a title for this preset.");
      return;
    }

    setIsSaving(true);
    try {
      const parsed: unknown = JSON.parse(inputJson);
      const res = await fetch("/api/tools/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "JSON",
          title: saveTitle.trim(),
          stateData: parsed as Record<string, unknown>,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toastSuccess("Preset Saved", `"${saveTitle}" persisted to PostgreSQL.`);
        setSaveTitle("");
        loadSavedPresets();
      } else {
        toastError("Save Failed", data.message || "Could not persist state.");
      }
    } catch (err: unknown) {
      toastError(
        "Save Failed",
        err instanceof Error ? err.message : "Network error"
      );
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
            <Badge variant="violet" className="font-mono text-[10px]">
              Developer Suite
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              AST Validator & Formatter
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            JSON Formatter & Schema Linter
          </h1>
        </div>

        {/* Validation Status Badge */}
        <div className="flex items-center gap-3">
          {isValid ? (
            <Badge variant="emerald" className="gap-1 font-mono text-xs py-1">
              <Check className="w-3.5 h-3.5" />
              <span>Valid JSON</span>
            </Badge>
          ) : (
            <Badge variant="rose" className="gap-1 font-mono text-xs py-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Invalid Syntax</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-nexus-surface/80 border border-border/80 flex flex-wrap items-center justify-between gap-4">
        {/* Left Actions: Format, Minify, Spaces */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="glow" size="sm" onClick={handleFormat} className="gap-1.5 text-xs">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Format</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleMinify} className="gap-1.5 text-xs">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </Button>

          <div className="flex items-center gap-1 border border-border/60 rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setIndentSize(2)}
              className={`px-2 py-0.5 rounded ${
                indentSize === 2
                  ? "bg-nexus-cyan/20 text-nexus-cyan font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => setIndentSize(4)}
              className={`px-2 py-0.5 rounded ${
                indentSize === 4
                  ? "bg-nexus-cyan/20 text-nexus-cyan font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              4 Spaces
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInputJson("")}
            className="text-xs text-muted-foreground hover:text-rose-400 gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>

        {/* Right Actions: Presets & Copy */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              const preset = SAMPLE_JSON_PRESETS.find((p) => p.name === e.target.value);
              if (preset) {
                setInputJson(JSON.stringify(preset.data, null, indentSize));
              }
            }}
            className="h-8 px-2 rounded-lg bg-nexus-dark border border-border/60 text-xs text-muted-foreground focus:outline-none focus:border-nexus-cyan font-mono"
            defaultValue=""
          >
            <option value="" disabled>
              Load Example Preset...
            </option>
            {SAMPLE_JSON_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs"
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
        </div>
      </div>

      {/* Editor & Linter Error Output */}
      <div className="space-y-3">
        {!isValid && errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="relative rounded-2xl border border-border/80 bg-nexus-dark/90 overflow-hidden shadow-2xl">
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            spellCheck={false}
            rows={18}
            placeholder="Paste raw JSON here..."
            className="w-full p-5 font-mono text-xs sm:text-sm text-cyan-200 bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-nexus-cyan/40 leading-relaxed selection:bg-nexus-cyan/20"
          />

          {/* Bottom Editor Bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-nexus-surface/80 border-t border-border/60 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Size: {stats.bytes} bytes</span>
              <span>Root Keys: {stats.keys}</span>
            </div>
            <span>Encoding: UTF-8</span>
          </div>
        </div>
      </div>

      {/* Database Persistence Section */}
      <div className="p-6 rounded-2xl bg-nexus-surface/60 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-nexus-cyan" />
            <h3 className="text-sm font-bold text-foreground">
              Save Configuration to Database
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {savedPresets.length} Saved in DB
          </span>
        </div>

        <form onSubmit={handleSaveToDb} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            placeholder="Preset title (e.g. Production Cluster Spec)"
            className="flex-1 h-10 px-3.5 rounded-xl bg-nexus-dark border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-nexus-cyan"
          />
          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSaving}
            disabled={!isValid || !inputJson.trim()}
            className="gap-2 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Persist to DB</span>
          </Button>
        </form>

        {/* Saved Presets Chips */}
        {savedPresets.length > 0 && (
          <div className="pt-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Saved Presets:
            </h4>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setInputJson(JSON.stringify(preset.stateData, null, indentSize));
                    toastSuccess("Loaded Preset", `Restored "${preset.title}".`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-nexus-dark/80 hover:bg-nexus-cyan/15 border border-border/60 hover:border-nexus-cyan/40 text-xs font-mono text-muted-foreground hover:text-nexus-cyan transition-all"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
