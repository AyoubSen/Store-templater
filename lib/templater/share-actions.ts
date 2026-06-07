export type ShareActionState = "idle" | "publishing" | "unpublishing" | "copying" | "copied" | "failed";

export function isShareActionBusy(state: ShareActionState) {
  return state === "publishing" || state === "unpublishing" || state === "copying";
}
