"use client";

import dynamic from "next/dynamic";

// SPA client-side routing via History API — render fully client-side so every
// clean path (/login, /home…) resolves to the same shell with no SSR/window churn.
const App = dynamic(() => import("../App"), { ssr: false });

export default function Page() {
  return <App />;
}
