"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

export function NavLink({
  href,
  label,
  variant = "sidebar",
  className,
  activeColor,
  activeBackground,
  inactiveColor,
  hoverBackground,
  hoverColor,
}: {
  href: string;
  label: string;
  variant?: "sidebar" | "topbar";
  className?: string;
  activeColor?: string;
  activeBackground?: string;
  inactiveColor?: string;
  hoverBackground?: string;
  hoverColor?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={
        isActive
          ? `${variant === "sidebar" ? "rounded-2xl px-4 py-3 text-sm font-medium shadow-sm" : "rounded-xl px-3.5 py-2 text-sm font-medium"} ${className ?? ""}`
          : `${variant === "sidebar"
              ? "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-hover-color)]"
              : "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-hover-color)]"} ${className ?? ""}`
      }
      style={
        {
          color: isActive ? activeColor : inactiveColor,
          background: isActive ? activeBackground : undefined,
          "--nav-hover-bg": hoverBackground ?? "transparent",
          "--nav-hover-color": hoverColor ?? inactiveColor ?? "inherit",
        } as CSSProperties
      }
    >
      {label}
    </Link>
  );
}
