import type { StoreTemplate } from "./schema";
import { parseTemplate, versionTemplate } from "./validation";

export function validateExportTemplate(template: StoreTemplate) {
  const validatedTemplate = parseTemplate(versionTemplate(template));

  if (!validatedTemplate) {
    throw new Error("Template failed validation and cannot be exported.");
  }

  return validatedTemplate;
}

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "template"
  );
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function cssValue(value: string) {
  return value.replaceAll(";", "");
}

export function cssFont(value: string) {
  return value.includes("serif") ? "Georgia, serif" : "Inter, Arial, sans-serif";
}
