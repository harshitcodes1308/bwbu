"use client";

import { useApp } from "@/lib/app-context";
import { LANGS, type Lang } from "@/lib/languages";
import { Icon } from "./icons";

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
  const { t } = useApp();
  return (
    <header className={`brand-header ${compact ? "compact" : ""}`}>
      <div className="brand-left">
        {onBack && <button className="back-button header-back" type="button" onClick={onBack} aria-label={t.back}><Icon name="back" /></button>}
        <button className="brand-lockup" type="button" onClick={onHome} disabled={!onHome} aria-label={t.brand}>
          <span className="brand-seal" aria-hidden="true"><span /></span>
          <div>
            <p className="brand-name">{t.brand}</p>
            {!compact && <p className="brand-sub">{t.brandSub}</p>}
          </div>
        </button>
      </div>
      <LanguageSwitch />
    </header>
  );
}
