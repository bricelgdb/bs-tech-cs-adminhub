import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function Modal({ open, onClose, title, children, primaryAction, secondaryAction }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-elevated" role="dialog">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4">{children}</div>
        {(primaryAction || secondaryAction) && (
          <div className="mt-6 flex justify-end gap-2">
            {secondaryAction && (
              <button onClick={secondaryAction.onClick} className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-elevated transition-colors">
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button onClick={primaryAction.onClick} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
