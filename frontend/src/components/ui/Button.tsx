import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import {Loader2} from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "subtle" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium select-none rounded-md transition-[background,color,border,box-shadow,transform] duration-fast ease-standard whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3 text-sm",
  lg: "h-10 px-4 text-[13.5px]",
};

const variants: Record<Variant, string> = {
  primary:   "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-1 border border-primary-500",
  secondary: "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-900 border border-neutral-900",
  ghost:     "bg-transparent text-ink-secondary hover:bg-neutral-100 active:bg-neutral-200 border border-transparent",
  subtle:    "bg-neutral-100 text-ink-primary hover:bg-neutral-200 active:bg-neutral-200 border border-neutral-100",
  danger:    "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 border border-danger-500",
  outline:   "bg-surface text-ink-primary border border-border-default hover:border-border-strong hover:bg-neutral-50 active:bg-neutral-100",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, leadingIcon, trailingIcon, fullWidth, className = "", children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        base, sizes[size], variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : leadingIcon}
      <span>{children}</span>
      {!loading && trailingIcon}
    </button>
  );
});

type LinkButtonProps = LinkProps & CommonProps & { target?: string; rel?: string };

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  { variant = "primary", size = "md", leadingIcon, trailingIcon, fullWidth, className = "", children, ...rest },
  ref,
) {
  return (
    <Link
      ref={ref}
      className={[
        base, sizes[size], variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </Link>
  );
});

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps;

export const AnchorButton = forwardRef<HTMLAnchorElement, AnchorProps>(function AnchorButton(
  { variant = "outline", size = "md", leadingIcon, trailingIcon, className = "", children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={[base, sizes[size], variants[variant], className].join(" ")}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </a>
  );
});
