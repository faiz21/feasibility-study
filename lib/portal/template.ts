function flatten(input: unknown, prefix = "", out: Record<string, string> = {}) {
  if (input === null || input === undefined) return out;
  if (typeof input !== "object") {
    if (prefix) out[prefix] = String(input);
    return out;
  }

  if (Array.isArray(input)) {
    input.forEach((value, index) => {
      flatten(value, prefix ? `${prefix}.${index}` : String(index), out);
    });
    return out;
  }

  Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    flatten(value, next, out);
  });

  return out;
}

export function renderTemplate(htmlTemplate: string, content: unknown): string {
  const values = flatten(content);
  return htmlTemplate.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_, key: string) => {
    return values[key] ?? "";
  });
}
