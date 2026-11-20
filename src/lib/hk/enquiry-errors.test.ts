import assert from "node:assert/strict";
import test from "node:test";
import { serverEnquiryIssues } from "./enquiry-errors.ts";

test("turns structured server validation failures into known field messages", () => {
  const details = JSON.stringify([
    {
      origin: "string",
      code: "too_small",
      minimum: 20,
      inclusive: true,
      path: ["description"],
      message: "Describe the work in at least a few sentences",
    },
  ]);

  assert.deepEqual(serverEnquiryIssues(new Error(details)), [
    { field: "description", message: "Describe the work in at least a few sentences" },
  ]);
  assert.deepEqual(serverEnquiryIssues({ message: details }), [
    { field: "description", message: "Describe the work in at least a few sentences" },
  ]);
});

test("ignores malformed and unrelated server errors instead of exposing them as fields", () => {
  assert.deepEqual(serverEnquiryIssues(new Error("database unavailable")), []);
  assert.deepEqual(
    serverEnquiryIssues(JSON.stringify([{ path: ["internal"], message: "secret detail" }])),
    [],
  );
  assert.deepEqual(serverEnquiryIssues(JSON.stringify([{ path: ["email"] }])), []);
});
