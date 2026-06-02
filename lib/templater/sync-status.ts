export type TemplateSyncState = "loading" | "saving" | "saved" | "local-only" | "failed";

type SyncTranslator = (key: SyncTranslationKey) => string;

type SyncTranslationKey =
  | "sync.failed.description"
  | "sync.failed.label"
  | "sync.loading.description"
  | "sync.loading.label"
  | "sync.localOnly.description"
  | "sync.localOnly.label"
  | "sync.saved.description"
  | "sync.saved.label"
  | "sync.saving.description"
  | "sync.saving.label";

export function syncStatusLabel(state: TemplateSyncState, t?: SyncTranslator) {
  if (t) {
    const keys: Record<TemplateSyncState, SyncTranslationKey> = {
      failed: "sync.failed.label",
      loading: "sync.loading.label",
      "local-only": "sync.localOnly.label",
      saved: "sync.saved.label",
      saving: "sync.saving.label",
    };

    return t(keys[state]);
  }

  const labels: Record<TemplateSyncState, string> = {
    failed: "Save failed",
    loading: "Loading",
    "local-only": "Local only",
    saved: "Saved",
    saving: "Saving",
  };

  return labels[state];
}

export function syncStatusDescription(state: TemplateSyncState, t?: SyncTranslator) {
  if (t) {
    const keys: Record<TemplateSyncState, SyncTranslationKey> = {
      failed: "sync.failed.description",
      loading: "sync.loading.description",
      "local-only": "sync.localOnly.description",
      saved: "sync.saved.description",
      saving: "sync.saving.description",
    };

    return t(keys[state]);
  }

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
