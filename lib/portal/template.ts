type Primitive = string | number | boolean | null | undefined;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tokenizePath(path: string): string[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function getByPath(input: unknown, path: string): unknown {
  if (!path) return input;
  const tokens = tokenizePath(path);
  let current: unknown = input;

  for (const token of tokens) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      const index = Number(token);
      if (!Number.isInteger(index)) return undefined;
      current = current[index];
      continue;
    }
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[token];
  }

  return current;
}

function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function toPrettyJson(value: unknown): string {
  return JSON.stringify(value ?? null, null, 2);
}

function renderExpression(content: unknown, expression: string, raw: boolean): string {
  const expr = expression.trim();
  const isJsonExpr = expr.startsWith("json:");
  const path = isJsonExpr ? expr.slice("json:".length).trim() : expr;
  const resolved = getByPath(content, path);

  const value = isJsonExpr ? toPrettyJson(resolved) : toStringValue(resolved as Primitive);
  return raw ? value : escapeHtml(value);
}

/**
 * Supported placeholders:
 * - {{ path.to.value }}: escaped scalar/string value
 * - {{{ path.to.value }}}: raw value (use only for trusted HTML)
 * - {{ json:path.to.node }}: escaped pretty JSON for debugging/render stubs
 */
export function renderTemplate(htmlTemplate: string, content: unknown): string {
  return htmlTemplate
    .replace(/{{{\s*([^{}]+)\s*}}}/g, (_, expression: string) =>
      renderExpression(content, expression, true),
    )
    .replace(/{{\s*([^{}]+)\s*}}/g, (_, expression: string) =>
      renderExpression(content, expression, false),
    );
}
