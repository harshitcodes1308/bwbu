"use client";

import { useApp } from "@/lib/app-context";
import { Icon } from "./icons";
import { ReadAloud } from "./ReadAloud";

export function PageTitle({ title, subtitle, onBack, readAloud }: { title: string; subtitle: string; onBack: () => void; readAloud?: string }) {
  const { t } = useApp();
  return (
    <div className="page-title">
      <button className="back-button" type="button" onClick={onBack} aria-label={t.back}><Icon name="back" /></button>
      <div>
        <h1 data-page-title tabIndex={-1}>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {readAloud && <ReadAloud text={readAloud} className="page-title-audio" />}
    </div>
  );
}
