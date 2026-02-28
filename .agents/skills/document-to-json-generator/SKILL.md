---
name: document-to-json-generator
description: Generate multilingual JSON output files from input documents using a selected reference template. Use when the user asks to convert text/documents into structured JSON, to follow an existing JSON schema/template, to translate content into English/Indonesian/Japanese, or to produce machine-readable output from reports, notes, or briefs.
---

# Document To JSON Generator

## Overview

Convert an input document into a `.json` file that follows a user-selected JSON template.
Always ask for the template first, then infer mapping rules from the template structure before generating output.

## Workflow

Follow these steps in order.

### Step 1: Ask for the Template Reference

Ask which template reference the user wants to use before generating JSON.

Collect:
- Template file path (or template name if several exist)
- Input document path
- Output JSON path (default to same folder as input if omitted)

If the template is ambiguous or missing, stop and ask for clarification.

### Step 2: Read the JSON Template Format

Read and inspect the template JSON file to identify:
- Required keys and nested object shapes
- Array structures
- Expected data types (`string`, `number`, `boolean`, `object`, `array`, `null`)
- Required vs optional fields (if encoded by the template or companion rules)

Use [template-format-checklist.md](references/template-format-checklist.md) as the mapping checklist.

### Step 3: Translate Content Into 3 Languages

Before generating JSON, translate relevant document content into:
- English (`en`)
- Indonesian (`id`)
- Japanese (`ja`)

Translation rules:
- Preserve original meaning and tone.
- Keep entities, numbers, product names, and proper nouns consistent.
- Do not invent missing facts; keep unknown content explicit.
- If a phrase should remain untranslated (for example, brand or legal terms), preserve it and note it.

### Step 4: Process Document and Generate JSON

Extract information from the input document and translated variants, then map to the template fields.

Rules:
- Preserve template structure exactly unless the user asks to extend it.
- Keep field names identical to the template.
- Store multilingual text in template-compatible structure (for example language keys like `en`, `id`, `ja` when supported).
- Write valid JSON only (no comments, no trailing commas).
- Fill unknown values with `null` or template defaults when appropriate, then note assumptions.
- Validate the generated JSON before finalizing.

Save the result as a `.json` file at the requested output path.

## Output Contract

When completing a task with this skill, return:
- Template used
- Input document used
- Output file path
- Confirmation that English, Indonesian, and Japanese variants were included
- Brief note of any assumptions or missing values

## Example Trigger Phrases

- "Convert this report into JSON using template A."
- "Use this JSON format as reference and generate output from my document."
- "Map this document to our schema and produce a .json file."
