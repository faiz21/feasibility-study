import fs from "node:fs";
import path from "node:path";

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function fail(message) {
  console.error(`[skill-validate] ${message}`);
  process.exitCode = 1;
}

function parseFrontmatter(skillMd) {
  const text = String(skillMd);
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const yaml = text.slice(4, end).trim();
  const body = text.slice(end + "\n---\n".length);
  const obj = {};
  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    obj[key] = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
  return { frontmatter: obj, body };
}

function main() {
  const skillDir = process.argv[2] ?? ".";
  const abs = path.resolve(process.cwd(), skillDir);

  const skillMdPath = path.join(abs, "SKILL.md");
  const agentsYamlPath = path.join(abs, "agents", "openai.yaml");

  if (!fs.existsSync(skillMdPath)) fail(`Missing SKILL.md at ${skillMdPath}`);
  if (!fs.existsSync(agentsYamlPath)) fail(`Missing agents/openai.yaml at ${agentsYamlPath}`);

  const parsed = parseFrontmatter(readText(skillMdPath));
  if (!parsed) fail("SKILL.md is missing YAML frontmatter fenced by ---");
  const name = parsed?.frontmatter?.name ?? "";
  const desc = parsed?.frontmatter?.description ?? "";
  if (!name) fail("SKILL.md frontmatter missing `name`");
  if (!desc) fail("SKILL.md frontmatter missing `description`");

  const scriptsDir = path.join(abs, "scripts");
  const requiredScripts = [
    "extract-evidence-pack.mjs",
    "validate-enriched-outputs.mjs",
    "assemble-report-md.mjs",
  ];
  for (const s of requiredScripts) {
    const p = path.join(scriptsDir, s);
    if (!fs.existsSync(p)) fail(`Missing script: ${p}`);
  }

  if (!process.exitCode) {
    console.log("[skill-validate] OK");
  }
}

main();

