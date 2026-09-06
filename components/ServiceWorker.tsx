"use client";

import { useEffect } from "react";

// Registers the offline runtime cache once, after load. No-op where unsupported.
export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
