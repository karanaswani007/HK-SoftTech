"use client";

import { useState } from "react";
import Link from "next/link";

import { maxPortfolioImageDataLength } from "@/lib/cms-constants";
import type { AdminContent, CmsService, CmsSettings } from "@/lib/cms";

type AdminPage = "home" | "services" | "portfolio" | "faqs" | "contact";

const adminPages: { id: AdminPage; label: string; description: string }[] = [
  { id: "home", label: "Home page", description: "Homepage sections, calls to action, and featured content." },
  { id: "services", label: "Services", description: "Services overview page and individual service pages." },
  { id: "portfolio", label: "Portfolio", description: "Portfolio page introduction and project cards." },
  { id: "faqs", label: "FAQs", description: "FAQ page introduction and questions shown across the site." },
  { id: "contact", label: "Contact & social", description: "Contact details and social profile links." },
];

const settingGroups: { page: AdminPage; title: string; fields: { key: Exclude<keyof CmsSettings, "socials">; label: string; multiline?: boolean }[] }[] = [
  {
    page: "contact",
    title: "Contact details",
    fields: [
      { key: "tagline", label: "Company tagline" },
      { key: "email", label: "Contact email" },
      { key: "phone", label: "Phone" },
      { key: "location", label: "Location" },
      { key: "contactPageEyebrow", label: "Contact page eyebrow" },
      { key: "contactPageTitle", label: "Contact page heading" },
      { key: "contactPageDescription", label: "Contact page description", multiline: true },
    ],
  },
  {
    page: "home",
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
    page: "home",
    title: "Home page — company",
    fields: [
      { key: "companyHeading", label: "Heading" },
      { key: "companyDescription", label: "Description", multiline: true },
    ],
  },
  {
    page: "home",
    title: "Home page — services",
    fields: [
      { key: "servicesEyebrow", label: "Eyebrow" },
      { key: "servicesTitle", label: "Heading" },
      { key: "servicesDescription", label: "Description", multiline: true },
    ],
  },
  {
    page: "faqs",
    title: "Home page — FAQs",
    fields: [
      { key: "faqEyebrow", label: "Eyebrow" },
      { key: "faqTitle", label: "Heading" },
      { key: "faqDescription", label: "Description", multiline: true },
    ],
  },
  {
    page: "home",
    title: "Home page — call to action",
    fields: [
      { key: "ctaEyebrow", label: "Eyebrow" },
      { key: "ctaTitle", label: "Heading" },
      { key: "ctaPrimaryLabel", label: "Primary button" },
      { key: "ctaSecondaryLabel", label: "Secondary button" },
    ],
  },
  {
    page: "services",
    title: "Services page introduction",
    fields: [
      { key: "servicesPageEyebrow", label: "Eyebrow" },
      { key: "servicesPageTitle", label: "Heading" },
      { key: "servicesPageDescription", label: "Description", multiline: true },
    ],
  },
  {
    page: "portfolio",
    title: "Portfolio page introduction",
    fields: [
      { key: "portfolioPageEyebrow", label: "Eyebrow" },
      { key: "portfolioPageTitle", label: "Heading" },
      { key: "portfolioPageDescription", label: "Description", multiline: true },
    ],
  },
  {
    page: "faqs",
    title: "FAQ page introduction",
    fields: [
      { key: "faqEyebrow", label: "Eyebrow" },
      { key: "faqTitle", label: "Heading" },
      { key: "faqDescription", label: "Description", multiline: true },
    ],
  },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";
const serviceLabels = [
  ["slug", "Page URL slug"],
  ["title", "Service name"],
  ["category", "Category"],
  ["short", "Card description"],
  ["description", "Service page introduction"],
  ["pageCta", "Service page button"],
] as const;

const emptyService: CmsService = {
  slug: "",
  title: "",
  short: "",
  description: "",
  category: "",
  keyServices: [],
  pagePoints: [],
  pageCta: "Contact us",
};

const maxImageBytes = 2 * 1024 * 1024;
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function readImageFile(file: File): Promise<string> {
  if (!acceptedImageTypes.includes(file.type)) {
    return Promise.reject(new Error("Choose a JPG, PNG, WebP, or GIF image."));
  }
  if (file.size > maxImageBytes) {
    return Promise.reject(new Error("Each image must be 2 MB or smaller."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read the selected image."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export function AdminPanel({ initialContent }: { initialContent: AdminContent }) {
  const [content, setContent] = useState(initialContent);
  const [activePage, setActivePage] = useState<AdminPage>("home");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  function updateSettings(key: Exclude<keyof CmsSettings, "socials">, value: string) {
    setContent((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  }

  function updateService(index: number, changes: Partial<CmsService>) {
    setContent((current) => ({
      ...current,
      services: current.services.map((service, itemIndex) =>
        itemIndex === index ? { ...service, ...changes } : service,
      ),
    }));
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

      <nav aria-label="Content categories" className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 sm:grid-cols-2 lg:grid-cols-5">
        {adminPages.map((page) => (
          <button
            key={page.id}
            type="button"
            aria-pressed={activePage === page.id}
            onClick={() => setActivePage(page.id)}
            className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              activePage === page.id ? "bg-brand-blue text-white" : "text-slate-600 hover:bg-brand-light hover:text-brand-blue"
            }`}
          >
            {page.label}
          </button>
        ))}
      </nav>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
        <h2 className="font-bold text-brand-navy">{adminPages.find((page) => page.id === activePage)?.label}</h2>
        <p className="mt-1 text-sm text-slate-600">{adminPages.find((page) => page.id === activePage)?.description}</p>
      </div>

      {settingGroups.filter((group) => group.page === activePage).map((group) => (
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

      {activePage === "contact" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">Social profiles</h2>
              <p className="mt-1 text-sm text-slate-600">Add as many social links as needed; remove any you no longer use.</p>
            </div>
            <button
              type="button"
              disabled={content.settings.socials.length >= 20}
              onClick={() => setContent((current) => ({
                ...current,
                settings: { ...current.settings, socials: [...current.settings.socials, { label: "", url: "" }] },
              }))}
              className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add social
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {content.settings.socials.map((social, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr_auto]">
                <label className="block text-sm font-medium text-slate-700">
                  Platform name
                  <input className={inputClass} value={social.label} onChange={(event) => {
                    const socials = [...content.settings.socials];
                    socials[index] = { ...social, label: event.target.value };
                    setContent({ ...content, settings: { ...content.settings, socials } });
                  }} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Profile URL
                  <input type="url" className={inputClass} value={social.url} onChange={(event) => {
                    const socials = [...content.settings.socials];
                    socials[index] = { ...social, url: event.target.value };
                    setContent({ ...content, settings: { ...content.settings, socials } });
                  }} />
                </label>
                <button type="button" onClick={() => setContent({
                  ...content,
                  settings: { ...content.settings, socials: content.settings.socials.filter((_, itemIndex) => itemIndex !== index) },
                })} className="self-end rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Remove
                </button>
              </div>
            ))}
            {content.settings.socials.length === 0 ? <p className="text-sm text-slate-500">No social profiles added.</p> : null}
          </div>
        </section>
      ) : null}

      {activePage === "services" ? <section className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Service pages</h2>
              <p className="mt-1 text-sm text-slate-600">Add, edit, remove, or reorder service cards and their detail-page content.</p>
            </div>
            <button type="button" disabled={content.services.length >= 30} onClick={() => setContent((current) => ({ ...current, services: [...current.services, { ...emptyService }] }))} className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40">
              Add service
            </button>
          </div>
        </div>
        {content.services.map((service, serviceIndex) => (
          <details key={`${service.slug}-${serviceIndex}`} className="group rounded-2xl border border-slate-200 bg-white shadow-sm" open={serviceIndex === 0 || serviceIndex === content.services.length - 1}>
            <summary className="cursor-pointer list-none px-5 py-4 text-base font-semibold text-brand-navy marker:hidden">
              {service.title || `New service ${serviceIndex + 1}`}<span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2">
              {serviceLabels.map(([key, label]) => (
                <label key={key} className={`block text-sm font-medium text-slate-700 ${key === "description" || key === "short" ? "sm:col-span-2" : ""}`}>
                  {label}
                  {key === "description" || key === "short" ? (
                    <textarea className={inputClass} rows={key === "description" ? 3 : 2} value={service[key]} onChange={(event) => updateService(serviceIndex, { [key]: event.target.value })} />
                  ) : (
                    <input className={inputClass} value={service[key]} onChange={(event) => updateService(serviceIndex, { [key]: event.target.value })} />
                  )}
                </label>
              ))}
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Service card bullet points <span className="font-normal text-slate-500">(one per line)</span>
                <textarea className={inputClass} rows={4} value={service.keyServices.join("\n")} onChange={(event) => updateService(serviceIndex, { keyServices: event.target.value.split("\n").filter((item) => item.trim()) })} />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Service page bullet points <span className="font-normal text-slate-500">(one per line)</span>
                <textarea className={inputClass} rows={5} value={service.pagePoints.join("\n")} onChange={(event) => updateService(serviceIndex, { pagePoints: event.target.value.split("\n").filter((item) => item.trim()) })} />
              </label>
              <button type="button" disabled={content.services.length <= 1} onClick={() => setContent({
                ...content,
                services: content.services.filter((_, index) => index !== serviceIndex),
              })} className="justify-self-start rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
                Remove service
              </button>
            </div>
          </details>
        ))}
      </section> : null}

      {activePage === "portfolio" ? <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-brand-navy">Portfolio items</h2>
            <p className="mt-1 text-sm text-slate-600">Showcase products and projects on the public portfolio page.</p>
          </div>
          <button
            type="button"
            disabled={content.projects.length >= 100}
            onClick={() => setContent({
              ...content,
              projects: [
                ...content.projects,
                {
                  title: "",
                  description: "",
                  category: content.services[0]?.title ?? "",
                  serviceSlug: content.services[0]?.slug ?? "",
                  imageUrl: "",
                  projectUrl: "",
                  featured: false,
                  published: true,
                },
              ],
            })}
            className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add project / product
          </button>
        </div>
        {content.projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No portfolio entries yet. Add your first product or project here.
          </div>
        ) : null}
        {content.projects.map((project, projectIndex) => {
          const updateProject = (changes: Partial<typeof project>) => {
            setContent((current) => {
              const projects = [...current.projects];
              const existingProject = projects[projectIndex];
              if (!existingProject) return current;
              projects[projectIndex] = { ...existingProject, ...changes };
              return { ...current, projects };
            });
          };

          return (
            <details key={project.id ?? `new-${projectIndex}`} className="group rounded-2xl border border-slate-200 bg-white shadow-sm" open={projectIndex === 0}>
              <summary className="cursor-pointer list-none px-5 py-4 text-base font-semibold text-brand-navy marker:hidden">
                {project.title || `New portfolio item ${projectIndex + 1}`}
                <span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
              </summary>
              <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Name
                  <input className={inputClass} value={project.title} onChange={(event) => updateProject({ title: event.target.value })} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Related service
                  <select
                    required
                    className={inputClass}
                    value={project.serviceSlug}
                    onChange={(event) => {
                      const service = content.services.find((item) => item.slug === event.target.value);
                      updateProject({ serviceSlug: event.target.value, category: service?.title ?? "" });
                    }}
                  >
                    <option value="" disabled>Select a service</option>
                    {content.services.map((service) => (
                      <option key={service.slug} value={service.slug}>{service.title}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Description
                  <textarea className={inputClass} rows={3} value={project.description} onChange={(event) => updateProject({ description: event.target.value })} />
                </label>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Project image <span className="font-normal text-slate-500">(JPG, PNG, WebP or GIF; up to 2 MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-blue`}
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setError("");
                        try {
                          const imageUrl = await readImageFile(file);
                          const currentImageLength = project.imageUrl.startsWith("data:image/") ? project.imageUrl.length : 0;
                          const totalImageLength = content.projects.reduce(
                            (total, item) => total + (item.imageUrl.startsWith("data:image/") ? item.imageUrl.length : 0),
                            0,
                          );
                          if (totalImageLength - currentImageLength + imageUrl.length > maxPortfolioImageDataLength) {
                            throw new Error("All portfolio uploads together must total no more than about 2.5 MB.");
                          }
                          updateProject({ imageUrl });
                        } catch (imageError) {
                          setError(imageError instanceof Error ? imageError.message : "Unable to read the selected image.");
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {project.imageUrl ? (
                    <div className="mt-3 flex items-center gap-4">
                      <div
                        role="img"
                        aria-label={`${project.title || "Portfolio item"} image preview`}
                        className="h-24 w-40 rounded-xl border border-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url("${project.imageUrl}")` }}
                      />
                      <button type="button" onClick={() => updateProject({ imageUrl: "" })} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Remove image
                      </button>
                    </div>
                  ) : null}
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Live product / demo URL
                  <input type="url" className={inputClass} value={project.projectUrl} onChange={(event) => updateProject({ projectUrl: event.target.value })} />
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={project.featured} onChange={(event) => updateProject({ featured: event.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                  Feature this item
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={project.published} onChange={(event) => updateProject({ published: event.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                  Published on website
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <button type="button" disabled={projectIndex === 0} onClick={() => {
                    const projects = [...content.projects];
                    [projects[projectIndex - 1], projects[projectIndex]] = [projects[projectIndex], projects[projectIndex - 1]];
                    setContent({ ...content, projects });
                  }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40">Move up</button>
                  <button type="button" disabled={projectIndex === content.projects.length - 1} onClick={() => {
                    const projects = [...content.projects];
                    [projects[projectIndex + 1], projects[projectIndex]] = [projects[projectIndex], projects[projectIndex + 1]];
                    setContent({ ...content, projects });
                  }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40">Move down</button>
                  <button type="button" onClick={() => setContent({ ...content, projects: content.projects.filter((_, index) => index !== projectIndex) })} className="ml-auto rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
              </div>
            </details>
          );
        })}
      </section> : null}

      {activePage === "faqs" ? <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Frequently asked questions</h2>
            <p className="mt-1 text-sm text-slate-600">Add, edit, remove, or reorder questions.</p>
          </div>
          <button type="button" disabled={content.faqs.length >= 100} onClick={() => setContent({ ...content, faqs: [...content.faqs, { question: "", answer: "" }] })} className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40">Add FAQ</button>
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
      </section> : null}
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
