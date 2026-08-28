import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId, type ReactNode } from "react";
import {ChevronDown, X} from "lucide-react";

interface BaseFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  leadingIcon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

const labelCls = "text-xs font-medium text-ink-secondary mb-1.5 flex items-center gap-1";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & BaseFieldProps>(function Input(
  { label, hint, error, required, optional, leadingIcon, containerClassName = "", labelClassName, className = "", id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={containerClassName}>
      {label && <label htmlFor={fieldId} className={[labelCls, labelClassName].join(" ")}>{label}{required && <span className="text-danger-500">*</span>}{optional && <span className="text-ink-muted font-normal">— optional</span>}</label>}
      <div className="relative">
        {leadingIcon && <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none">{leadingIcon}</div>}
        <input
          id={fieldId}
          ref={ref}
          className={[
            "w-full h-9 rounded-md border border-border-default bg-surface text-sm text-ink-primary",
            "placeholder:text-ink-muted",
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
            "disabled:opacity-50 disabled:bg-neutral-50",
            "transition-colors",
            leadingIcon ? "pl-8 pr-3" : "px-3",
            error ? "border-danger-500 focus:ring-danger-500/20" : "",
            className,
          ].join(" ")}
          {...rest}
        />
      </div>
      {hint && !error && <div className="mt-1 text-[11px] text-ink-tertiary">{hint}</div>}
      {error && <div className="mt-1 text-[11px] text-danger-600">{error}</div>}
    </div>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & BaseFieldProps>(function Select(
  { label, hint, error, required, optional, leadingIcon, containerClassName = "", labelClassName, className = "", id, children, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={containerClassName}>
      {label && <label htmlFor={fieldId} className={[labelCls, labelClassName].join(" ")}>{label}{required && <span className="text-danger-500">*</span>}{optional && <span className="text-ink-muted font-normal">— optional</span>}</label>}
      <div className="relative">
        {leadingIcon && <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none">{leadingIcon}</div>}
        <select
          id={fieldId}
          ref={ref}
          className={[
            "w-full h-9 rounded-md border border-border-default bg-surface text-sm text-ink-primary appearance-none",
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
            "disabled:opacity-50 disabled:bg-neutral-50",
            "transition-colors",
            leadingIcon ? "pl-8 pr-8" : "px-3 pr-8",
            error ? "border-danger-500" : "",
            className,
          ].join(" ")}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="size-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
      </div>
      {hint && !error && <div className="mt-1 text-[11px] text-ink-tertiary">{hint}</div>}
      {error && <div className="mt-1 text-[11px] text-danger-600">{error}</div>}
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & BaseFieldProps>(function Textarea(
  { label, hint, error, required, optional, containerClassName = "", labelClassName, className = "", id, rows = 3, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={containerClassName}>
      {label && <label htmlFor={fieldId} className={[labelCls, labelClassName].join(" ")}>{label}{required && <span className="text-danger-500">*</span>}{optional && <span className="text-ink-muted font-normal">— optional</span>}</label>}
      <textarea
        id={fieldId}
        ref={ref}
        rows={rows}
        className={[
          "w-full rounded-md border border-border-default bg-surface text-sm text-ink-primary p-2.5",
          "placeholder:text-ink-muted",
          "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
          "transition-colors resize-y",
          error ? "border-danger-500" : "",
          className,
        ].join(" ")}
        {...rest}
      />
      {hint && !error && <div className="mt-1 text-[11px] text-ink-tertiary">{hint}</div>}
      {error && <div className="mt-1 text-[11px] text-danger-600">{error}</div>}
    </div>
  );
});

/** Small chip-style removable input (used by search & filters). */
export function ChipInput({
  value, onRemove }: { value: string; onChange: (v: string) => void; placeholder?: string; onRemove?: () => void }) {
  return (
    <div className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-pill bg-primary-50 text-primary-700 text-[11.5px] border border-primary-100">
      <span>{value}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${value}`}
          className="size-4 grid place-items-center rounded-full hover:bg-primary-100"
          onClick={onRemove}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
