"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { NavIcon } from "./icons";

// Which nav item lights up for each route (secondary screens map to their parent).
const activeFor: Record<string, string> = {
  "/ai-explanation": "wage-status",
  "/grievance-preview": "grievance",
  "/grievance-submitted": "grievance-status",
};

export function BottomNav() {
  const { t } = useApp();
  const pathname = usePathname();
  const active = activeFor[pathname] ?? pathname.replace(/^\//, "");
  const items: [string, string, string][] = [
    ["home", "home", t.home],
    ["wage-status", "track", t.wageNav],
    ["grievance", "grievance", t.grievance],
    ["grievance-status", "status", t.trackNav],
    ["profile", "profile", t.profile],
  ];
  return (
    <nav className="bottom-nav" aria-label={t.navLabel}>
      {items.map(([route, icon, label]) => (
        <Link href={`/${route}`} className={active === route ? "selected" : ""} key={route} aria-current={active === route ? "page" : undefined}>
          <NavIcon name={icon} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
