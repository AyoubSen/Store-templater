"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { StoreCategory } from "@/lib/templater/schema";
import {
  pageStructureOptions,
  resolveStarterPalette,
  starterTemplates,
  type TemplateCreationOptions,
  type TemplatePageStructure,
  type TemplateVisualStyle,
  visualStyleOptions,
} from "@/lib/templater/starter-templates";

const categoryOptions: Array<{ id: StoreCategory; label: string }> = [
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "home", label: "Home" },
  { id: "electronics", label: "Tech" },
  { id: "food", label: "Food" },
  { id: "digital", label: "Digital" },
];

export function TemplateCreationFlow({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (options: TemplateCreationOptions) => void;
}) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<StoreCategory>("fashion");
  const [visualStyle, setVisualStyle] = useState<TemplateVisualStyle>("editorial");
  const [structure, setStructure] = useState<TemplatePageStructure>("full");
  const [templateName, setTemplateName] = useState("");
  const starter = useMemo(
    () => starterTemplates.find((template) => template.category === category) ?? starterTemplates[0],
    [category],
  );
  const selectedStyle = visualStyleOptions.find((option) => option.id === visualStyle) ?? visualStyleOptions[0];
  const selectedStructure = pageStructureOptions.find((option) => option.id === structure) ?? pageStructureOptions[0];
  const previewColors = resolveStarterPalette(starter.colors, visualStyle);
  const includedSections = useMemo(() => getIncludedSections(selectedStructure.pages), [selectedStructure.pages]);

  function createTemplate() {
    onCreate({
      category,
      name: templateName,
      starterId: starter.id,
      structure,
      visualStyle,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <div className="flex max-h-[min(760px,calc(100vh-32px))] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#d8dde5] bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex shrink-0 items-center justify-between gap-4 border-[#e2e8f0] border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-[#111827]">{t("starter.flow.title")}</h2>
            <p className="mt-1 text-xs text-[#64748b]">{t("starter.flow.body")}</p>
          </div>
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            onClick={onClose}
            type="button"
          >
            {t("common.close")}
          </button>
        </div>

        <div className="grid min-h-0 flex-1 md:grid-cols-[190px_minmax(0,1fr)]">
          <aside className="border-[#e2e8f0] border-b bg-[#f8fafc] p-3 md:border-r md:border-b-0">
            {["Store", "Style", "Pages", "Finish"].map((label, index) => (
              <button
                className={`mb-1 flex min-h-9 w-full items-center gap-2 rounded-md px-3 text-left text-xs font-semibold ${
                  step === index ? "bg-white text-[#111827] shadow-sm" : "text-[#64748b] hover:bg-white hover:text-[#111827]"
                }`}
                key={label}
                onClick={() => setStep(index)}
                type="button"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[#d8dde5] bg-white text-[10px]">
                  {index + 1}
                </span>
                {label}
              </button>
            ))}
          </aside>

          <div className="min-h-0 overflow-y-auto p-4">
            {step === 0 ? (
              <StepPanel eyebrow={t("starter.step.store")} title={t("starter.step.storeTitle")}>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryOptions.map((option) => {
                    const optionStarter = starterTemplates.find((template) => template.category === option.id) ?? starterTemplates[0];

                    return (
                      <button
                        className={`rounded-md border p-3 text-left ${
                          category === option.id
                            ? "border-[#2563eb] bg-[#eff6ff] shadow-[inset_3px_0_0_#2563eb]"
                            : "border-[#d8dde5] bg-white hover:border-[#93c5fd]"
                        }`}
                        key={option.id}
                        onClick={() => setCategory(option.id)}
                        type="button"
                      >
                        <div className="mb-3 flex gap-1.5">
                          {Object.values(optionStarter.colors)
                            .slice(0, 5)
                            .map((color) => (
                              <span className="h-5 w-5 rounded-full border border-black/10" key={color} style={{ background: color }} />
                            ))}
                        </div>
                        <p className="text-sm font-semibold text-[#111827]">{option.label}</p>
                        <p className="mt-1 text-xs leading-5 text-[#64748b]">{optionStarter.description}</p>
                      </button>
                    );
                  })}
                </div>
              </StepPanel>
            ) : null}

            {step === 1 ? (
              <StepPanel eyebrow={t("starter.step.style")} title={t("starter.step.styleTitle")}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {visualStyleOptions.map((option) => (
                    <button
                      className={`rounded-md border p-3 text-left ${
                        visualStyle === option.id ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#d8dde5] bg-white hover:border-[#93c5fd]"
                      }`}
                      key={option.id}
                      onClick={() => setVisualStyle(option.id)}
                      type="button"
                    >
                      <p className="text-sm font-semibold text-[#111827]">{option.name}</p>
                      <p className="mt-1 text-xs leading-5 text-[#64748b]">{option.description}</p>
                    </button>
                  ))}
                </div>
              </StepPanel>
            ) : null}

            {step === 2 ? (
              <StepPanel eyebrow={t("starter.step.pages")} title={t("starter.step.pagesTitle")}>
                <div className="grid gap-2">
                  {pageStructureOptions.map((option) => (
                    <button
                      className={`rounded-md border p-3 text-left ${
                        structure === option.id ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#d8dde5] bg-white hover:border-[#93c5fd]"
                      }`}
                      key={option.id}
                      onClick={() => setStructure(option.id)}
                      type="button"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{option.name}</p>
                          <p className="mt-1 text-xs leading-5 text-[#64748b]">{option.description}</p>
                        </div>
                        <span className="rounded-full border border-[#d8dde5] bg-white px-2 py-1 text-[11px] font-semibold text-[#64748b]">
                          {option.pages.length} pages
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </StepPanel>
            ) : null}

            {step === 3 ? (
              <StepPanel eyebrow={t("starter.step.finish")} title={t("starter.step.finishTitle")}>
                <label className="block text-xs font-semibold text-[#475569]">
                  {t("starter.templateName")}
                  <input
                    className="mt-2 min-h-10 w-full rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#2563eb]"
                    onChange={(event) => setTemplateName(event.target.value)}
                    placeholder={starter.name}
                    value={templateName}
                  />
                </label>
                <div className="mt-4 rounded-md border border-[#d8dde5] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-[#475569]">{t("starter.summary")}</p>
                  <div className="mt-3 grid gap-2 text-sm text-[#334155] sm:grid-cols-3">
                    <SummaryItem label={t("starter.summaryStore")} value={starter.name} />
                    <SummaryItem label={t("starter.summaryStyle")} value={selectedStyle.name} />
                    <SummaryItem label={t("starter.summaryPages")} value={`${selectedStructure.name} (${selectedStructure.pages.length})`} />
                  </div>
                  {structure === "landing" ? (
                    <p className="mt-3 rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-xs leading-5 text-[#1d4ed8]">
                      {t("starter.landingNote")}
                    </p>
                  ) : null}
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <SummaryPanel title={t("starter.summaryIncludedPages")}>
                      <ChipList items={selectedStructure.pages.map(formatPageLabel)} />
                    </SummaryPanel>
                    <SummaryPanel title={t("starter.summaryProducts")}>
                      <p className="text-xs leading-5 text-[#64748b]">
                        {starter.products.length} {t("starter.summaryProductsSuffix")}
                      </p>
                      <ChipList items={starter.products.map((product) => product.name)} />
                    </SummaryPanel>
                    <SummaryPanel title={t("starter.summarySections")}>
                      <ChipList items={includedSections} />
                    </SummaryPanel>
                    <SummaryPanel title={t("starter.summaryContent")}>
                      <ChipList items={starter.categories.concat(starter.featurePoints.slice(0, 2))} />
                    </SummaryPanel>
                  </div>
                  <div className="mt-3 rounded-md border border-[#e2e8f0] bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase text-[#94a3b8]">{t("starter.summaryColors")}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {Object.entries(previewColors).map(([name, color]) => (
                        <div className="flex min-w-0 items-center gap-2 rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1.5" key={name}>
                          <span className="h-5 w-5 shrink-0 rounded-full border border-black/10" style={{ background: color }} />
                          <span className="min-w-0 truncate text-[11px] font-medium capitalize text-[#475569]">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </StepPanel>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-[#e2e8f0] border-t bg-white px-4 py-3">
          <p className="text-xs text-[#64748b]">
            {t("tour.step")} {step + 1} {t("tour.of")} 4
          </p>
          <div className="flex items-center gap-2">
            <button
              className="min-h-9 rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              type="button"
            >
              {t("tour.back")}
            </button>
            {step < 3 ? (
              <button
                className="min-h-9 rounded-md bg-[#111827] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1f2937]"
                onClick={() => setStep((current) => Math.min(3, current + 1))}
                type="button"
              >
                {t("tour.next")}
              </button>
            ) : (
              <button
                className="min-h-9 rounded-md bg-[#111827] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1f2937]"
                onClick={createTemplate}
                type="button"
              >
                {t("starter.create")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPanel({ children, eyebrow, title }: { children: React.ReactNode; eyebrow: string; title: string }) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold text-[#111827]">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-white px-3 py-2">
      <p className="text-[11px] font-semibold uppercase text-[#94a3b8]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111827]">{value}</p>
    </div>
  );
}

function SummaryPanel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-white p-3">
      <p className="text-[11px] font-semibold uppercase text-[#94a3b8]">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span className="rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1 text-[11px] font-medium text-[#475569]" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function formatPageLabel(page: string) {
  return page
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getIncludedSections(pages: string[]) {
  const sections = new Set<string>(["Hero", "Header", "Product cards"]);

  if (pages.includes("collection")) {
    sections.add("Collection grid");
    sections.add("Filters");
  }

  if (pages.includes("product")) {
    sections.add("Product detail");
    sections.add("FAQ");
  }

  if (pages.includes("cart")) {
    sections.add("Cart summary");
    sections.add("Trust band");
  }

  if (pages.includes("checkout")) {
    sections.add("Checkout summary");
  }

  if (pages.includes("about")) {
    sections.add("Brand story");
  }

  if (pages.includes("contact")) {
    sections.add("Contact FAQ");
  }

  return Array.from(sections);
}
