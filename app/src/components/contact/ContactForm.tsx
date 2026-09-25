"use client";

import { useState } from "react";

const serviceOptions = [
  "Web Development",
  "AI Solutions",
  "Software Development",
  "Digital Presence",
  "Training",
  "Corporate Training",
  "Consulting",
  "Maintenance",
  "Design",
  "Other",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setMessage("Thank you. Your enquiry has been received. Our team will get back to you.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.05)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input name="name" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" name="email" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input name="phone" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Company
          <input name="company" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white" />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Service
          <select name="service" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white">
            <option value="">Select a service</option>
            {serviceOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Budget Range (optional)
          <input name="budget" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white" />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Message
        <textarea name="message" required rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-blue focus:bg-white" />
      </label>

      {message ? (
        <div
          className={status === "success" ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"}
        >
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Tell Us About Your Project"}
      </button>
    </form>
  );
}
