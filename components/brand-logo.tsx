import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: "compact" | "header" | "hero";
  className?: string;
  priority?: boolean;
};

const sizeClasses: Record<NonNullable<BrandLogoProps["size"]>, string> = {
  compact: "h-8 w-auto",
  header: "h-10 w-auto",
  hero: "h-16 w-auto",
};

export function BrandLogo({
  size = "header",
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/mv-logo.png"
      alt="Machine Vision"
      width={360}
      height={120}
      priority={priority}
      className={cn(sizeClasses[size], className)}
    />
  );
}

