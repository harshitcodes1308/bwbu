"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { BrandHeader } from "@/components/BrandHeader";
import { BottomNav } from "@/components/BottomNav";
import { AssistantBot } from "@/components/AssistantBot";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authed, authReady } = useApp();

  // Gate every in-app screen behind the mock login. Wait for authReady so a
  // logged-in worker refreshing a page isn't bounced before the session loads.
  useEffect(() => {
    if (authReady && !authed) router.replace("/login");
  }, [authReady, authed, router]);

  // Move focus to each screen's title on navigation (accessibility parity with the old SPA).
  useEffect(() => {
    requestAnimationFrame(() => (document.querySelector("[data-page-title]") as HTMLElement | null)?.focus());
  }, [pathname]);

  // Nothing to show until we know the session, or while redirecting out.
  if (!authReady || !authed) return null;

  return (
    <div className="app-shell">
      <BrandHeader compact onHome={() => router.push("/home")} />
      <main>{children}</main>
      <AssistantBot />
      <BottomNav />
    </div>
  );
}
