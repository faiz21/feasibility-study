"use client";

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

type SelectedSectionPayload = {
  name: string;
  content: string;
  remark: string;
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
  selected_section_names?: string[];
  section_remarks?: Record<string, string>;
};

type ReviewScore = {
  overall: number | null;
  outline_alignment: number | null;
  writing_alignment: number | null;
  analysis_score: number | null;
  notes: string[];
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
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

function normalizeSections(candidate: unknown): Record<string, string> {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return {};
  const rawEntries = Object.entries(candidate as Record<string, unknown>)
    .filter(([key, value]) => typeof key === "string" && typeof value === "string")
    .map(([key, value]) => [key.trim(), String(value).trim()] as const)
    .filter(([key, value]) => key.length > 0 && value.length > 0);

  if (rawEntries.length === 0) return {};

  const blockedKeys = new Set(["reply", "message", "content", "assistant", "response"]);
  const filteredEntries = rawEntries.filter(([key]) => !blockedKeys.has(key.toLowerCase()));
  if (filteredEntries.length === 0) return {};

  const sectionLikeEntries = filteredEntries.filter(
    ([, value]) => value.startsWith("## ") || value.includes("\n"),
  );
  if (sectionLikeEntries.length === 0) return {};

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
  const sessionStorageKey = useMemo(
    () => `report_chat_session_${reportId}_${pageId}_${userId}`,
    [reportId, pageId, userId],
  );
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
    }),
    [initialScores],
  );

  const initialSession = useMemo<ChatSession>(
    () => ({
      session_id: `${reportId}_${pageId}_${userId}`,
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
      selected_section_names: [],
      section_remarks: {},
    }),
    [initialScoreState, reportId, pageId, userId, initialSections],
  );

  const [session, setSession] = useState<ChatSession>(initialSession);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Select sections on the left, add remarks, then send your prompt. I will revise only selected sections.",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [retryMode, setRetryMode] = useState<"send" | "finalize" | null>(null);

  const sectionNames = useMemo(() => Object.keys(session.sections), [session.sections]);
  const selectedSectionNames = useMemo(
    () => session.selected_section_names ?? [],
    [session.selected_section_names],
  );
  const selectedSectionSet = useMemo(() => new Set(selectedSectionNames), [selectedSectionNames]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(sessionStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatSession;
      if (parsed?.session_id !== `${reportId}_${pageId}_${userId}`) return;
      const parsedSectionNames = Array.isArray(parsed.selected_section_names)
        ? parsed.selected_section_names.filter((name): name is string => typeof name === "string")
        : [];
      const parsedRemarks =
        parsed.section_remarks && typeof parsed.section_remarks === "object"
          ? (parsed.section_remarks as Record<string, string>)
          : {};
      setSession({
        ...initialSession,
        ...parsed,
        selected_section_names: parsedSectionNames,
        section_remarks: parsedRemarks,
      });
      if (Array.isArray(parsed.history) && parsed.history.length > 0) {
        setMessages(parsed.history);
      }
    } catch {
      return;
    }
  }, [initialSession, pageId, reportId, sessionStorageKey, userId]);

  useEffect(() => {
    window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  }, [session, sessionStorageKey]);

  const canSend =
    prompt.trim().length > 0 &&
    selectedSectionNames.length > 0 &&
    !loading &&
    !finalizing &&
    !session.is_final;
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
  const hasAnyScore =
    overallScore !== null || outlineScore !== null || writingScore !== null || analysisScore !== null;
  const reviewNotes = Array.isArray(session.notes) ? session.notes : [];

  function updateSelectedSections(names: string[]) {
    const validNames = names.filter((name) => typeof session.sections[name] === "string");
    setSession((prev) => ({ ...prev, selected_section_names: validNames }));
  }

  function toggleSection(name: string) {
    if (selectedSectionSet.has(name)) {
      updateSelectedSections(selectedSectionNames.filter((item) => item !== name));
      return;
    }
    updateSelectedSections([...selectedSectionNames, name]);
  }

  function setSectionRemark(name: string, remark: string) {
    setSession((prev) => ({
      ...prev,
      section_remarks: {
        ...(prev.section_remarks ?? {}),
        [name]: remark,
      },
    }));
  }

  function buildSelectedSectionsPayload(): {
    selectedMap: Record<string, string>;
    selectedList: SelectedSectionPayload[];
  } {
    const selectedList: SelectedSectionPayload[] = selectedSectionNames
      .filter((name) => typeof session.sections[name] === "string")
      .map((name) => ({
        name,
        content: session.sections[name],
        remark: String(session.section_remarks?.[name] ?? "").trim(),
      }));

    const selectedMap = Object.fromEntries(selectedList.map((item) => [item.name, item.content]));
    return { selectedMap, selectedList };
  }

  async function postChat(isDone: boolean, messageText: string) {
    const fullEnReport = joinSections(session.sections);
    const { selectedMap, selectedList } = buildSelectedSectionsPayload();
    const sectionsForRequest = isDone ? session.sections : selectedMap;
    const response = await fetch("/api/admin/report-markdown-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: session.session_id,
        report_id: session.report_id,
        message: messageText,
        is_done: isDone,
        sections: sectionsForRequest,
        selected_sections: selectedList,
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
    const normalizedSections = normalizeSections(payload?.sections);
    let nextSections = { ...session.sections, ...normalizedSections };
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
      selected_section_names: selectedSectionNames,
      section_remarks: session.section_remarks ?? {},
    };

    setSession(nextSession);
    setMessages(
      nextHistory.length > 0 ? nextHistory : [{ role: "assistant", content: payload?.reply ?? "Response received." }],
    );
    setStatus(payload?.reply ?? "");
    setError("");

  }

  async function sendPrompt() {
    if (!canSend) {
      if (selectedSectionNames.length === 0) {
        setError("Select at least one section before sending.");
      }
      return;
    }
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
    const markdown = targetLocale === "id" ? displayId : targetLocale === "ja" ? displayJa : displayEn;
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

  return (
    <div className="space-y-4">
      {finalizing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-card px-6 py-4 text-sm font-medium text-foreground shadow-xl">
            Assembling and translating report...
          </div>
        </div>
      ) : null}

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
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Outline Alignment
            </p>
            <p className="text-sm font-semibold text-foreground">{outlineScore !== null ? `${outlineScore}/100` : "-"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-muted/40 p-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Writing Alignment
            </p>
            <p className="text-sm font-semibold text-foreground">{writingScore !== null ? `${writingScore}/100` : "-"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-muted/40 p-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Analysis Score</p>
            <p className="text-sm font-semibold text-foreground">{analysisScore !== null ? `${analysisScore}/100` : "-"}</p>
          </div>
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
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Section Selection</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => updateSelectedSections(sectionNames)}
              disabled={sectionNames.length === 0}
            >
              Select All
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => updateSelectedSections([])}>
              Clear
            </Button>
          </div>
        </div>
        <p className="mb-2 text-xs text-muted-foreground">
          Selected sections: {selectedSectionNames.length} / {sectionNames.length}
        </p>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border/60 p-2">
          {sectionNames.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sections found in EN markdown.</p>
          ) : null}
          {sectionNames.map((name) => {
            const selectedNow = selectedSectionSet.has(name);
            return (
              <div key={name} className="rounded-md border border-border/60 p-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedNow}
                    onChange={() => toggleSection(name)}
                  />
                  {name}
                </label>
                {selectedNow ? (
                  <textarea
                    value={String(session.section_remarks?.[name] ?? "")}
                    onChange={(event) => setSectionRemark(name, event.target.value)}
                    placeholder="Remark for this section (optional)"
                    className="mt-2 min-h-[72px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
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
            placeholder="Ask AI to review selected sections..."
            disabled={loading || finalizing || session.is_final}
          />
          <Button type="button" onClick={sendPrompt} disabled={!canSend}>
            {loading ? "Sending..." : "Send"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={finalizeReport}
            disabled={session.is_final || loading || finalizing}
          >
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
