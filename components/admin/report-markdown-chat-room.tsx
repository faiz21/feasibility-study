"use client";

import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SectionUpdate = {
  name: string;
  content: string;
};

type ChatSession = {
  session_id: string;
  report_id: string;
  sections: Record<string, string>;
  history: Message[];
  is_final: boolean;
  raw_report?: string;
  raw_report_id?: string;
  raw_report_jp?: string;
  overall?: number | null;
  outline_alignment?: number | null;
  writing_alignment?: number | null;
  analysis_score?: number | null;
  notes?: string[];
  page_summary?: string | null;
};

type ReviewScore = {
  overall: number | null;
  outline_alignment: number | null;
  writing_alignment: number | null;
  analysis_score: number | null;
  notes: string[];
  page_summary: string | null;
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function getNestedObject(source: unknown, key: string): Record<string, unknown> | null {
  if (!source || typeof source !== "object") return null;
  const candidate = (source as Record<string, unknown>)[key];
  return candidate && typeof candidate === "object" ? (candidate as Record<string, unknown>) : null;
}

function splitIntoSections(markdown: string): Record<string, string> {
  const text = String(markdown ?? "").trim();
  if (!text) return {};
  const chunks = text.split(/(?=^## (?!#))/m).map((part) => part.trim()).filter(Boolean);
  const sections: Record<string, string> = {};

  chunks.forEach((chunk, index) => {
    const firstLine = chunk.split("\n")[0]?.trim() ?? "";
    const key = firstLine.startsWith("## ") ? firstLine.replace(/^##\s+/, "").trim() : `Section ${index + 1}`;
    sections[key] = chunk;
  });

  if (Object.keys(sections).length === 0 && text) {
    sections.Overview = text;
  }

  return sections;
}

function joinSections(sections: Record<string, string>): string {
  return Object.values(sections).join("\n\n").trim();
}

function renderMarkdown(markdown: string): string {
  const text = String(markdown ?? "").trim();
  if (!text) return '<p class="text-sm text-muted-foreground">No content.</p>';
  return marked.parse(text, { gfm: true, breaks: true }) as string;
}

function parseSectionChunk(chunk: string): { heading: string; body: string } {
  const lines = String(chunk ?? "").split("\n");
  const first = lines[0]?.trim() ?? "";
  if (first.startsWith("## ")) {
    return {
      heading: first.replace(/^##\s+/, "").trim(),
      body: lines.slice(1).join("\n").trim(),
    };
  }
  return { heading: "Section", body: String(chunk ?? "") };
}

function normalizeSections(
  candidate: unknown,
  fallback: Record<string, string>,
): Record<string, string> {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return fallback;
  const rawEntries = Object.entries(candidate as Record<string, unknown>)
    .filter(([key, value]) => typeof key === "string" && typeof value === "string")
    .map(([key, value]) => [key.trim(), String(value).trim()] as const)
    .filter(([key, value]) => key.length > 0 && value.length > 0);

  if (rawEntries.length === 0) return fallback;

  // Reject common chat payload keys so assistant replies do not overwrite the draft.
  const blockedKeys = new Set(["reply", "message", "content", "assistant", "response"]);
  const filteredEntries = rawEntries.filter(([key]) => !blockedKeys.has(key.toLowerCase()));
  if (filteredEntries.length === 0) return fallback;

  // Require section-like markdown payload, not single-line chat text.
  const sectionLikeEntries = filteredEntries.filter(
    ([, value]) => value.startsWith("## ") || value.includes("\n"),
  );
  if (sectionLikeEntries.length === 0) return fallback;

  return Object.fromEntries(
    sectionLikeEntries.map(([key, value]) => {
      if (value.startsWith("## ")) return [key, value] as const;
      return [key, `## ${key}\n\n${value}`] as const;
    }),
  );
}

export function ReportMarkdownChatRoom({
  reportId,
  userId,
  pageId,
  initialEnMarkdown,
  initialScores,
}: {
  reportId: string;
  userId: string;
  pageId: string;
  initialEnMarkdown: string;
  initialScores?: Partial<ReviewScore>;
}) {
  const sessionStorageKey = useMemo(() => `report_chat_session_${reportId}_${userId}`, [reportId, userId]);
  const initialSections = useMemo(() => splitIntoSections(initialEnMarkdown), [initialEnMarkdown]);
  const initialScoreState = useMemo(
    () => ({
      overall: typeof initialScores?.overall === "number" ? initialScores.overall : null,
      outline_alignment:
        typeof initialScores?.outline_alignment === "number" ? initialScores.outline_alignment : null,
      writing_alignment:
        typeof initialScores?.writing_alignment === "number" ? initialScores.writing_alignment : null,
      analysis_score:
        typeof initialScores?.analysis_score === "number" ? initialScores.analysis_score : null,
      notes: Array.isArray(initialScores?.notes) ? initialScores.notes : [],
      page_summary: typeof initialScores?.page_summary === "string" ? initialScores.page_summary : null,
    }),
    [initialScores],
  );
  const initialSession = useMemo<ChatSession>(
    () => ({
      session_id: `${reportId}_${userId}`,
      report_id: reportId,
      sections: initialSections,
      history: [],
      is_final: false,
      raw_report: "",
      raw_report_id: "",
      raw_report_jp: "",
      overall: initialScoreState.overall,
      outline_alignment: initialScoreState.outline_alignment,
      writing_alignment: initialScoreState.writing_alignment,
      analysis_score: initialScoreState.analysis_score,
      notes: initialScoreState.notes,
      page_summary: initialScoreState.page_summary,
    }),
    [initialScoreState, reportId, userId, initialSections],
  );

  const [session, setSession] = useState<ChatSession>(initialSession);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ask me to review or rewrite this markdown page. I will use this page content as context.",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [updatedSectionName, setUpdatedSectionName] = useState<string>("");
  const [retryMode, setRetryMode] = useState<"send" | "finalize" | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(sessionStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatSession;
      if (parsed?.session_id === `${reportId}_${userId}`) {
        setSession(parsed);
        if (Array.isArray(parsed.history) && parsed.history.length > 0) {
          setMessages(parsed.history);
        }
      }
    } catch {
      return;
    }
  }, [reportId, sessionStorageKey, userId]);

  useEffect(() => {
    window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  }, [session, sessionStorageKey]);

  const canSend = prompt.trim().length > 0 && !loading && !finalizing && !session.is_final;
  const visibleMessages = useMemo(() => messages.slice(-20), [messages]);
  const workingEnMarkdown = joinSections(session.sections);
  const displayEn = session.is_final ? String(session.raw_report ?? "") : workingEnMarkdown;
  const displayId = session.is_final ? String(session.raw_report_id ?? "") : "";
  const displayJa = session.is_final ? String(session.raw_report_jp ?? "") : "";
  const outlineScore = asNumber(session.outline_alignment);
  const writingScore = asNumber(session.writing_alignment);
  const analysisScore = asNumber(session.analysis_score);
  const computedOverall =
    outlineScore !== null && writingScore !== null && analysisScore !== null
      ? Math.round((outlineScore + writingScore + analysisScore) / 3)
      : null;
  const overallScore = asNumber(session.overall) ?? computedOverall;
  const hasAnyScore = overallScore !== null || outlineScore !== null || writingScore !== null || analysisScore !== null;
  const reviewNotes = Array.isArray(session.notes) ? session.notes : [];

  async function postChat(isDone: boolean, messageText: string) {
    const fullEnReport = joinSections(session.sections);
    const response = await fetch("/api/admin/report-markdown-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: session.session_id,
        report_id: session.report_id,
        message: messageText,
        is_done: isDone,
        sections: session.sections,
        history: session.history,
        raw_report: fullEnReport,
        full_en_report: fullEnReport,
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | {
          error?: string;
          reply?: string;
          has_update?: boolean;
          updated_section?: SectionUpdate | null;
          sections?: Record<string, string>;
          history?: Message[];
          is_final?: boolean;
          raw_report?: string;
          raw_report_id?: string;
          raw_report_jp?: string;
          overall?: number | null;
          outline_alignment?: number | null;
          writing_alignment?: number | null;
          analysis_score?: number | null;
          notes?: string[] | null;
          page_summary?: string | null;
        }
      | null;

    if (!response.ok) {
      throw new Error(payload?.error ?? "Failed to connect to AI agent.");
    }

    const payloadObj = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
    const nestedScoreSources = [
      payloadObj,
      getNestedObject(payloadObj, "review"),
      getNestedObject(payloadObj, "scores"),
      getNestedObject(payloadObj, "score"),
      getNestedObject(payloadObj, "metrics"),
      getNestedObject(payloadObj, "evaluation"),
    ].filter(Boolean) as Record<string, unknown>[];

    const readNumber = (keys: string[]): number | null => {
      for (const source of nestedScoreSources) {
        for (const key of keys) {
          const value = asNumber(source[key]);
          if (value !== null) return value;
        }
      }
      return null;
    };
    const readString = (keys: string[]): string | null => {
      for (const source of nestedScoreSources) {
        for (const key of keys) {
          const value = asString(source[key]);
          if (value !== null) return value;
        }
      }
      return null;
    };
    const readStringList = (keys: string[]): string[] => {
      for (const source of nestedScoreSources) {
        for (const key of keys) {
          const values = asStringArray(source[key]);
          if (values.length > 0) return values;
        }
      }
      return [];
    };

    const nextHistory = Array.isArray(payload?.history) ? payload.history : session.history;
    let nextSections = normalizeSections(payload?.sections, session.sections);
    if (payload?.has_update && payload?.updated_section?.name && payload?.updated_section?.content) {
      const updateName = payload.updated_section.name.trim();
      const updateContent = payload.updated_section.content.trim();
      if (updateName && updateContent) {
        nextSections = {
          ...nextSections,
          [updateName]: updateContent.startsWith("## ")
            ? updateContent
            : `## ${updateName}\n\n${updateContent}`,
        };
      }
    }
    const resolvedOverall = readNumber(["overall"]);
    const resolvedOutline = readNumber(["outline_alignment", "outlineAlignment"]);
    const resolvedWriting = readNumber(["writing_alignment", "writingAlignment"]);
    const resolvedAnalysis = readNumber(["analysis_score", "analysisScore"]);
    const resolvedSummary = readString(["page_summary", "pageSummary", "summary"]);
    const resolvedNotes = readStringList(["notes"]);
    const nextSession: ChatSession = {
      ...session,
      history: nextHistory,
      sections: nextSections,
      is_final: Boolean(payload?.is_final),
      raw_report: payload?.raw_report ?? session.raw_report,
      raw_report_id: payload?.raw_report_id ?? session.raw_report_id,
      raw_report_jp: payload?.raw_report_jp ?? session.raw_report_jp,
      overall: resolvedOverall ?? session.overall,
      outline_alignment: resolvedOutline ?? session.outline_alignment,
      writing_alignment: resolvedWriting ?? session.writing_alignment,
      analysis_score: resolvedAnalysis ?? session.analysis_score,
      notes: resolvedNotes.length > 0 ? resolvedNotes : (session.notes ?? []),
      page_summary: resolvedSummary ?? (session.page_summary ?? null),
    };

    setSession(nextSession);
    setMessages(nextHistory.length > 0 ? nextHistory : [{ role: "assistant", content: payload?.reply ?? "Response received." }]);
    setStatus(payload?.reply ?? "");
    setError("");

    if (payload?.has_update && payload?.updated_section?.name) {
      setUpdatedSectionName(payload.updated_section.name);
      setTimeout(() => setUpdatedSectionName(""), 1800);
      const target = document.getElementById(`section-en-${payload.updated_section.name}`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  async function sendPrompt() {
    if (!canSend) return;
    const nextPrompt = prompt.trim();
    setPrompt("");
    setRetryMode("send");
    setLoading(true);
    setError("");

    try {
      await postChat(false, nextPrompt);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reach AI reviewer.";
      setError(message);
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  }

  async function finalizeReport() {
    if (session.is_final || loading || finalizing) return;
    const ok = window.confirm("This will assemble and translate the full report. Continue?");
    if (!ok) return;
    setRetryMode("finalize");
    setFinalizing(true);
    setError("");
    setStatus("Assembling and translating report...");

    try {
      await postChat(true, "Finalize report");
    } finally {
      setFinalizing(false);
    }
  }

  async function saveFinalLocale(targetLocale: "en" | "id" | "ja") {
    const markdown =
      targetLocale === "id"
        ? displayId
        : targetLocale === "ja"
          ? displayJa
          : displayEn;
    if (!markdown.trim()) return;
    setStatus(`Saving ${targetLocale.toUpperCase()}...`);
    const response = await fetch("/api/admin/report-markdown-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        pageId,
        locale: targetLocale,
        markdown,
        overall: session.overall,
        outline_alignment: session.outline_alignment,
        writing_alignment: session.writing_alignment,
        analysis_score: session.analysis_score,
        notes: session.notes ?? [],
        page_summary: session.page_summary ?? "",
      }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(payload?.error ?? `Failed to save ${targetLocale.toUpperCase()}.`);
      return;
    }
    setStatus(`${targetLocale.toUpperCase()} saved.`);
  }

  function downloadMarkdown(localeLabel: "en" | "id" | "ja", markdown: string) {
    if (!markdown.trim()) return;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${reportId}_${pageId}_${localeLabel}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function renderColumn(markdown: string, highlightEnabled: boolean) {
    if (highlightEnabled) {
      return (
        <div className="space-y-3 p-3">
          {Object.entries(session.sections).map(([name, chunk]) => {
            const parsed = parseSectionChunk(chunk);
            const isUpdated = updatedSectionName === name;
            return (
              <section
                key={name}
                id={`section-en-${name}`}
                className={`rounded-md border p-3 transition-colors ${isUpdated ? "border-primary bg-primary/10" : "border-border/60 bg-card"}`}
              >
                <h3 className="mb-2 text-sm font-semibold">{parsed.heading || name}</h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(parsed.body || chunk) }}
                />
              </section>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className="prose prose-sm max-w-none p-3"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {finalizing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-card px-6 py-4 text-sm font-medium text-foreground shadow-xl">
            Assembling and translating report...
          </div>
        </div>
      ) : null}

      <div className="rounded-md border border-border/70 bg-card">
        <div className="border-b border-border/70 px-3 py-2 text-xs font-semibold">EN Working Draft</div>
        <div className="h-[58vh] overflow-y-auto">{renderColumn(displayEn, true)}</div>
      </div>

      <div className="rounded-md border border-border/70 bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Review Score</p>
          <p className="text-sm font-semibold text-foreground">
            Overall: {overallScore !== null ? `${overallScore}/100` : "Not scored"}
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.max(0, Math.min(100, overallScore ?? 0))}%` }}
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border/60 bg-muted/40 p-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Outline Alignment</p>
            <p className="text-sm font-semibold text-foreground">{outlineScore !== null ? `${outlineScore}/100` : "-"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-muted/40 p-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Writing Alignment</p>
            <p className="text-sm font-semibold text-foreground">{writingScore !== null ? `${writingScore}/100` : "-"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-muted/40 p-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Analysis Score</p>
            <p className="text-sm font-semibold text-foreground">{analysisScore !== null ? `${analysisScore}/100` : "-"}</p>
          </div>
        </div>
        <div className="mt-2 rounded-md border border-border/60 bg-muted/40 p-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Page Summary</p>
          {session.page_summary?.trim() ? (
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(session.page_summary) }}
            />
          ) : (
            <p className="text-sm text-foreground">No summary yet.</p>
          )}
        </div>
        <div className="mt-2 rounded-md border border-border/60 bg-muted/40 p-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
          {reviewNotes.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {reviewNotes.map((note, index) => (
                <li key={`${index}-${note.slice(0, 24)}`}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          )}
        </div>
        {!hasAnyScore ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Waiting for score fields from n8n response (`overall`, `outline_alignment`, `writing_alignment`, `analysis_score`).
          </p>
        ) : null}
      </div>

      <div className="rounded-md border border-border/70 bg-card p-3">
        <div className="mb-3 max-h-64 space-y-2 overflow-y-auto">
          {visibleMessages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-md px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-8 border border-primary/30 bg-primary/10 text-foreground"
                  : "mr-8 border border-border/70 bg-muted text-foreground"
              }`}
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {message.role === "user" ? "You" : "AI Reviewer"}
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask AI to review/rewrite section by section..."
            disabled={!canSend && (loading || finalizing || session.is_final)}
          />
          <Button type="button" onClick={sendPrompt} disabled={!canSend}>
            {loading ? "Sending..." : "Send"}
          </Button>
          <Button type="button" variant="secondary" onClick={finalizeReport} disabled={session.is_final || loading || finalizing}>
            {finalizing ? "Finalizing..." : "Finalize"}
          </Button>
        </div>

        {error ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-critical">
            <span>{error}</span>
            {retryMode === "send" ? (
              <Button type="button" size="sm" variant="secondary" onClick={sendPrompt} disabled={loading}>
                Retry
              </Button>
            ) : null}
            {retryMode === "finalize" ? (
              <Button type="button" size="sm" variant="secondary" onClick={finalizeReport} disabled={finalizing}>
                Retry
              </Button>
            ) : null}
          </div>
        ) : null}
        {status ? <p className="mt-2 text-xs text-muted-foreground">{status}</p> : null}
      </div>

      {session.is_final ? (
        <div className="flex flex-wrap gap-2 rounded-md border border-border/70 bg-card p-3">
          <Button type="button" size="sm" variant="secondary" onClick={() => downloadMarkdown("en", displayEn)}>
            Download EN
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => downloadMarkdown("id", displayId)}>
            Download ID
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => downloadMarkdown("ja", displayJa)}>
            Download JA
          </Button>
          <Button type="button" size="sm" onClick={() => saveFinalLocale("en")}>
            Save EN
          </Button>
          <Button type="button" size="sm" onClick={() => saveFinalLocale("id")}>
            Save ID
          </Button>
          <Button type="button" size="sm" onClick={() => saveFinalLocale("ja")}>
            Save JA
          </Button>
        </div>
      ) : null}
    </div>
  );
}
