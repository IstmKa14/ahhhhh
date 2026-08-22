import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Icon mark — stylised canvas layers */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="7" fill="var(--primary)" />
        <rect x="6" y="6" width="10" height="10" rx="2.5" fill="white" opacity="0.9" />
        <rect x="12" y="12" width="10" height="10" rx="2.5" fill="white" opacity="0.5" />
        <rect x="9" y="9" width="10" height="10" rx="2.5" fill="white" opacity="0.3" />
      </svg>

      {!iconOnly && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          Canvasly
        </span>
      )}
    </Link>
  );
}
