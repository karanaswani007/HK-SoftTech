const ENQUIRY_FIELDS = [
  "name",
  "email",
  "phone",
  "organization",
  "customer_type",
  "service_category",
  "budget",
  "timeline",
  "description",
  "contact_method",
  "company_website",
] as const;

export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];
export type EnquiryValidationIssue = { field: EnquiryField; message: string };

export function serverEnquiryIssues(error: unknown): EnquiryValidationIssue[] {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
          ? error.message
          : "";
  let payload: unknown;
  try {
    payload = JSON.parse(message);
  } catch {
    return [];
  }
  if (!Array.isArray(payload)) return [];

  return payload.flatMap((issue) => {
    if (typeof issue !== "object" || issue === null) return [];
    const record = issue as Record<string, unknown>;
    const path = record.path;
    if (!Array.isArray(path) || typeof path[0] !== "string" || typeof record.message !== "string") return [];
    const field = ENQUIRY_FIELDS.find((name) => name === path[0]);
    return field ? [{ field, message: record.message }] : [];
  });
}
