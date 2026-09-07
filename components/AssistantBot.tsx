"use client";

import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { NavIcon } from "./icons";

// Floating mic button. The full voice-call screen IS the assistant now, so this
// just takes the worker straight there instead of opening a smaller duplicate.
export function AssistantBot() {
  const { t } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  // Already on the call screen — no floating shortcut to itself.
  if (pathname === "/voice-help") return null;

  return (
    <button className="assistant-fab" type="button" onClick={() => router.push("/voice-help")} aria-label={t.voiceHelpTitle}>
      <NavIcon name="mic" />
    </button>
  );
}
