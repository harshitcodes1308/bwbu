"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BrandHeader } from "@/components/BrandHeader";
import { BottomNav } from "@/components/BottomNav";
import { AssistantBot } from "@/components/AssistantBot";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Move focus to each screen's title on navigation (accessibility parity with the old SPA).
  useEffect(() => {
    requestAnimationFrame(() => (document.querySelector("[data-page-title]") as HTMLElement | null)?.focus());
  }, [pathname]);

  return (
    <div className="app-shell">
      <BrandHeader compact onHome={() => router.push("/home")} />
      <main>{children}</main>
      <AssistantBot />
      <BottomNav />
    </div>
  );
}
