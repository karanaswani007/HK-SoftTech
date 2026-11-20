export type Cell = string | number | boolean | null;
export type Row = { [key: string]: Cell };

export function plain(row: Record<string, unknown>): Row {
  const out: Row = {};
  for (const [key, value] of Object.entries(row)) {
    if (value instanceof Date) out[key] = value.toISOString();
    else if (typeof value === "bigint") out[key] = Number(value);
    else if (value == null) out[key] = null;
    else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") out[key] = value;
    else out[key] = String(value);
  }
  return out;
}

export function plains(rows: Record<string, unknown>[]): Row[] {
  return rows.map((row) => plain(row));
}

export function errText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return "Something went wrong. Please try again.";
}

export function linesOf(value: string): string[] {
  return value
    .split(/\r?\n|\\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function clean(value: string): string {
  return value.split("\0").join("").trim();
}
