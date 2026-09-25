import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <span className="mb-3 inline-flex rounded-full border border-brand-blue/15 bg-brand-blue/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-black tracking-tight text-brand-navy md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
