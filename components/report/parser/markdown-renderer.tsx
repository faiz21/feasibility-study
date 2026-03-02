"use client";

import React, { useMemo } from "react";
import { marked, Token, Tokens } from "marked";
import { NarrativeBlock } from "../text/narrative-block";
import { Paragraph } from "../text/paragraph";
import { HighlightList } from "../list/highlight-list";
import { ReportCover } from "../cover/report-cover";
import { BoxWithIconCard } from "../card/box-with-icon-card";
import { Table } from "../table/table";

export function MarkdownReportRenderer({ markdown }: { markdown: string }) {
    const tokens = useMemo(() => marked.lexer(markdown), [markdown]);

    const components = useMemo(() => {
        const rendered: React.ReactNode[] = [];
        let i = 0;

        // Helper to safely get markdown from a token
        const extractText = (token: Token) => {
            if ('text' in token) return token.text;
            if ('raw' in token) return token.raw;
            return "";
        };

        // 1. Peek at the beginning to see if we can build a Cover Page before the first HR
        let coverTitle = "";
        let coverSubtitle = "";
        const coverMetadata: Record<string, string> = {};
        let firstHrIndex = -1;

        for (let j = 0; j < Math.min(tokens.length, 10); j++) {
            if (tokens[j].type === "hr") {
                firstHrIndex = j;
                break;
            }
        }

        if (firstHrIndex > 0) {
            // Build cover
            const preHrTokens = tokens.slice(0, firstHrIndex);
            preHrTokens.forEach((ct, idx) => {
                if (ct.type === "paragraph" || ct.type === "heading") {
                    const text = extractText(ct);
                    if (idx === 0) coverTitle = text;
                    else if (idx === 1) coverSubtitle = text;
                    else {
                        // Check for key: value
                        const parts = text.split(":");
                        if (parts.length > 1) {
                            coverMetadata[parts[0].trim()] = parts.slice(1).join(":").trim();
                        }
                    }
                }
            });

            rendered.push(
                <div key="cover" className="col-span-12 mb-12">
                    <ReportCover
                        title={coverTitle}
                        subtitle={coverSubtitle}
                        yearLabel={coverMetadata["Document date"]?.split(" ").pop() || new Date().getFullYear().toString()}
                    />
                </div>
            );
            i = firstHrIndex + 1; // Skip the parsed cover elements
        }

        // 2. Main Rendering Loop
        while (i < tokens.length) {
            const token = tokens[i];

            if (token.type === "heading") {
                const heading = token as Tokens.Heading;
                if (heading.depth === 1) {
                    rendered.push(
                        <div key={`h1-${i}`} className="col-span-12 mt-16 mb-8">
                            <NarrativeBlock size="lg" title={`Section`} content={heading.text} gridSpan={{ base: 12 }} />
                        </div>
                    );
                } else if (heading.depth === 2) {
                    rendered.push(
                        <div key={`h2-${i}`} className="col-span-12 md:col-span-8 md:col-start-3 mt-12 mb-6">
                            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{heading.text}</h2>
                        </div>
                    );
                } else if (heading.depth === 3) {
                    // GROUPING LOGIC FOR H3 -> CARDS
                    const cardGroup: { title: string; content: string }[] = [];

                    while (i < tokens.length && tokens[i].type === "heading" && (tokens[i] as Tokens.Heading).depth === 3) {
                        const cardTitle = (tokens[i] as Tokens.Heading).text;
                        let cardContent = "";
                        let j = i + 1;

                        // Consume paragraphs/lists under this H3 until the next heading
                        while (j < tokens.length && tokens[j].type !== "heading") {
                            if (tokens[j].type !== "hr" && tokens[j].type !== "space") {
                                cardContent += "\n\n" + (tokens[j] as any).raw;
                            }
                            j++;
                        }
                        cardGroup.push({ title: cardTitle, content: cardContent.trim() });
                        i = j; // Move outer pointer
                    }

                    rendered.push(
                        <div key={`h3-group-${i}`} className="col-span-12 my-10">
                            <BoxWithIconCard
                                title="Detailed Findings"
                                items={cardGroup.map(card => ({
                                    title: card.title,
                                    description: card.content
                                }))}
                            />
                        </div>
                    );
                    continue; // skip the i++ at the end of the loop since we already advanced i
                }
            }
            else if (token.type === "paragraph") {
                rendered.push(
                    <div key={`p-${i}`} className="col-span-12 md:col-span-8 md:col-start-3 mb-6">
                        <Paragraph content={(token as Tokens.Paragraph).raw} />
                    </div>
                );
            }
            else if (token.type === "list") {
                const list = token as Tokens.List;
                const items = list.items.map(item => item.text);
                rendered.push(
                    <div key={`list-${i}`} className="col-span-12 md:col-span-8 md:col-start-3 mb-8">
                        <HighlightList items={items} />
                    </div>
                );
            }
            else if (token.type === "table") {
                const table = token as Tokens.Table;
                const headers = table.header.map(cell => cell.text);
                const rows = table.rows.map(row => row.map(cell => cell.text));

                rendered.push(
                    <div key={`table-${i}`} className="col-span-12 my-10">
                        <Table headers={headers} rows={rows} />
                    </div>
                );
            }

            i++;
        }

        return rendered;
    }, [tokens]);

    return (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-8">
            {components}
        </div>
    );
}
