import { sampleTemplate } from "./sample-template";
import type { StoreTemplate } from "./schema";
import { parseTemplate, parseTemplates, versionTemplate } from "./validation";

export const TEMPLATE_STORAGE_KEY = "store-templater:active-template";
export const TEMPLATE_LIBRARY_STORAGE_KEY = "store-templater:templates";
export const ACTIVE_TEMPLATE_ID_STORAGE_KEY = "store-templater:active-template-id";

export function readStoredTemplate(): StoreTemplate {
  if (typeof window === "undefined") {
    return sampleTemplate;
  }

  const templates = readStoredTemplates();
  const activeTemplateId = readActiveTemplateId();
  const activeTemplate = templates.find((template) => template.id === activeTemplateId);

  if (activeTemplate) {
    return activeTemplate;
  }

  const storedTemplate = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);

  if (!storedTemplate) {
    return sampleTemplate;
  }

  try {
    const parsedTemplate = parseTemplate(JSON.parse(storedTemplate));
    return parsedTemplate ?? versionTemplate(sampleTemplate);
  } catch {
    window.localStorage.removeItem(TEMPLATE_STORAGE_KEY);
    return sampleTemplate;
  }
}

export function readStoredTemplateById(templateId: string): StoreTemplate | null {
  return readStoredTemplates().find((template) => template.id === templateId) ?? null;
}

export function writeStoredTemplate(template: StoreTemplate) {
  const versionedTemplate = versionTemplate(template);
  window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(versionedTemplate));
  writeTemplateToLibrary(versionedTemplate);
}

export function clearStoredTemplate() {
  window.localStorage.removeItem(TEMPLATE_STORAGE_KEY);
  window.localStorage.removeItem(ACTIVE_TEMPLATE_ID_STORAGE_KEY);
}

export function readStoredTemplates(): StoreTemplate[] {
  if (typeof window === "undefined") {
    return [sampleTemplate];
  }

  const storedTemplates = window.localStorage.getItem(TEMPLATE_LIBRARY_STORAGE_KEY);

  if (!storedTemplates) {
    return [sampleTemplate];
  }

  try {
    const templates = parseTemplates(JSON.parse(storedTemplates));
    writeStoredTemplates(templates);
    return templates.length ? templates : [sampleTemplate];
  } catch {
    window.localStorage.removeItem(TEMPLATE_LIBRARY_STORAGE_KEY);
    return [sampleTemplate];
  }
}

export function writeStoredTemplates(templates: StoreTemplate[]) {
  window.localStorage.setItem(TEMPLATE_LIBRARY_STORAGE_KEY, JSON.stringify(templates.map(versionTemplate)));
}

export function readActiveTemplateId() {
  if (typeof window === "undefined") {
    return sampleTemplate.id;
  }

  return window.localStorage.getItem(ACTIVE_TEMPLATE_ID_STORAGE_KEY) ?? sampleTemplate.id;
}

export function writeActiveTemplateId(templateId: string) {
  window.localStorage.setItem(ACTIVE_TEMPLATE_ID_STORAGE_KEY, templateId);
}

export function writeTemplateToLibrary(template: StoreTemplate) {
  const versionedTemplate = versionTemplate(template);
  const templates = readStoredTemplates();
  const existingIndex = templates.findIndex((storedTemplate) => storedTemplate.id === versionedTemplate.id);
  const nextTemplates =
    existingIndex >= 0
      ? templates.map((storedTemplate) => (storedTemplate.id === versionedTemplate.id ? versionedTemplate : storedTemplate))
      : [...templates, versionedTemplate];

  writeStoredTemplates(nextTemplates);
  writeActiveTemplateId(versionedTemplate.id);
}
