"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

export function NavLink({
  href,
  label,
  activeColor,
  activeBackground,
  inactiveColor,
  hoverBackground,
  hoverColor,
}: {
  href: string;
  label: string;
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
          ? "rounded-md px-2.5 py-1.5"
          : "rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-hover-color)]"
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
