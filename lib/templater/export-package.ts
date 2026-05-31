import type { StoreTemplate } from "./schema";
import { parseTemplate } from "./validation";
import { slugify, validateExportTemplate } from "./export-utils";

export const TEMPLATE_EXPORT_FORMAT = "store-templater.local-export";
export const TEMPLATE_EXPORT_VERSION = 1;

export type TemplateExportPackage = {
  format: typeof TEMPLATE_EXPORT_FORMAT;
  exportVersion: typeof TEMPLATE_EXPORT_VERSION;
  exportedAt: string;
  source: {
    app: "Store Templater";
    mode: "local-first";
  };
  targets: Array<"store-templater" | "static-storefront" | "static-next" | "shopify" | "hosted-preview">;
  template: StoreTemplate;
  notes: string[];
};

export function createTemplateExportPackage(template: StoreTemplate): TemplateExportPackage {
  const validatedTemplate = validateExportTemplate(template);

  return {
    format: TEMPLATE_EXPORT_FORMAT,
    exportVersion: TEMPLATE_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    source: {
      app: "Store Templater",
      mode: "local-first",
    },
    targets: ["store-templater", "static-storefront", "static-next", "shopify", "hosted-preview"],
    template: validatedTemplate,
    notes: [
      "This package contains a validated Store Templater template.",
      "Import it back into Store Templater to continue editing locally.",
      "The export format is prepared for future static Next, Shopify, and hosted preview targets.",
    ],
  };
}

export function serializeTemplateExport(template: StoreTemplate) {
  return JSON.stringify(createTemplateExportPackage(template), null, 2);
}

export function parseTemplateExport(value: unknown): StoreTemplate | null {
  if (value && typeof value === "object" && "format" in value && "template" in value) {
    const exportPackage = value as Partial<TemplateExportPackage>;

    if (exportPackage.format === TEMPLATE_EXPORT_FORMAT) {
      return parseTemplate(exportPackage.template);
    }
  }

  return parseTemplate(value);
}

export function downloadTemplateExport(template: StoreTemplate) {
  const blob = new Blob([serializeTemplateExport(template)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(template.name)}.store-template.json`;
  link.click();
  URL.revokeObjectURL(url);
}
