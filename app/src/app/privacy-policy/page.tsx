import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for HK SoftTech website visitors and enquiry submissions.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-black text-brand-navy">Privacy Policy</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>
            HK SoftTech respects the privacy of website visitors and enquiry submissions. Information collected through the contact form is used to understand project requirements and respond appropriately.
          </p>
          <p>
            The information may be used to contact the sender regarding services, proposals, and follow-up communication. Personal data is not shared with third parties unless required for legitimate business communication or legal compliance.
          </p>
          <p>
            This site may use cookies or basic analytics tools for technical performance and website improvement. Users can choose to disable cookies in their browser settings if needed.
          </p>
          <p>
            Contact details should be handled responsibly. If you need to update your information or have questions about your enquiry, please contact HK SoftTech directly.
          </p>
        </div>
      </div>
    </section>
  );
}
