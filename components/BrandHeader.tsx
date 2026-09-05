"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { LANGS, type Lang } from "@/lib/languages";
import { Icon } from "./icons";
import { Avatar } from "./Avatar";

export function LanguageSwitch() {
  const { language, setLanguage } = useApp();
  return (
    <label className="language-select">
      <span className="sr-only">Language / भाषा</span>
      <select value={language} onChange={(e) => setLanguage(e.target.value as Lang)} aria-label="Language / भाषा">
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}

export function BrandHeader({ compact = false, onHome, onBack }: { compact?: boolean; onHome?: () => void; onBack?: () => void }) {
  const { t, language, profile } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: t.home, href: "/home", active: pathname === "/home" || pathname === "/" },
    { label: t.trackNav, href: "/tracker", active: pathname === "/tracker" },
    { label: t.wageNav, href: "/wage-status", active: pathname === "/wage-status" || pathname === "/ai-explanation" },
    { label: t.grievance, href: "/grievance", active: pathname.startsWith("/grievance") },
    { label: t.profile, href: "/profile", active: pathname === "/profile" },
  ];

  return (
    <header className={`brand-header ${compact ? "compact" : ""}`}>
      <div className="brand-left">
        {onBack && <button className="back-button header-back" type="button" onClick={onBack} aria-label={t.back}><Icon name="back" /></button>}
        <button className="brand-lockup" type="button" onClick={onHome} disabled={!onHome} aria-label={t.brand}>
          <img className="brand-seal" src="/images/emblem.png" alt="" width={240} height={240} />
          <div>
            <div className="brand-title-row">
              <span className="brand-name">{t.brand}</span>
              <span className="brand-badge">MGNREGA</span>
            </div>
            {!compact && <p className="brand-sub">{t.brandSub}</p>}
          </div>
        </button>
      </div>

      <nav className="header-nav" aria-label={t.navLabel}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`header-nav-link ${item.active ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="brand-right">
        <LanguageSwitch />
        <button
          type="button"
          className="header-profile-chip"
          onClick={() => router.push("/profile")}
          aria-label={profile.name[language]}
        >
          <Avatar profileId={profile.id} size={32} alt={profile.name[language]} />
          <div className="header-profile-text">
            <strong>{profile.name[language].split(" ")[0]}</strong>
            <small>{profile.village[language].split(",")[0]}</small>
          </div>
        </button>
      </div>
    </header>
  );
}
