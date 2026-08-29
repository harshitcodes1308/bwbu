export function Icon({ name }: { name: string }) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

export function NavIcon({ name }: { name: string }) {
  const p = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "home") return <svg {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V20a1 1 0 0 0 1 1H17.5a1 1 0 0 0 1-1V9.5" /></svg>;
  if (name === "track") return <svg {...p}><circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" /><path d="M9 6h11M9 12h11M9 18h11" /></svg>;
  if (name === "grievance") return <svg {...p}><path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" /><path d="M12 8.5v3.5" /><path d="M12 15.5h.01" /></svg>;
  if (name === "status") return <svg {...p}><path d="M9 4h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Z" /><path d="M8 5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2" /><path d="m9 13 2 2 4-4" /></svg>;
  if (name === "mic") return <svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4" /><path d="M9 21h6" /></svg>;
  return <svg {...p}><circle cx="12" cy="8.5" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>;
}
