import React from "react";

/**
 * Deliberate, curated illustrations in the hero geometric style
 * (warm earth tones, organic curves, bold ink outlines, parchment accents).
 */

export function EmptyGrievanceIllustration({ size = 160 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 200 160"
      width={size}
      height={(size * 160) / 200}
      className="empty-illustration"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eg-sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4E3B2" />
          <stop offset="100%" stopColor="#E8912D" />
        </linearGradient>
      </defs>

      {/* Radiant tranquil sun in background */}
      <circle cx="100" cy="74" r="54" fill="url(#eg-sun-grad)" opacity="0.65" />
      <circle cx="100" cy="74" r="42" fill="#F4E3B2" opacity="0.8" />

      {/* Distant gentle foliage silhouette */}
      <ellipse cx="50" cy="118" rx="32" ry="18" fill="#78945D" opacity="0.75" />
      <ellipse cx="150" cy="118" rx="32" ry="18" fill="#78945D" opacity="0.75" />

      {/* Ground horizon */}
      <path d="M12 136 Q100 128 188 136 L188 152 L12 152 Z" fill="#6B4226" opacity="0.18" />

      {/* The Open Village Register / Ledger (Clean, Peaceful, No Disputes) */}
      <g transform="translate(0, 4)">
        {/* Ledger Base Shadow */}
        <ellipse cx="100" cy="132" rx="66" ry="10" fill="#2B2420" opacity="0.12" />

        {/* Ledger Cover (Warm Soil Brown) */}
        <path
          d="M36 122 L98 128 L98 76 L36 70 Z"
          fill="#8D632F"
          stroke="#2B2420"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M164 122 L102 128 L102 76 L164 70 Z"
          fill="#6B4226"
          stroke="#2B2420"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Left Page (Paper Cream) */}
        <path
          d="M40 118 L98 124 L98 74 L40 68 Z"
          fill="#FFFDF7"
          stroke="#2B2420"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Left Page Clean Ledger Lines */}
        <line x1="48" y1="80" x2="90" y2="84" stroke="#F4E3B2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="48" y1="92" x2="90" y2="96" stroke="#F4E3B2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="48" y1="104" x2="82" y2="107" stroke="#F4E3B2" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Page (Paper Cream) */}
        <path
          d="M160 118 L102 124 L102 74 L160 68 Z"
          fill="#FFFDF7"
          stroke="#2B2420"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Right Page Clean Ledger Lines */}
        <line x1="110" y1="84" x2="152" y2="80" stroke="#F4E3B2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="110" y1="96" x2="152" y2="92" stroke="#F4E3B2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="118" y1="107" x2="152" y2="104" stroke="#F4E3B2" strokeWidth="2.5" strokeLinecap="round" />

        {/* Central Spine */}
        <path d="M98 74 L102 74 L102 126 L98 126 Z" fill="#4A2E1B" stroke="#2B2420" strokeWidth="1.5" />

        {/* Green Certified Seal / Leaf of Calm */}
        <g transform="translate(100, 78)">
          <circle cx="0" cy="0" r="19" fill="#4C7A3F" stroke="#2B2420" strokeWidth="2" />
          <circle cx="0" cy="0" r="15" fill="none" stroke="#F4E3B2" strokeWidth="1.2" strokeDasharray="3 1.5" />
          {/* Crisp Checkmark */}
          <path
            d="M-6 0 L-2 4 L7 -5"
            fill="none"
            stroke="#FFFDF7"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      {/* Two framing golden wheat stalks */}
      <g stroke="#C18C4A" strokeWidth="2" strokeLinecap="round">
        <path d="M28 140 Q24 100 32 82" fill="none" />
        <ellipse cx="28" cy="88" rx="4" ry="2" fill="#E8912D" stroke="none" transform="rotate(-30 28 88)" />
        <ellipse cx="33" cy="98" rx="4" ry="2" fill="#E8912D" stroke="none" transform="rotate(30 33 98)" />
        <ellipse cx="26" cy="106" rx="4" ry="2" fill="#E8912D" stroke="none" transform="rotate(-30 26 106)" />

        <path d="M172 140 Q176 100 168 82" fill="none" />
        <ellipse cx="172" cy="88" rx="4" ry="2" fill="#E8912D" stroke="none" transform="rotate(30 172 88)" />
        <ellipse cx="167" cy="98" rx="4" ry="2" fill="#E8912D" stroke="none" transform="rotate(-30 167 98)" />
        <ellipse cx="174" cy="106" rx="4" ry="2" fill="#E8912D" stroke="none" transform="rotate(30 174 106)" />
      </g>
    </svg>
  );
}

