"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Save,
  AlertCircle,
  Database,
  Replace,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import type { ToolSavedState } from "@/types";

const COMMON_REGEX_PATTERNS = [
  {
    name: "Email Address",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    testString: "Reach our dev team at architect@nexus.io or support@nexus.io today!",
  },
  {
    name: "Semantic Versioning (SemVer)",
    pattern: "v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-([0-9a-zA-Z.-]+))?",
    flags: "gm",
    testString: "Current builds: v1.0.0, 2.14.3-alpha.1, and 3.0.0-rc.2.",
  },
  {
    name: "IPv4 Address",
    pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    flags: "g",
    testString: "Node cluster IPs: 192.168.1.1, 10.0.0.42, 172.16.254.1, 999.999.999.999 (invalid)",
  },
  {
    name: "UUID v4",
    pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}",
    flags: "gi",
    testString: "Session token: a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d was verified.",
  },
];

interface MatchDetail {
  matchIndex: number;
  fullMatch: string;
  index: number;
  groups: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState(COMMON_REGEX_PATTERNS[0].pattern);
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: false,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState(COMMON_REGEX_PATTERNS[0].testString);
  const [replacement, setReplacement] = useState("[REDACTED]");
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedPresets, setSavedPresets] = useState<ToolSavedState[]>([]);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadSavedPresets = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/save?type=REGEX");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSavedPresets(data.data);
      }
    } catch {
      // Ignore initial fetch errors
    }
  }, []);

  useEffect(() => {
    loadSavedPresets();
  }, [loadSavedPresets]);

  const flagString = useMemo(() => {
    return `${flags.g ? "g" : ""}${flags.i ? "i" : ""}${flags.m ? "m" : ""}${flags.s ? "s" : ""}`;
  }, [flags]);

  // Regex execution with error protection
  const { regexError, matches, replacedText } = useMemo(() => {
    if (!pattern.trim()) {
      return { regexError: null, matches: [], replacedText: testString };
    }

    try {
      const re = new RegExp(pattern, flagString);
      const allMatches: MatchDetail[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let count = 0;
        // Limit iterations to protect against infinite loops
        while ((match = re.exec(testString)) !== null && count < 500) {
          allMatches.push({
            matchIndex: count + 1,
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === re.lastIndex) {
            re.lastIndex++;
          }
          count++;
        }
      } else {
        const single = re.exec(testString);
        if (single) {
          allMatches.push({
            matchIndex: 1,
            fullMatch: single[0],
            index: single.index,
            groups: single.slice(1),
          });
        }
      }

      let subResult = testString;
      try {
        subResult = testString.replace(re, replacement);
      } catch {
        subResult = testString;
      }

      return { regexError: null, matches: allMatches, replacedText: subResult };
    } catch (err: unknown) {
      return {
        regexError: err instanceof Error ? err.message : "Invalid regular expression",
        matches: [],
        replacedText: testString,
      };
    }
  }, [pattern, flagString, testString, flags.g, replacement]);

  const toggleFlag = (flag: "g" | "i" | "m" | "s") => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleSaveToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regexError) {
      toastError("Invalid Regex", "Cannot save an invalid regular expression.");
      return;
    }
    if (!saveTitle.trim()) {
      toastError("Title Required", "Specify a title for this regex pattern.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/tools/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "REGEX",
          title: saveTitle.trim(),
          stateData: { pattern, flags: flagString, testString },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toastSuccess("Pattern Saved", `"${saveTitle}" persisted to database.`);
        setSaveTitle("");
        loadSavedPresets();
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
            <Badge variant="emerald" className="font-mono text-[10px]">
              Developer Suite
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Pattern Sandbox & Match Analyzer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Regex Pattern Sandbox & Group Inspector
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={regexError ? "rose" : matches.length > 0 ? "emerald" : "outline"}
            className="font-mono text-xs py-1"
          >
            {regexError
              ? "Invalid Regex"
              : `${matches.length} ${matches.length === 1 ? "Match" : "Matches"}`}
          </Badge>
        </div>
      </div>

      {/* Pattern Input & Flag Toggles */}
      <div className="p-5 rounded-2xl bg-nexus-surface/80 border border-border/80 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Pattern input */}
          <div className="relative flex-1 flex items-center bg-nexus-dark/90 rounded-xl border border-border/80 focus-within:border-emerald-500/60 font-mono text-sm px-3.5">
            <span className="text-emerald-400 font-bold select-none mr-1.5">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Insert regex pattern..."
              className="flex-1 bg-transparent py-2.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <span className="text-emerald-400 font-bold select-none ml-1.5">/</span>
            <span className="text-nexus-cyan font-mono text-xs ml-1 font-bold">
              {flagString}
            </span>
          </div>

          {/* Flag Toggle Pills */}
          <div className="flex items-center gap-1 bg-nexus-dark/60 p-1.5 rounded-xl border border-border/60 font-mono text-xs">
            {(["g", "i", "m", "s"] as const).map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  flags[flag]
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={`Flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>

          {/* Preset Library Select */}
          <select
            onChange={(e) => {
              const p = COMMON_REGEX_PATTERNS.find((item) => item.name === e.target.value);
              if (p) {
                setPattern(p.pattern);
                setTestString(p.testString);
                setFlags({
                  g: p.flags.includes("g"),
                  i: p.flags.includes("i"),
                  m: p.flags.includes("m"),
                  s: p.flags.includes("s"),
                });
              }
            }}
            className="h-11 px-3 rounded-xl bg-nexus-dark border border-border/80 text-xs font-mono text-muted-foreground focus:outline-none focus:border-emerald-500"
            defaultValue=""
          >
            <option value="" disabled>
              Common Patterns...
            </option>
            {COMMON_REGEX_PATTERNS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Alert */}
        {regexError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{regexError}</span>
          </div>
        )}
      </div>

      {/* Test String Sandbox & Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Test String Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Test String Sandbox
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={10}
            placeholder="Type or paste sample text to test..."
            className="w-full p-4 rounded-2xl bg-nexus-dark/90 border border-border/80 text-xs sm:text-sm font-mono text-foreground focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
          />
        </div>

        {/* Right: Matches & Groups Breakdown */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Match Inspection</span>
            <span className="font-mono text-nexus-cyan">
              {matches.length} Matched Segments
            </span>
          </label>

          <div className="p-4 rounded-2xl bg-nexus-surface/60 border border-border/80 h-64 overflow-y-auto divide-y divide-border/40 space-y-2">
            {matches.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-mono">
                No matching patterns detected.
              </div>
            ) : (
              matches.map((m) => (
                <div key={m.matchIndex} className="pt-2 first:pt-0 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">
                      Match #{m.matchIndex}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Index: {m.index}..{m.index + m.fullMatch.length}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-nexus-dark/80 border border-border/40 text-cyan-200">
                    {m.fullMatch}
                  </div>
                  {m.groups.length > 0 && (
                    <div className="pl-3 border-l-2 border-border/60 space-y-0.5 text-[11px] text-muted-foreground">
                      {m.groups.map((g, gi) => (
                        <div key={gi} className="flex gap-2">
                          <span className="text-nexus-violet">Group {gi + 1}:</span>
                          <span className="text-foreground">{g ?? "undefined"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* String Substitution Tool */}
      <div className="p-5 rounded-2xl bg-nexus-surface/60 border border-border/80 space-y-3">
        <div className="flex items-center gap-2">
          <Replace className="w-4 h-4 text-nexus-cyan" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            String Substitution Engine
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <input
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="Replacement template (supports $1, $2)"
            className="sm:col-span-1 h-10 px-3 rounded-xl bg-nexus-dark border border-border/80 text-xs font-mono text-foreground focus:outline-none focus:border-nexus-cyan"
          />
          <div className="sm:col-span-2 p-3 rounded-xl bg-nexus-dark/80 border border-border/40 text-xs font-mono text-emerald-300 truncate">
            {replacedText}
          </div>
        </div>
      </div>

      {/* Persistence to Database */}
      <div className="p-6 rounded-2xl bg-nexus-surface/60 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-foreground">
              Save Pattern to Workspace DB
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {savedPresets.length} Patterns Persisted
          </span>
        </div>

        <form onSubmit={handleSaveToDb} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            placeholder="Pattern title (e.g. Custom JWT Regex)"
            className="flex-1 h-10 px-3.5 rounded-xl bg-nexus-dark border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500"
          />
          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSaving}
            disabled={Boolean(regexError) || !pattern.trim()}
            className="gap-2 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Persist Pattern</span>
          </Button>
        </form>

        {savedPresets.length > 0 && (
          <div className="pt-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Saved Regex Patterns:
            </h4>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map((preset) => {
                const data = preset.stateData as { pattern?: string; flags?: string; testString?: string };
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      if (data.pattern) setPattern(data.pattern);
                      if (data.testString) setTestString(data.testString);
                      toastSuccess("Loaded Pattern", `Restored "${preset.title}".`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-nexus-dark/80 hover:bg-emerald-500/15 border border-border/60 hover:border-emerald-500/40 text-xs font-mono text-muted-foreground hover:text-emerald-400 transition-all"
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
