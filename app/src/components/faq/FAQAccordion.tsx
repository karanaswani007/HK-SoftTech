"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { faqs } from "@/data/faqs";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={faq.question} className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-brand-navy">{faq.question}</span>
              <span
                className={isOpen ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"}
              >
                <ChevronDown size={18} />
              </span>
            </button>
            {isOpen ? <div className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">{faq.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
