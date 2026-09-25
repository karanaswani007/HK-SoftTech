import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">404</p>
      <h1 className="mt-4 text-4xl font-black text-brand-navy">Page not found</h1>
      <p className="mt-4 text-lg text-slate-600">The page you are looking for might have moved or no longer exists.</p>
      <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white">
        Return home
      </Link>
    </section>
  );
}
