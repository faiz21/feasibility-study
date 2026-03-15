"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";

type SaveTone = "success" | "critical";

function buildMarkdownViewerHtml(markdownHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Markdown Preview</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: #ffffff;
      color: #0f172a;
      font: 15px/1.6 "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    h1,h2,h3,h4,h5,h6 { line-height: 1.25; margin: 1.2em 0 .55em; }
    p { margin: .6em 0 1em; }
    ul,ol { margin: .6em 0 1em 1.2em; padding: 0; }
    blockquote { margin: 1em 0; padding: .25em 1em; border-left: 4px solid #cbd5e1; color: #334155; }
    pre { overflow: auto; padding: 12px; border-radius: 12px; background: #0b1220; color: #e2e8f0; }
    code { font: 13px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f8fafc; }
    a { color: #1d4ed8; text-decoration: underline; }
    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 1.2em 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${markdownHtml}
</body>
</html>`;
}

export function ReportMarkdownLocaleWorkbench({
  reportId,
  pageId,
  locale,
  initialMarkdown,
  initialJsonText,
}: {
  reportId: string;
  pageId: string;
  locale: "en" | "id" | "ja";
  initialMarkdown: string;
  initialJsonText: string;
}) {
  const [markdownValue, setMarkdownValue] = useState(initialMarkdown);
  const [jsonValue, setJsonValue] = useState(initialJsonText);
  const [savedMarkdown, setSavedMarkdown] = useState(initialMarkdown);
  const [savedJson, setSavedJson] = useState(initialJsonText);
  const [savingMarkdown, setSavingMarkdown] = useState(false);
  const [savingJson, setSavingJson] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: SaveTone; message: string } | null>(null);
  const [markdownEditMode, setMarkdownEditMode] = useState(false);

  useEffect(() => {
    setMarkdownValue(initialMarkdown);
    setJsonValue(initialJsonText);
    setSavedMarkdown(initialMarkdown);
    setSavedJson(initialJsonText);
    setMarkdownEditMode(false);
    setFeedback(null);
    setSavingMarkdown(false);
    setSavingJson(false);
  }, [initialJsonText, initialMarkdown, locale, pageId]);

  const markdownPreviewHtml = useMemo(() => {
    const rendered = marked.parse(markdownValue || "", { gfm: true, breaks: true }) as string;
    return buildMarkdownViewerHtml(
      rendered || '<p style="color:#64748b;font-size:14px;">No markdown content for this locale/page.</p>',
    );
  }, [markdownValue]);

  const jsonState = useMemo(() => {
    const text = jsonValue.trim();
    if (!text) {
      return { formatted: "", error: null as string | null };
    }

    try {
      const parsed = JSON.parse(text);
      return {
        formatted: JSON.stringify(parsed, null, 2),
        error: null as string | null,
      };
    } catch (error) {
      return {
        formatted: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [jsonValue]);

  const markdownDirty = markdownValue !== savedMarkdown;
  const jsonDirty = jsonValue !== savedJson;

  async function saveChanges(payload: { markdown?: string; jsonContent?: string }, type: "markdown" | "json") {
    if (type === "json" && jsonState.error) {
      setFeedback({ tone: "critical", message: `Fix JSON syntax before saving: ${jsonState.error}` });
      return;
    }

    setFeedback(null);
    if (type === "markdown") setSavingMarkdown(true);
    if (type === "json") setSavingJson(true);

    try {
      const response = await fetch("/api/admin/report-markdown-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          pageId,
          locale,
          ...payload,
        }),
      });

      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setFeedback({ tone: "critical", message: body?.error ?? "Failed to save changes." });
        return;
      }

      if (type === "markdown") setSavedMarkdown(markdownValue);
      if (type === "json") setSavedJson(jsonValue);
      setFeedback({
        tone: "success",
        message: `${type === "markdown" ? "Markdown" : "JSON"} saved for ${locale.toUpperCase()}.`,
      });
    } finally {
      if (type === "markdown") setSavingMarkdown(false);
      if (type === "json") setSavingJson(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.25rem] border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
        Locale workspace: <span className="font-semibold uppercase text-foreground">{locale}</span>. The markdown editor writes to the locale-specific raw markdown column, and the JSON editor writes to the matching locale content column.
      </div>

      {feedback ? <StatusBanner tone={feedback.tone}>{feedback.message}</StatusBanner> : null}

      <section className="space-y-3 rounded-[1.4rem] border border-border/70 bg-card p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Markdown Preview
            </p>
            <p className="text-sm text-muted-foreground">
              {markdownEditMode
                ? "Edit the locale markdown directly. Switch back to preview when done."
                : "Preview the current locale markdown. Use edit mode only when you need to change it."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={markdownEditMode ? "secondary" : "outline"}
              onClick={() => setMarkdownEditMode((current) => !current)}
            >
              {markdownEditMode ? "Back To Preview" : "Edit Markdown"}
            </Button>
            {markdownEditMode ? (
              <Button
                type="button"
                size="sm"
                disabled={!markdownDirty || savingMarkdown}
                onClick={() => saveChanges({ markdown: markdownValue }, "markdown")}
              >
                {savingMarkdown ? "Saving..." : "Save Markdown"}
              </Button>
            ) : null}
          </div>
        </div>

        {markdownEditMode ? (
          <textarea
            value={markdownValue}
            onChange={(event) => setMarkdownValue(event.target.value)}
            className="min-h-[520px] w-full rounded-[1rem] border border-border bg-background px-4 py-3 font-mono text-sm leading-6 text-foreground shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            spellCheck={false}
          />
        ) : (
          <iframe
            title={`markdown-live-preview-${pageId}-${locale}`}
            srcDoc={markdownPreviewHtml}
            className="h-[520px] w-full rounded-[1rem] border border-border/70 bg-white"
          />
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="space-y-3 rounded-[1.4rem] border border-border/70 bg-card p-4 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                JSON Editor
              </p>
              <p className="text-sm text-muted-foreground">
                Edit the locale JSON payload from the matching content column.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={!jsonState.formatted}
                onClick={() => {
                  if (jsonState.formatted) setJsonValue(jsonState.formatted);
                }}
              >
                Format JSON
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!jsonDirty || savingJson}
                onClick={() => saveChanges({ jsonContent: jsonValue }, "json")}
              >
                {savingJson ? "Saving..." : "Save JSON"}
              </Button>
            </div>
          </div>
          <textarea
            value={jsonValue}
            onChange={(event) => setJsonValue(event.target.value)}
            className="min-h-[420px] w-full rounded-[1rem] border border-border bg-background px-4 py-3 font-mono text-sm leading-6 text-foreground shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            spellCheck={false}
          />
          {jsonState.error ? (
            <p className="text-sm text-critical">JSON error: {jsonState.error}</p>
          ) : null}
        </section>

        <section className="space-y-3 rounded-[1.4rem] border border-border/70 bg-card p-4 shadow-soft">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              JSON Preview
            </p>
            <p className="text-sm text-muted-foreground">
              Pretty-printed preview of the current locale JSON.
            </p>
          </div>
          <pre className="min-h-[420px] overflow-auto rounded-[1rem] border border-border/70 bg-slate-950 p-4 text-xs leading-6 text-slate-100 shadow-inner">
            {jsonState.formatted ?? "Invalid JSON"}
          </pre>
        </section>
      </div>
    </div>
  );
}
