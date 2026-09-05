import React from "react";
import { profiles } from "@/lib/profiles";

// Portraits come straight out of the Stitch renders in screens/ — each one cropped to
// its own measured disc so a circular clip lands on the artwork's ring, never on the
// mat behind it. Stitch shipped three portraits for four personas, so the fourth
// (Asha Pal, the worker with no wage history yet) falls back to a monogram tile in the
// same palette rather than borrowing a face that already belongs to someone else.
const PORTRAITS: Record<string, string> = {
  delayed: "/images/avatar-delayed.jpg",     // Stitch: "sunita devi" render
  paid: "/images/avatar-paid.jpg",           // Stitch: "ramesh kumar" render
  grievance: "/images/avatar-grievance.jpg", // Stitch: "kamla bai" render
};

type AvatarProps = {
  profileId: string;
  size?: number | string;
  className?: string;
  initials?: string;
  alt?: string;
};

export function Avatar({ profileId, size = 46, className = "", initials = "", alt }: AvatarProps) {
  const src = PORTRAITS[profileId];

  if (src) {
    return (
      <img
        className={`avatar-art ${className}`}
        src={src}
        // Intrinsic dimensions only: the CSS box wins, but these stop the row from
        // reflowing while the portrait decodes.
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? size : undefined}
        alt={alt || ""}
        // Not lazy: every avatar sits in a header or a list that is visible on arrival,
        // and each file is ~20 KB, so deferring only delays the identity cue.
        decoding="async"
      />
    );
  }

  // Monogram fallback. Look the initial up when the caller did not pass one, so every
  // call site keeps working without threading the prop through.
  const mark = initials || profiles.find((p) => p.id === profileId)?.initials || "";
  return (
    <span
      className={`avatar-art avatar-monogram ${className}`}
      style={typeof size === "number" ? { fontSize: Math.round(size * 0.42) } : undefined}
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {mark}
    </span>
  );
}
