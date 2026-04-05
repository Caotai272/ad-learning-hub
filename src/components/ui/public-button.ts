import { cn } from "@/lib/utils";

type PublicButtonVariant = "primary" | "secondary";
type PublicButtonSize = "sm" | "md";

const variantClassNames: Record<PublicButtonVariant, string> = {
  primary: "bg-slate-950 text-white hover:bg-slate-800",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
};

const sizeClassNames: Record<PublicButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
};

export function getPublicButtonClassName(options?: {
  variant?: PublicButtonVariant;
  size?: PublicButtonSize;
  fullWidth?: boolean;
}) {
  const { variant = "primary", size = "md", fullWidth = false } = options ?? {};

  return cn(
    "inline-flex max-w-full items-center justify-center rounded-full text-center font-semibold transition",
    variant === "primary" ? variantClassNames.primary : variantClassNames.secondary,
    sizeClassNames[size],
    fullWidth ? "w-full" : null,
  );
}
