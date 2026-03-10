export type ContractValidationResult = {
  ok: boolean;
  error?: string;
};

function valueType(input: unknown): string {
  if (input === null) return "null";
  if (Array.isArray(input)) return "array";
  return typeof input;
}

function isPlainObject(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === "object" && !Array.isArray(input);
}

function compareShape(reference: unknown, candidate: unknown, path: string): string | null {
  const currentPath = path || "root";

  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) {
      return `${currentPath}: expected array, got ${valueType(candidate)}`;
    }

    if (reference.length === 0 || candidate.length === 0) {
      return null;
    }

    const sample = reference[0];
    for (let i = 0; i < candidate.length; i += 1) {
      const mismatch = compareShape(sample, candidate[i], `${currentPath}[${i}]`);
      if (mismatch) return mismatch;
    }
    return null;
  }

  if (isPlainObject(reference)) {
    if (!isPlainObject(candidate)) {
      return `${currentPath}: expected object, got ${valueType(candidate)}`;
    }

    for (const key of Object.keys(reference)) {
      if (!(key in candidate)) {
        return `missing ${currentPath === "root" ? key : `${currentPath}.${key}`}`;
      }
      const mismatch = compareShape(
        reference[key],
        (candidate as Record<string, unknown>)[key],
        currentPath === "root" ? key : `${currentPath}.${key}`,
      );
      if (mismatch) return mismatch;
    }
    return null;
  }

  const expected = valueType(reference);
  const actual = valueType(candidate);
  if (expected !== actual) {
    return `${currentPath}: expected ${expected}, got ${actual}`;
  }
  return null;
}

export function validateJsonAgainstReference(
  reference: unknown,
  candidate: unknown,
): ContractValidationResult {
  const mismatch = compareShape(reference, candidate, "");
  if (mismatch) {
    return { ok: false, error: mismatch };
  }
  return { ok: true };
}

export function hasReferenceContract(input: unknown): boolean {
  return isPlainObject(input) || Array.isArray(input);
}
