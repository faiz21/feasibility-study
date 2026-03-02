import React from "react";
import { MarkdownReportRenderer } from "@/components/report/parser/markdown-renderer";
import fs from "fs/promises";
import path from "path";

export default async function TestMarkdownPage() {
    // Read the markdown file from the file system
    const filePath = path.join(process.cwd(), "templates/report_template/template/Automation_Assessment_Report.md");
    let markdown = "";

    try {
        markdown = await fs.readFile(filePath, "utf-8");
    } catch (error) {
        return <div>Failed to load markdown template.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <header className="bg-white border-b border-border/40 p-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Parser Tryout (Markdown)</h1>
                <div className="text-sm font-medium px-3 py-1 rounded bg-teal-100 text-teal-800">
                    Grid & Card Experimental Renderer
                </div>
            </header>

            {/* The Markdown Renderer takes the raw Markdown string and maps it dynamically */}
            <main>
                <MarkdownReportRenderer markdown={markdown} />
            </main>
        </div>
    );
}
