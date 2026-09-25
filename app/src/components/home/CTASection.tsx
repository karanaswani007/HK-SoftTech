import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#071A3D_0%,#0B4DFF_48%,#00B8E6_100%)] p-8 text-white shadow-[0_28px_80px_rgba(11,77,255,0.18)] md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">Ready to start?</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Let&apos;s build your next digital milestone.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-slate-100"
              >
                Contact HK SoftTech
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
