import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for HK SoftTech website usage and digital service engagement.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-black text-brand-navy">Terms & Conditions</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>
            By using the HK SoftTech website, you agree to use the content and information in a lawful and responsible way. The website is intended to present company services and contact information for general business communication.
          </p>
          <p>
            Service discussions, proposals, and project details are subject to mutual agreement between HK SoftTech and the client. Final scope, timelines, responsibilities, and deliverables should be clearly defined in the formal engagement process.
          </p>
          <p>
            HK SoftTech may update content, service offerings, or website information at any time without prior notice. This site is provided for informational purposes and does not guarantee specific outcomes or service results in every case.
          </p>
          <p>
            Users are responsible for the accuracy of information submitted through the website, including contact enquiries and project requirements. The company will use submitted details only for the purpose of responding to the enquiry.
          </p>
        </div>
      </div>
    </section>
  );
}
