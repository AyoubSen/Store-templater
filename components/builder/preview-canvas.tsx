"use client";

import Link from "next/link";
import { StorefrontPreview } from "@/components/storefront-preview";
import { sectionRegistry } from "@/lib/templater/registry";
import type { StoreTemplate, TemplatePage, TemplateSection } from "@/lib/templater/schema";

export type Device = "desktop" | "tablet" | "mobile";

export function PreviewCanvas({
  canRedo,
  canUndo,
  device,
  previewStyle,
  redoTemplateChange,
  resetTemplate,
  selectedPage,
  selectedSection,
  selectedSectionId,
  setDevice,
  setZoom,
  template,
  undoTemplateChange,
  zoom,
}: {
  canRedo: boolean;
  canUndo: boolean;
  device: Device;
  previewStyle: React.CSSProperties;
  redoTemplateChange: () => void;
  resetTemplate: () => void;
  selectedPage?: TemplatePage;
  selectedSection?: TemplateSection;
  selectedSectionId: string;
  setDevice: (device: Device) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  template: StoreTemplate;
  undoTemplateChange: () => void;
  zoom: number;
}) {
  return (
    <section className="flex min-h-0 flex-col bg-[#eef0f3]">
      <header className="flex h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-[#d8dde5] border-b bg-white px-4">
        <div>
          <p className="text-sm font-semibold">{selectedPage?.name ?? "Page"}</p>
          <p className="text-xs text-[#64748b]">Live storefront preview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canUndo}
            onClick={undoTemplateChange}
            type="button"
          >
            Undo
          </button>
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canRedo}
            onClick={redoTemplateChange}
            type="button"
          >
            Redo
          </button>
          <div className="flex rounded-md border border-[#d8dde5] bg-[#f8fafc] p-0.5">
            {(["desktop", "tablet", "mobile"] as const).map((option) => (
              <button
                className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${
                  device === option ? "bg-white text-[#111827] shadow-sm" : "text-[#64748b] hover:text-[#111827]"
                }`}
                key={option}
                onClick={() => setDevice(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <Link
            className="rounded-md bg-[#111827] px-3 py-2 text-xs font-medium text-white hover:bg-[#1f2937]"
            href={`/preview/${template.id}`}
            target="_blank"
          >
            Preview
          </Link>
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            onClick={resetTemplate}
            type="button"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:18px_18px] p-6">
        <div className="w-full max-w-7xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748b]">
            <span>{deviceLabel(device)}</span>
            <div className="flex items-center gap-2">
              <span>Zoom</span>
              <button
                className="rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setZoom((current) => Math.max(60, current - 10))}
                type="button"
              >
                -
              </button>
              <input
                aria-label="Preview zoom"
                className="w-24 accent-[#2563eb]"
                max={120}
                min={60}
                onChange={(event) => setZoom(Number(event.target.value))}
                step={10}
                type="range"
                value={zoom}
              />
              <button
                className="rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setZoom((current) => Math.min(120, current + 10))}
                type="button"
              >
                +
              </button>
              <button
                className="rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setZoom(90)}
                type="button"
              >
                {zoom}%
              </button>
            </div>
            <span>{selectedSection ? sectionRegistry[selectedSection.type].label : "No section selected"}</span>
          </div>
          <StorePreview
            device={device}
            pageId={selectedPage?.id}
            selectedSectionId={selectedSectionId}
            style={previewStyle}
            template={template}
            zoom={zoom}
          />
        </div>
      </div>
    </section>
  );
}

function deviceLabel(device: Device) {
  const labels: Record<Device, string> = {
    desktop: "Desktop 1440px",
    tablet: "Tablet 768px",
    mobile: "Mobile 390px",
  };

  return labels[device];
}

function StorePreview({
  device,
  pageId,
  selectedSectionId,
  style,
  template,
  zoom,
}: {
  device: Device;
  pageId?: string;
  selectedSectionId: string;
  style: React.CSSProperties;
  template: StoreTemplate;
  zoom: number;
}) {
  const widths: Record<Device, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  return (
    <div className="flex justify-center">
      <div
        className="origin-top overflow-hidden border border-[#cbd5e1] bg-white shadow-xl shadow-slate-900/10 transition-all"
        style={{
          borderRadius: device === "mobile" ? 28 : device === "tablet" ? 18 : 10,
          transform: `scale(${zoom / 100})`,
          width: widths[device],
        }}
      >
        <div style={style}>
          <StorefrontPreview pageId={pageId} selectedSectionId={selectedSectionId} template={template} />
        </div>
      </div>
    </div>
  );
}
