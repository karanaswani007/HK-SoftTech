import { useEffect, useState, type ReactNode } from "react";
import { errText } from "@/lib/hk/row";

export const fieldClass = "w-full rounded-lg border border-line bg-card px-3 py-3 text-base text-ink sm:text-sm";

export function useLoader<T>(fn: () => Promise<T>, key: string | number = 0) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    let live = true;
    setData(null);
    setError(null);
    fn()
      .then((value) => {
        if (live) setData(value);
      })
      .catch((reason) => {
        if (live) setError(errText(reason));
      });
    return () => {
      live = false;
    };
  }, [nonce, key]);
  return {
    data,
    error,
    loading: data === null && error === null,
    reload: () => setNonce((value) => value + 1),
  };
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-line bg-soft px-3 py-2 text-sm text-ink">{children}</p>;
}

export function Skeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-line" />
      <div className="h-32 animate-pulse rounded-2xl bg-line" />
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{ message: string; run: () => void } | null>(null);
  const dialog = state ? (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/50 p-4" role="alertdialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-card p-5 text-ink">
        <p className="text-sm leading-6">{state.message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="rounded-full px-4 py-2 text-sm" onClick={() => setState(null)}>
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-on-navy"
            onClick={() => {
              const run = state.run;
              setState(null);
              run();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return {
    dialog,
    confirm: (message: string, run: () => void) => setState({ message, run }),
  };
}

export function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
