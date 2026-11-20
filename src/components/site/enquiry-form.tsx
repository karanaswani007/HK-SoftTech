import { useForm } from "react-hook-form";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { BUDGETS, CONTACT_METHODS, CUSTOMER_TYPES, TIMELINES } from "@/lib/hk/labels";
import { serverEnquiryIssues } from "@/lib/hk/enquiry-errors";
import { submitEnquiry } from "@/lib/hk/public-fns";

type Values = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  customer_type: (typeof CUSTOMER_TYPES)[number];
  service_category: string;
  budget: string;
  timeline: (typeof TIMELINES)[number];
  description: string;
  contact_method: (typeof CONTACT_METHODS)[number];
  company_website: string;
};

const control =
  "w-full rounded-xl border border-line bg-paper px-3 py-3 text-base text-ink transition-colors placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 aria-invalid:border-rose-500 aria-invalid:focus:ring-rose-500/10 sm:text-sm";
export function EnquiryForm({
  categories,
  initialCategory,
  whatsapp,
}: {
  categories: { slug: string; name: string }[];
  initialCategory: string;
  whatsapp: string;
}) {
  const submit = useServerFn(submitEnquiry);
  const [done, setDone] = useState<{ id: string; suppressed: boolean } | null>(null);
  const [error, setError] = useState("");
  const form = useForm<Values>({
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      customer_type: "Business",
      service_category: categories.some((item) => item.slug === initialCategory) ? initialCategory : (categories[0]?.slug ?? ""),
      budget: "",
      timeline: "Flexible",
      description: "",
      contact_method: "WhatsApp",
      company_website: "",
    },
  });
  const descriptionLength = form.watch("description").length;

  if (done?.suppressed) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6">
        <h2 className="text-xl font-semibold">Thanks for reaching out</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          If you do not hear back, message the studio on WhatsApp so we can pick this up directly.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">Enquiry received</p>
        <h2 className="mt-2 text-2xl font-semibold">Reference {done.id}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your enquiry is saved. A confirmation email is not sent automatically yet — the team replies using the contact
          method you chose.
        </p>
        {whatsapp ? (
          <a className="mt-5 inline-flex text-sm font-semibold text-accent" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
            Message on WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-card p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Project details</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Share a little about what you need. We’ll use your preferred contact method to follow up.
        </p>
        <p className="mt-3 text-xs text-muted">
          Required fields are marked <span className="font-semibold text-accent" aria-hidden="true">*</span>
        </p>
      </div>
      <form
        className="grid gap-5"
        onSubmit={form.handleSubmit(async (values) => {
          setError("");
          try {
            const result = await submit({ data: values });
            setDone({ id: result.id, suppressed: result.suppressed });
          } catch (reason) {
            const issues = serverEnquiryIssues(reason);
            if (issues.length) {
              for (const issue of issues) {
                form.setError(issue.field, { type: "server", message: issue.message });
              }
              form.setFocus(issues[0].field);
              setError("Please review the highlighted fields and try again.");
            } else {
              setError("We couldn’t send your enquiry right now. Please try again in a moment.");
            }
          }
        })}
        onChangeCapture={() => setError("")}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="enquiry-name" className="grid content-start gap-1.5 text-sm font-medium">
            <span>
              Full name <span className="text-accent" aria-hidden="true">*</span>
            </span>
            <input
              id="enquiry-name"
              className={control}
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(form.formState.errors.name)}
              aria-describedby={form.formState.errors.name ? "enquiry-name-error" : undefined}
              {...form.register("name", {
                required: "Enter your full name.",
                validate: (value) => value.trim().length >= 2 || "Enter at least 2 characters.",
              })}
            />
            {form.formState.errors.name ? (
              <span id="enquiry-name-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">
                {form.formState.errors.name.message}
              </span>
            ) : null}
          </label>
          <label htmlFor="enquiry-email" className="grid content-start gap-1.5 text-sm font-medium">
            <span>
              Email address <span className="text-accent" aria-hidden="true">*</span>
            </span>
            <input
              id="enquiry-email"
              className={control}
              type="email"
              autoComplete="email"
              maxLength={160}
              aria-invalid={Boolean(form.formState.errors.email)}
              aria-describedby={form.formState.errors.email ? "enquiry-email-error" : undefined}
              {...form.register("email", {
                required: "Enter your email address.",
                validate: (value) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter a valid email address.",
              })}
            />
            {form.formState.errors.email ? (
              <span id="enquiry-email-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">
                {form.formState.errors.email.message}
              </span>
            ) : null}
          </label>
          <label htmlFor="enquiry-phone" className="grid content-start gap-1.5 text-sm font-medium">
            <span>
              Phone number <span className="text-accent" aria-hidden="true">*</span>
            </span>
            <input
              id="enquiry-phone"
              className={control}
              type="tel"
              autoComplete="tel"
              maxLength={24}
              aria-invalid={Boolean(form.formState.errors.phone)}
              aria-describedby={form.formState.errors.phone ? "enquiry-phone-error" : undefined}
              {...form.register("phone", {
                required: "Enter your phone number.",
                validate: (value) =>
                  (value.trim().length >= 7 && value.trim().length <= 24) ||
                  "Enter a phone number between 7 and 24 characters.",
              })}
            />
            {form.formState.errors.phone ? (
              <span id="enquiry-phone-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">
                {form.formState.errors.phone.message}
              </span>
            ) : null}
          </label>
          <label htmlFor="enquiry-organization" className="grid content-start gap-1.5 text-sm font-medium">
            <span>
              Company / institution <span className="font-normal text-muted">(optional)</span>
            </span>
            <input
              id="enquiry-organization"
              className={control}
              autoComplete="organization"
              maxLength={160}
              aria-invalid={Boolean(form.formState.errors.organization)}
              aria-describedby={form.formState.errors.organization ? "enquiry-organization-error" : undefined}
              {...form.register("organization", {
                validate: (value) => value.trim().length <= 160 || "Keep this under 160 characters.",
              })}
            />
            {form.formState.errors.organization ? (
              <span id="enquiry-organization-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">
                {form.formState.errors.organization.message}
              </span>
            ) : null}
          </label>
          <label htmlFor="enquiry-customer-type" className="grid content-start gap-1.5 text-sm font-medium">
            I’m enquiring as
            <select id="enquiry-customer-type" className={control} {...form.register("customer_type")}>
              {CUSTOMER_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label htmlFor="enquiry-service" className="grid content-start gap-1.5 text-sm font-medium">
            <span>
              Service category <span className="text-accent" aria-hidden="true">*</span>
            </span>
            <select
              id="enquiry-service"
              className={control}
              aria-invalid={Boolean(form.formState.errors.service_category)}
              aria-describedby={form.formState.errors.service_category ? "enquiry-service-error" : undefined}
              {...form.register("service_category", {
                validate: (value) => value.trim().length >= 2 || "Choose a service category.",
              })}
            >
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            {form.formState.errors.service_category ? (
              <span id="enquiry-service-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">
                {form.formState.errors.service_category.message}
              </span>
            ) : null}
          </label>
          <label htmlFor="enquiry-budget" className="grid content-start gap-1.5 text-sm font-medium">
            <span>
              Project budget <span className="font-normal text-muted">(optional)</span>
            </span>
            <select
              id="enquiry-budget"
              className={control}
              {...form.register("budget", {
                validate: (value) => value.trim().length <= 80 || "Keep this under 80 characters.",
              })}
            >
              {BUDGETS.map((item) => (
                <option key={item || "blank"} value={item}>
                  {item || "Select if you want"}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="enquiry-timeline" className="grid content-start gap-1.5 text-sm font-medium">
            Project timeline
            <select id="enquiry-timeline" className={control} {...form.register("timeline")}>
              {TIMELINES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label htmlFor="enquiry-contact-method" className="grid content-start gap-1.5 text-sm font-medium">
            Preferred contact method
            <select id="enquiry-contact-method" className={control} {...form.register("contact_method")}>
              {CONTACT_METHODS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <label htmlFor="enquiry-description" className="grid gap-1.5 text-sm font-medium">
          <span>
            Project description <span className="text-accent" aria-hidden="true">*</span>
          </span>
          <textarea
            id="enquiry-description"
            className={`${control} min-h-36 resize-y`}
            placeholder="What are you looking to build, and who is it for?"
            maxLength={4000}
            aria-invalid={Boolean(form.formState.errors.description)}
            aria-describedby={`enquiry-description-hint${form.formState.errors.description ? " enquiry-description-error" : ""}`}
            {...form.register("description", {
              required: "Tell us a little about your project.",
              validate: (value) => {
                const length = value.trim().length;
                if (length < 20) return "Please add at least 20 characters so we understand what you need.";
                if (length > 4000) return "Keep your description under 4,000 characters.";
                return true;
              },
            })}
          />
          <span id="enquiry-description-hint" className="flex flex-wrap justify-between gap-1 text-xs font-normal text-muted">
            <span>At least 20 characters. A few sentences help us give you a useful reply.</span>
            <span aria-live="polite">{descriptionLength}/4,000</span>
          </span>
          {form.formState.errors.description ? (
            <span id="enquiry-description-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">
              {form.formState.errors.description.message}
            </span>
          ) : null}
        </label>
        <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" {...form.register("company_website")} />
        </label>
        {error ? (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="min-h-12 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending your enquiry…" : "Submit enquiry"}
        </Button>
      </form>
    </div>
  );
}
