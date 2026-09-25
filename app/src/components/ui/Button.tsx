import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  target,
  rel,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-brand-blue text-white shadow-[0_10px_35px_rgba(11,77,255,0.25)] hover:bg-brand-blue-dark",
    secondary:
      "bg-white text-brand-navy border border-brand-sky/20 hover:bg-slate-50",
    ghost: "bg-transparent text-brand-navy hover:bg-slate-100",
  };

  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 focus-visible:ring-offset-2",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
