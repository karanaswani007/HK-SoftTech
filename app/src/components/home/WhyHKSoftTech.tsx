import { ArrowUpRight, BrainCircuit, Layers3, Rocket, ShieldCheck, Sparkles } from "lucide-react";

const pillars = [
  { icon: Rocket, title: "Modern Technology", text: "Digital systems built to reflect current business needs and future-ready direction." },
  { icon: Layers3, title: "Practical Solutions", text: "Clear roadmaps and actionable outputs that suit each business, team, or learner." },
  { icon: ShieldCheck, title: "Scalable Architecture", text: "A strong foundation that supports growth, maintainability, and long-term value." },
  { icon: BrainCircuit, title: "AI-Ready Solutions", text: "Automation ideas and digital improvements designed with practical adoption in mind." },
  { icon: Sparkles, title: "Business-Focused Development", text: "Technology choices centered around value, clarity, user experience, and outcomes." },
  { icon: ArrowUpRight, title: "Continuous Support", text: "Ongoing guidance and maintenance that keep systems effective after launch." },
];

export function WhyHKSoftTech() {
  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="mb-3 inline-flex rounded-full border border-brand-blue/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Why HK SoftTech
          </span>
          <h2 className="text-3xl font-black tracking-tight text-brand-navy md:text-4xl">
            Practical digital support for ideas and growth goals
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_38px_rgba(15,23,42,0.04)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-blue">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-brand-navy">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
