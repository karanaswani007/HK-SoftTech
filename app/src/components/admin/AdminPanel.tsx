"use client";

import { useState } from "react";
import Link from "next/link";

import type { AdminContent, CmsSettings } from "@/lib/cms";

const settingGroups: { title: string; fields: { key: keyof CmsSettings; label: string; multiline?: boolean }[] }[] = [
  {
    title: "Contact & social",
    fields: [
      { key: "tagline", label: "Company tagline" },
      { key: "email", label: "Contact email" },
      { key: "phone", label: "Phone" },
      { key: "location", label: "Location" },
      { key: "linkedin", label: "LinkedIn URL" },
      { key: "instagram", label: "Instagram URL" },
    ],
  },
  {
    title: "Home page — hero",
    fields: [
      { key: "heroBadge", label: "Badge" },
      { key: "heroTitlePrefix", label: "Heading (before highlight)" },
      { key: "heroTitleHighlight", label: "Highlighted heading" },
      { key: "heroTitleSuffix", label: "Heading (after highlight)" },
      { key: "heroDescription", label: "Description", multiline: true },
      { key: "heroPrimaryCta", label: "Primary button" },
      { key: "heroSecondaryCta", label: "Secondary button" },
    ],
  },
  {
    title: "Home page — company",
    fields: [
      { key: "companyHeading", label: "Heading" },
      { key: "companyDescription", label: "Description", multiline: true },
    ],
  },
  {
    title: "Home page — services",
    fields: [
      { key: "servicesEyebrow", label: "Eyebrow" },
      { key: "servicesTitle", label: "Heading" },
      { key: "servicesDescription", label: "Description", multiline: true },
    ],
  },
  {
    title: "Home page — FAQs",
    fields: [
      { key: "faqEyebrow", label: "Eyebrow" },
      { key: "faqTitle", label: "Heading" },
      { key: "faqDescription", label: "Description", multiline: true },
    ],
  },
  {
    title: "Home page — call to action",
    fields: [
      { key: "ctaEyebrow", label: "Eyebrow" },
      { key: "ctaTitle", label: "Heading" },
      { key: "ctaPrimaryLabel", label: "Primary button" },
      { key: "ctaSecondaryLabel", label: "Secondary button" },
    ],
  },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";
const serviceLabels = [
  ["title", "Service name"],
  ["category", "Category"],
  ["short", "Card description"],
  ["description", "Service page introduction"],
  ["pageCta", "Service page button"],
] as const;

export function AdminPanel({ initialContent }: { initialContent: AdminContent }) {
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  function updateSettings(key: keyof CmsSettings, value: string) {
    setContent((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  }

  async function saveContent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to save website content.");
      }
      setMessage("Changes saved and are live on the website.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save website content.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        setError("Unable to sign out. Please try again.");
        return;
      }
      setLoggedOut(true);
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  if (loggedOut) {
    return <LoginForm />;
  }

  return (
    <form onSubmit={saveContent} className="space-y-6">
      <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">HK SoftTech CMS</p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy">Website content</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-brand-blue">View website</Link>
          <button type="button" onClick={logout} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue">Sign out</button>
          <button type="submit" disabled={saving} className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {message ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {settingGroups.map((group) => (
        <section key={group.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-brand-navy">{group.title}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <label key={field.key} className={`block text-sm font-medium text-slate-700 ${field.multiline ? "sm:col-span-2" : ""}`}>
                {field.label}
                {field.multiline ? (
                  <textarea className={inputClass} rows={3} value={content.settings[field.key]} onChange={(event) => updateSettings(field.key, event.target.value)} />
                ) : (
                  <input className={inputClass} value={content.settings[field.key]} onChange={(event) => updateSettings(field.key, event.target.value)} />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Services</h2>
          <p className="mt-1 text-sm text-slate-600">Edit the existing service cards and detail pages. Website URLs stay the same.</p>
        </div>
        {content.services.map((service, serviceIndex) => (
          <details key={service.slug} className="group rounded-2xl border border-slate-200 bg-white shadow-sm" open={serviceIndex === 0}>
            <summary className="cursor-pointer list-none px-5 py-4 text-base font-semibold text-brand-navy marker:hidden">
              {service.title}<span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2">
              {serviceLabels.map(([key, label]) => (
                <label key={key} className={`block text-sm font-medium text-slate-700 ${key === "description" || key === "short" ? "sm:col-span-2" : ""}`}>
                  {label}
                  {key === "description" || key === "short" ? (
                    <textarea className={inputClass} rows={key === "description" ? 3 : 2} value={service[key]} onChange={(event) => {
                      const services = [...content.services];
                      services[serviceIndex] = { ...service, [key]: event.target.value };
                      setContent({ ...content, services });
                    }} />
                  ) : (
                    <input className={inputClass} value={service[key]} onChange={(event) => {
                      const services = [...content.services];
                      services[serviceIndex] = { ...service, [key]: event.target.value };
                      setContent({ ...content, services });
                    }} />
                  )}
                </label>
              ))}
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Service card bullet points <span className="font-normal text-slate-500">(one per line)</span>
                <textarea className={inputClass} rows={4} value={service.keyServices.join("\n")} onChange={(event) => {
                  const services = [...content.services];
                  services[serviceIndex] = { ...service, keyServices: event.target.value.split("\n").filter((item) => item.trim()) };
                  setContent({ ...content, services });
                }} />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Service page bullet points <span className="font-normal text-slate-500">(one per line)</span>
                <textarea className={inputClass} rows={5} value={service.pagePoints.join("\n")} onChange={(event) => {
                  const services = [...content.services];
                  services[serviceIndex] = { ...service, pagePoints: event.target.value.split("\n").filter((item) => item.trim()) };
                  setContent({ ...content, services });
                }} />
              </label>
            </div>
          </details>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Frequently asked questions</h2>
            <p className="mt-1 text-sm text-slate-600">Add, edit, remove, or reorder questions.</p>
          </div>
          <button type="button" onClick={() => setContent({ ...content, faqs: [...content.faqs, { question: "", answer: "" }] })} className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-light">Add FAQ</button>
        </div>
        <div className="mt-5 space-y-4">
          {content.faqs.map((faq, faqIndex) => (
            <div key={faqIndex} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="block flex-1 text-sm font-medium text-slate-700">
                  Question
                  <input className={inputClass} value={faq.question} onChange={(event) => {
                    const faqs = [...content.faqs];
                    faqs[faqIndex] = { ...faq, question: event.target.value };
                    setContent({ ...content, faqs });
                  }} />
                </label>
                <button type="button" onClick={() => setContent({ ...content, faqs: content.faqs.filter((_, index) => index !== faqIndex) })} aria-label={`Remove FAQ ${faqIndex + 1}`} className="mt-6 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
              </div>
              <label className="mt-3 block text-sm font-medium text-slate-700">
                Answer
                <textarea className={inputClass} rows={3} value={faq.answer} onChange={(event) => {
                  const faqs = [...content.faqs];
                  faqs[faqIndex] = { ...faq, answer: event.target.value };
                  setContent({ ...content, faqs });
                }} />
              </label>
              <div className="mt-3 flex gap-2">
                <button type="button" disabled={faqIndex === 0} onClick={() => {
                  const faqs = [...content.faqs];
                  [faqs[faqIndex - 1], faqs[faqIndex]] = [faqs[faqIndex], faqs[faqIndex - 1]];
                  setContent({ ...content, faqs });
                }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40">Move up</button>
                <button type="button" disabled={faqIndex === content.faqs.length - 1} onClick={() => {
                  const faqs = [...content.faqs];
                  [faqs[faqIndex + 1], faqs[faqIndex]] = [faqs[faqIndex], faqs[faqIndex + 1]];
                  setContent({ ...content, faqs });
                }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40">Move down</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to sign in.");
      }
      window.location.reload();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-md items-center px-4 py-16">
      <form onSubmit={login} className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">HK SoftTech</p>
        <h1 className="mt-3 text-2xl font-bold text-brand-navy">Admin sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter your administrator password to edit website content.</p>
        <label className="mt-6 block text-sm font-medium text-slate-700">
          Admin password
          <input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
        </label>
        {error ? <p role="alert" className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-60">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
