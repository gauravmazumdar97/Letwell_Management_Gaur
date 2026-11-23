import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-teal-800/10 text-teal-900",
        muted: "bg-ink-900/5 text-ink-900/70",
        success: "bg-emerald-700/10 text-emerald-900",
        warning: "bg-amber-600/15 text-amber-900",
        danger: "bg-red-700/10 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
