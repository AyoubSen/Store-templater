"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoreTemplate } from "@/lib/templater/schema";
import { createTemplateFromStarter, starterTemplates } from "@/lib/templater/starter-templates";
import {
  readActiveTemplateId,
  readStoredTemplates,
  writeActiveTemplateId,
  writeStoredTemplates,
} from "@/lib/templater/storage";
import { parseTemplate } from "@/lib/templater/validation";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<StoreTemplate[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState("");
  const [isStarterPickerOpen, setIsStarterPickerOpen] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      setTemplates(readStoredTemplates());
      setActiveTemplateId(readActiveTemplateId());
    }, 0);
  }, []);

  function openTemplate(templateId: string) {
    writeActiveTemplateId(templateId);
    setActiveTemplateId(templateId);
  }

  function createTemplate(starterId: string) {
    const template = createTemplateFromStarter(starterId);
    const nextTemplates = [...templates, template];

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(template.id);
    setTemplates(nextTemplates);
    setActiveTemplateId(template.id);
    setIsStarterPickerOpen(false);
  }

  function duplicateTemplate(template: StoreTemplate) {
    const copy = {
      ...structuredClone(template),
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} copy`,
    };
    const nextTemplates = [...templates, copy];

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(copy.id);
    setTemplates(nextTemplates);
    setActiveTemplateId(copy.id);
  }

  function deleteTemplate(templateId: string) {
    if (templates.length <= 1) {
      return;
    }

    const nextTemplates = templates.filter((template) => template.id !== templateId);
    const nextActiveTemplateId = activeTemplateId === templateId ? nextTemplates[0]?.id : activeTemplateId;

    writeStoredTemplates(nextTemplates);
    if (nextActiveTemplateId) {
      writeActiveTemplateId(nextActiveTemplateId);
      setActiveTemplateId(nextActiveTemplateId);
    }
    setTemplates(nextTemplates);
  }

  function exportTemplate(template: StoreTemplate) {
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${slugify(template.name)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importTemplate(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsedTemplate = parseTemplate(JSON.parse(String(reader.result)));

        if (!parsedTemplate) {
          window.alert("This file does not look like a Store Templater template.");
          return;
        }

        const importedTemplate = {
          ...parsedTemplate,
          id: `${parsedTemplate.id}-import-${Date.now()}`,
          name: `${parsedTemplate.name} import`,
        };
        const nextTemplates = [...templates, importedTemplate];

        writeStoredTemplates(nextTemplates);
        writeActiveTemplateId(importedTemplate.id);
        setTemplates(nextTemplates);
        setActiveTemplateId(importedTemplate.id);
      } catch {
        window.alert("Could not read this JSON file.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <main className="min-h-screen bg-[#eef0f3] text-[#111827]">
      <header className="border-[#d8dde5] border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#64748b]">Store Templater</p>
            <h1 className="mt-1 text-2xl font-semibold">Templates</h1>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]">
              Import JSON
              <input
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    importTemplate(file);
                  }
                  event.target.value = "";
                }}
                type="file"
              />
            </label>
            <button
              className="rounded-md bg-[#111827] px-3 py-2 text-sm font-medium text-white hover:bg-[#1f2937]"
              onClick={() => setIsStarterPickerOpen(true)}
              type="button"
            >
              New template
            </button>
            <Link className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]" href="/">
              Open builder
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article className="rounded-lg border border-[#d8dde5] bg-white p-4 shadow-sm" key={template.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{template.name}</h2>
                  <p className="mt-1 text-sm capitalize text-[#64748b]">{template.category}</p>
                </div>
                {activeTemplateId === template.id ? (
                  <span className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-1 text-xs font-medium text-[#15803d]">
                    Active
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex gap-1.5">
                {Object.values(template.theme.colors)
                  .slice(0, 6)
                  .map((color, index) => (
                    <span className="h-6 w-6 rounded-full border border-black/10" key={`${color}-${index}`} style={{ background: color }} />
                  ))}
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-[#64748b]">
                <div>
                  <dt className="font-medium text-[#475569]">Sections</dt>
                  <dd className="mt-1">{template.pages[0]?.sections.length ?? 0}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[#475569]">Products</dt>
                  <dd className="mt-1">{template.products.length}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[#475569]">Preview</dt>
                  <dd className="mt-1">Local</dd>
                </div>
              </dl>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  className="rounded-md bg-[#111827] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#1f2937]"
                  href="/"
                  onClick={() => openTemplate(template.id)}
                >
                  Edit
                </Link>
                <Link
                  className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-center text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  href={`/preview/${template.id}`}
                  target="_blank"
                >
                  Preview
                </Link>
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  onClick={() => duplicateTemplate(template)}
                  type="button"
                >
                  Duplicate
                </button>
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  onClick={() => exportTemplate(template)}
                  type="button"
                >
                  Export
                </button>
                <button
                  aria-disabled={templates.length <= 1}
                  className={`rounded-md border border-[#fecaca] bg-white px-3 py-2 text-sm font-medium text-[#b91c1c] hover:bg-[#fef2f2] ${
                    templates.length <= 1 ? "cursor-not-allowed opacity-40" : ""
                  }`}
                  onClick={() => deleteTemplate(template.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isStarterPickerOpen ? <StarterPickerModal onClose={() => setIsStarterPickerOpen(false)} onSelect={createTemplate} /> : null}
    </main>
  );
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "template"
  );
}

function StarterPickerModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (starterId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-[#d8dde5] bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4 border-[#e2e8f0] border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-[#111827]">Choose a starter template</h2>
            <p className="mt-1 text-xs text-[#64748b]">Create a local template from a preset store category.</p>
          </div>
          <button className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {starterTemplates.map((starter) => (
            <button className="rounded-md border border-[#d8dde5] bg-white p-3 text-left hover:border-[#2563eb] hover:bg-[#eff6ff]" key={starter.id} onClick={() => onSelect(starter.id)} type="button">
              <div className="mb-3 flex gap-1.5">
                {Object.values(starter.colors)
                  .slice(0, 5)
                  .map((color) => (
                    <span className="h-5 w-5 rounded-full border border-black/10" key={color} style={{ background: color }} />
                  ))}
              </div>
              <p className="text-sm font-semibold text-[#111827]">{starter.name}</p>
              <p className="mt-1 text-xs capitalize text-[#64748b]">{starter.category}</p>
              <p className="mt-3 text-xs leading-5 text-[#475569]">{starter.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
