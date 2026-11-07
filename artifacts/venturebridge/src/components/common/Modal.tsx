import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d2138]/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl ${
          wide ? 'max-w-3xl' : 'max-w-xl'
        }`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <h2
              id="dialog-title"
              className="font-[var(--app-font-serif)] text-xl font-bold tracking-[-.03em] text-[#1b304a]"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      </section>
    </div>
  );
}