export function NewWorkerIllustration({ size = 160 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 200 160"
      width={size}
      height={(size * 160) / 200}
      className="empty-illustration"
      aria-hidden="true"
    >
      {/* Sun disk rising behind the job card */}
      <circle cx="100" cy="62" r="50" fill="#F4E3B2" />
      <circle cx="100" cy="62" r="38" fill="#F2B85C" opacity="0.6" />

      {/* Radiant morning sunrays */}
      <g stroke="#E8912D" strokeWidth="2" strokeLinecap="round" opacity="0.75">
        <line x1="100" y1="8" x2="100" y2="18" />
        <line x1="62" y1="24" x2="69" y2="31" />
        <line x1="138" y1="24" x2="131" y2="31" />
        <line x1="46" y1="62" x2="56" y2="62" />
        <line x1="154" y1="62" x2="144" y2="62" />
      </g>

      {/* Fertile soil base mound */}
      <ellipse cx="100" cy="142" rx="76" ry="14" fill="#6B4226" />
      <ellipse cx="100" cy="138" rx="60" ry="10" fill="#8D632F" />

      {/* Fresh Job Card Booklet */}
      <g transform="translate(0, -6)">
        {/* Booklet rear shadow / angle */}
        <rect
          x="62"
          y="62"
          width="76"
          height="64"
          rx="6"
          fill="#B5482C"
          stroke="#2B2420"
          strokeWidth="2.5"
          transform="rotate(-4 100 94)"
        />
        {/* Front Job Card Face (Terracotta & Gold) */}
        <rect
          x="65"
          y="60"
          width="76"
          height="64"
          rx="6"
          fill="#FFFDF7"
          stroke="#2B2420"
          strokeWidth="2.5"
          transform="rotate(2 100 92)"
        />
        {/* Header ribbon on Job Card */}
        <path
          d="M66 68 L140 70 L139 80 L65 78 Z"
          fill="#B5482C"
          transform="rotate(2 100 92)"
        />
        <circle cx="75" cy="74" r="3.5" fill="#F4E3B2" transform="rotate(2 100 92)" />

        {/* Authentic MGNREGA Job Card lines */}
        <line x1="72" y1="88" x2="132" y2="90" stroke="#E8912D" strokeWidth="2.5" strokeLinecap="round" transform="rotate(2 100 92)" />
        <line x1="72" y1="98" x2="124" y2="100" stroke="#78945D" strokeWidth="2.5" strokeLinecap="round" transform="rotate(2 100 92)" />
        <line x1="72" y1="108" x2="114" y2="110" stroke="#78945D" strokeWidth="2.5" strokeLinecap="round" transform="rotate(2 100 92)" />
      </g>

      {/* A vibrant green sapling / sprout bursting into life */}
      <g transform="translate(136, 102)">
        {/* Stem */}
        <path
          d="M-2 36 Q-8 16 -2 0"
          fill="none"
          stroke="#4C7A3F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Left tender leaf */}
        <path
          d="M-4 14 C-16 10 -16 -2 -2 6 C-2 10 -3 13 -4 14 Z"
          fill="#78945D"
          stroke="#2B2420"
          strokeWidth="1.6"
        />
        {/* Right vibrant leaf */}
        <path
          d="M-2 2 C12 -6 16 6 0 10 C-1 8 -2 5 -2 2 Z"
          fill="#4C7A3F"
          stroke="#2B2420"
          strokeWidth="1.6"
        />
        {/* Sun-kissed golden tip */}
        <circle cx="-1" cy="0" r="2.5" fill="#F2B85C" />
      </g>
    </svg>
  );
}

