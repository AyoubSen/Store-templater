export type TemplateSyncState = "loading" | "saving" | "saved" | "local-only" | "failed";

export function syncStatusLabel(state: TemplateSyncState) {
  const labels: Record<TemplateSyncState, string> = {
    failed: "Save failed",
    loading: "Loading",
    "local-only": "Local only",
    saved: "Saved",
    saving: "Saving",
  };

  return labels[state];
}

export function syncStatusDescription(state: TemplateSyncState) {
  const descriptions: Record<TemplateSyncState, string> = {
    failed: "Saved locally, but account sync failed.",
    loading: "Loading saved templates.",
    "local-only": "Saved in this browser only.",
    saved: "Saved to your account.",
    saving: "Saving to your account.",
  };

  return descriptions[state];
}

export function syncStatusClassName(state: TemplateSyncState) {
  const classes: Record<TemplateSyncState, string> = {
    failed: "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]",
    loading: "border-[#d8dde5] bg-white text-[#64748b]",
    "local-only": "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
    saved: "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
    saving: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
  };

  return classes[state];
}