export function GrievanceSuccessIllustration({ size = 110 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className="success-stamp-svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="stamp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#B5482C" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Parchment receipt badge backing */}
      <rect
        x="18"
        y="14"
        width="84"
        height="92"
        rx="8"
        fill="#FFFDF7"
        stroke="#2B2420"
        strokeWidth="2.5"
        filter="url(#stamp-glow)"
      />

      {/* Scalloped top & bottom receipt edges */}
      <path
        d="M22 14 L30 18 L38 14 L46 18 L54 14 L62 18 L70 14 L78 18 L86 14 L94 18 L98 14"
        fill="none"
        stroke="#E8912D"
        strokeWidth="1.8"
      />
      <path
        d="M22 106 L30 102 L38 106 L46 102 L54 106 L62 102 L70 106 L78 102 L86 106 L94 102 L98 106"
        fill="none"
        stroke="#E8912D"
        strokeWidth="1.8"
      />

      {/* Simulated printed receipt header */}
      <line x1="30" y1="30" x2="90" y2="30" stroke="#8D632F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="38" x2="82" y2="38" stroke="#F4E3B2" strokeWidth="2" strokeLinecap="round" />

      {/* The Official Stamped Wax Seal */}
      <g transform="translate(60, 68)">
        {/* Terracotta outer seal with serrated edges */}
        <circle cx="0" cy="0" r="26" fill="#B5482C" stroke="#2B2420" strokeWidth="2" />
        {/* Inner dotted boundary */}
        <circle cx="0" cy="0" r="22" fill="none" stroke="#F4E3B2" strokeWidth="1.5" strokeDasharray="3.5 2" />
        
        {/* Inner disk */}
        <circle cx="0" cy="0" r="16" fill="#8E3019" />

        {/* Crisp Checkmark of Official Acceptance */}
        <path
          d="M-8 0 L-2 6 L9 -6"
          fill="none"
          stroke="#FFFDF7"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Seal ribbon tails */}
        <path d="M-10 23 L-16 38 L-4 34 L0 26 Z" fill="#B5482C" stroke="#2B2420" strokeWidth="1.5" />
        <path d="M10 23 L16 38 L4 34 L0 26 Z" fill="#8E3019" stroke="#2B2420" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function PaidCelebrationBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`paid-celebration-badge ${className}`}>
      <svg
        viewBox="0 0 100 90"
        width="76"
        height="68"
        className="paid-crest-svg"
        aria-hidden="true"
      >
        {/* Sunburst background */}
        <circle cx="50" cy="46" r="34" fill="#F2B85C" opacity="0.45" />
        <circle cx="50" cy="46" r="26" fill="#F4E3B2" />

        {/* Golden wheat sheaf left */}
        <path d="M22 68 Q24 38 36 24" fill="none" stroke="#C18C4A" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="26" cy="36" rx="4" ry="2.2" fill="#E8912D" transform="rotate(-35 26 36)" />
        <ellipse cx="32" cy="48" rx="4" ry="2.2" fill="#E8912D" transform="rotate(-30 32 48)" />

        {/* Golden wheat sheaf right */}
        <path d="M78 68 Q76 38 64 24" fill="none" stroke="#C18C4A" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="74" cy="36" rx="4" ry="2.2" fill="#E8912D" transform="rotate(35 74 36)" />
        <ellipse cx="68" cy="48" rx="4" ry="2.2" fill="#E8912D" transform="rotate(30 68 48)" />

        {/* Leaf Green Seal in center */}
        <circle cx="50" cy="46" r="18" fill="#4C7A3F" stroke="#2B2420" strokeWidth="2" />
        <circle cx="50" cy="46" r="14" fill="none" stroke="#FFFDF7" strokeWidth="1" strokeDasharray="2 1.5" />

        {/* Rupee Symbol & Checkmark */}
        <text
          x="50"
          y="52"
          fill="#FFFDF7"
          fontSize="17"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          ₹
        </text>
        {/* Small golden star above */}
        <circle cx="50" cy="18" r="3.5" fill="#E8912D" stroke="#2B2420" strokeWidth="1" />
      </svg>
    </div>
  );
}
