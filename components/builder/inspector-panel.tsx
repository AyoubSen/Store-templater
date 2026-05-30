"use client";

import { useRef, useState } from "react";
import { ColorTokenControl, GradientField, NumberField, RangeControl, TextField } from "@/components/builder/controls";
import { SectionInspector } from "@/components/builder/section-inspector";
import { sectionRegistry } from "@/lib/templater/registry";
import type { StoreTemplate, TemplateSection, ThemeTokens } from "@/lib/templater/schema";
import { themePresets } from "@/lib/templater/theme-presets";
import { typographyPresets } from "@/lib/templater/typography-presets";

export type InspectorTab = "store" | "theme" | "products" | "section";

export function InspectorPanel({
  addProduct,
  colorControls,
  deleteProduct,
  deleteSection,
  duplicateProduct,
  duplicateSection,
  homeSections,
  inspectorTab,
  moveSection,
  selectedSection,
  setInspectorTab,
  template,
  toggleSection,
  updateColor,
  applyThemePreset,
  applyTypographyPreset,
  updateLayout,
  updateProduct,
  updateSectionSetting,
  updateTemplateField,
}: {
  addProduct: () => void;
  colorControls: Array<keyof ThemeTokens["colors"]>;
  deleteProduct: (productId: string) => void;
  deleteSection: (sectionId: string) => void;
  duplicateProduct: (productId: string) => void;
  duplicateSection: (sectionId: string) => void;
  homeSections: TemplateSection[];
  inspectorTab: InspectorTab;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  selectedSection?: TemplateSection;
  setInspectorTab: (tab: InspectorTab) => void;
  template: StoreTemplate;
  toggleSection: (sectionId: string) => void;
  updateColor: (key: keyof ThemeTokens["colors"], value: string) => void;
  applyThemePreset: (colors: ThemeTokens["colors"]) => void;
  applyTypographyPreset: (typography: ThemeTokens["typography"]) => void;
  updateLayout: (key: keyof ThemeTokens["layout"], value: number | ThemeTokens["layout"]["density"]) => void;
  updateProduct: (productId: string, key: string, value: string | number) => void;
  updateSectionSetting: (sectionId: string, key: string, value: unknown) => void;
  updateTemplateField: <K extends "name" | "category">(key: K, value: StoreTemplate[K]) => void;
}) {
  const [imageProductId, setImageProductId] = useState<string | null>(null);
  const imageProduct = template.products.find((product) => product.id === imageProductId);

  return (
    <aside className="relative z-30 flex min-h-0 flex-col border-[#d8dde5] border-l bg-[#f8fafc]">
      <div className="shrink-0 border-[#e2e8f0] border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Inspector</h2>
          <p className="text-xs text-[#64748b]">Theme and selected section</p>
        </div>
      </div>

      <div className="shrink-0 border-[#e2e8f0] border-b bg-white px-3 py-2">
        <div className="flex rounded-md bg-[#f1f5f9] p-0.5">
          {(["store", "theme", "products", "section"] as const).map((tab) => (
            <button
              className={`min-w-0 flex-1 rounded px-1.5 py-1 text-[11px] font-medium capitalize leading-5 ${
                inspectorTab === tab ? "bg-white text-[#111827] shadow-sm" : "text-[#64748b] hover:text-[#111827]"
              }`}
              key={tab}
              onClick={() => setInspectorTab(tab)}
              type="button"
            >
              {tab === "products" ? "Items" : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {inspectorTab === "store" ? (
          <section className="px-4 py-4">
            <h3 className="text-xs font-semibold uppercase text-[#475569]">Store</h3>
            <div className="mt-3 space-y-3">
              <TextField label="Template name" onChange={(value) => updateTemplateField("name", value)} value={template.name} />
              <label className="block text-xs font-medium text-[#475569]">
                Category
                <select
                  className="mt-1.5 w-full rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-sm capitalize text-[#111827] shadow-sm"
                  onChange={(event) => updateTemplateField("category", event.target.value as StoreTemplate["category"])}
                  value={template.category}
                >
                  {(["fashion", "beauty", "electronics", "home", "food", "digital"] as const).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        ) : null}

        {inspectorTab === "theme" ? (
          <>
            <section className="border-[#e2e8f0] border-b px-4 py-4">
              <h3 className="text-xs font-semibold uppercase text-[#475569]">Theme presets</h3>
              <div className="mt-3 grid gap-2">
                {themePresets.map((preset) => (
                  <button
                    className="rounded-md border border-[#d8dde5] bg-white p-2.5 text-left hover:border-[#2563eb] hover:bg-[#eff6ff]"
                    key={preset.id}
                    onClick={() => applyThemePreset(preset.colors)}
                    type="button"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        <span className="block text-sm font-medium text-[#111827]">{preset.name}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-[#64748b]">{preset.description}</span>
                      </span>
                      <span className="flex shrink-0 gap-1">
                        {Object.values(preset.colors)
                          .slice(0, 4)
                          .map((color) => (
                            <span className="h-4 w-4 rounded-full border border-black/10" key={color} style={{ background: color }} />
                          ))}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border-[#e2e8f0] border-b px-4 py-4">
              <h3 className="text-xs font-semibold uppercase text-[#475569]">Theme tokens</h3>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {colorControls.map((key) => (
                  <ColorTokenControl key={key} label={key} onChange={(value) => updateColor(key, value)} value={template.theme.colors[key]} />
                ))}
              </div>
            </section>

            <section className="border-[#e2e8f0] border-b px-4 py-4">
              <h3 className="text-xs font-semibold uppercase text-[#475569]">Typography</h3>
              <div className="mt-3 grid gap-2">
                {typographyPresets.map((preset) => (
                  <button
                    className={`rounded-md border bg-white p-2.5 text-left hover:border-[#2563eb] hover:bg-[#eff6ff] ${
                      template.theme.typography.scale === preset.typography.scale ? "border-[#2563eb]" : "border-[#d8dde5]"
                    }`}
                    key={preset.id}
                    onClick={() => applyTypographyPreset(preset.typography)}
                    type="button"
                  >
                    <span className="block text-sm font-medium text-[#111827]">{preset.name}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#64748b]">{preset.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border-[#e2e8f0] border-b px-4 py-4">
              <h3 className="text-xs font-semibold uppercase text-[#475569]">Layout</h3>
              <div className="mt-3 space-y-4">
                <RangeControl label="Radius" max={24} min={0} onChange={(value) => updateLayout("radius", value)} value={template.theme.layout.radius} />
                <RangeControl label="Spacing" max={32} min={10} onChange={(value) => updateLayout("spacing", value)} value={template.theme.layout.spacing} />
                <RangeControl
                  label="Max width"
                  max={1360}
                  min={920}
                  onChange={(value) => updateLayout("maxWidth", value)}
                  step={20}
                  value={template.theme.layout.maxWidth}
                />
              </div>
            </section>
          </>
        ) : null}

        {inspectorTab === "products" ? (
          <section className="px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase text-[#475569]">Products</h3>
              <button
                className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={addProduct}
                type="button"
              >
                Add
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {template.products.map((product) => (
                <details className="rounded-md border border-[#e2e8f0] bg-white p-3" key={product.id}>
                  <summary className="cursor-pointer list-none text-sm font-medium text-[#111827]">
                    {product.name}
                    <span className="mt-1 block text-xs text-[#64748b]">${product.price}</span>
                  </summary>
                  <div className="mt-3 space-y-3">
                    <TextField label="Name" onChange={(value) => updateProduct(product.id, "name", value)} value={product.name} />
                    <TextField label="Category" onChange={(value) => updateProduct(product.id, "category", value)} value={product.category} />
                    <NumberField label="Price" min={0} onChange={(value) => updateProduct(product.id, "price", value)} value={product.price} />
                    <TextField label="Badge" onChange={(value) => updateProduct(product.id, "badge", value)} value={product.badge ?? ""} />
                    <GradientField label="Visual" onChange={(value) => updateProduct(product.id, "image", value)} value={product.image} />
                    <button
                      className="w-full rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                      onClick={() => setImageProductId(product.id)}
                      type="button"
                    >
                      Import image
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                        onClick={() => duplicateProduct(product.id)}
                        type="button"
                      >
                        Duplicate
                      </button>
                      <button
                        className="rounded-md border border-[#fecaca] bg-white px-2.5 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={template.products.length <= 1}
                        onClick={() => deleteProduct(product.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {inspectorTab === "section" && selectedSection ? (
          <section className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold uppercase text-[#475569]">Selected section</h3>
                <p className="mt-1 text-sm font-medium">{selectedSection.name}</p>
                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  {sectionRegistry[selectedSection.type].editableSettings.join(", ")}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-[#e2e8f0] bg-white p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-[#475569]">Section actions</span>
                <button
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                    selectedSection.enabled ? "bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                  }`}
                  onClick={() => toggleSection(selectedSection.id)}
                  type="button"
                >
                  {selectedSection.enabled ? "Visible" : "Hidden"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={homeSections[0]?.id === selectedSection.id}
                  onClick={() => moveSection(selectedSection.id, "up")}
                  type="button"
                >
                  Move up
                </button>
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={homeSections.at(-1)?.id === selectedSection.id}
                  onClick={() => moveSection(selectedSection.id, "down")}
                  type="button"
                >
                  Move down
                </button>
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  onClick={() => duplicateSection(selectedSection.id)}
                  type="button"
                >
                  Duplicate
                </button>
                <button
                  className="rounded-md border border-[#fecaca] bg-white px-2.5 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={homeSections.length <= 1}
                  onClick={() => deleteSection(selectedSection.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
            <SectionInspector section={selectedSection} updateSetting={updateSectionSetting} />
          </section>
        ) : null}
      </div>
      {imageProduct ? (
        <ImageImportModal
          currentImage={imageProduct.image}
          currentPositionX={imageProduct.imagePositionX ?? 50}
          currentPositionY={imageProduct.imagePositionY ?? 50}
          currentZoom={imageProduct.imageZoom ?? 100}
          onClose={() => setImageProductId(null)}
          onRemove={() => {
            updateProduct(imageProduct.id, "image", "linear-gradient(135deg, #dbeafe, #f8fafc)");
            updateProduct(imageProduct.id, "imagePositionX", 50);
            updateProduct(imageProduct.id, "imagePositionY", 50);
            updateProduct(imageProduct.id, "imageZoom", 100);
            setImageProductId(null);
          }}
          onSave={(image, positionX, positionY, zoom) => {
            updateProduct(imageProduct.id, "image", image);
            updateProduct(imageProduct.id, "imagePositionX", positionX);
            updateProduct(imageProduct.id, "imagePositionY", positionY);
            updateProduct(imageProduct.id, "imageZoom", zoom);
            setImageProductId(null);
          }}
          productName={imageProduct.name}
        />
      ) : null}
    </aside>
  );
}

function ImageImportModal({
  currentImage,
  currentPositionX,
  currentPositionY,
  currentZoom,
  onClose,
  onRemove,
  onSave,
  productName,
}: {
  currentImage: string;
  currentPositionX: number;
  currentPositionY: number;
  currentZoom: number;
  onClose: () => void;
  onRemove: () => void;
  onSave: (image: string, positionX: number, positionY: number, zoom: number) => void;
  productName: string;
}) {
  const [preview, setPreview] = useState(currentImage);
  const [position, setPosition] = useState({ x: currentPositionX, y: currentPositionY });
  const [zoom, setZoom] = useState(currentZoom);
  const [error, setError] = useState("");
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; positionX: number; positionY: number } | null>(null);

  function startImageDrag(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      positionX: position.x,
      positionY: position.y,
    };
    moveImage(event, rect);
  }

  function moveImage(event: React.PointerEvent<HTMLDivElement>, rect = event.currentTarget.getBoundingClientRect()) {
    const dragStart = dragStartRef.current;

    if (!dragStart) {
      return;
    }

    const deltaX = ((event.clientX - dragStart.pointerX) / rect.width) * 100;
    const deltaY = ((event.clientY - dragStart.pointerY) / rect.height) * 100;

    setPosition({
      x: Math.round(clamp(dragStart.positionX - deltaX, 0, 100)),
      y: Math.round(clamp(dragStart.positionY - deltaY, 0, 100)),
    });
  }

  function importFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    if (file.size > 1_500_000) {
      setError("Use an image under 1.5 MB for local preview.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(`url("${reader.result}")`);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <div className="w-full max-w-md rounded-lg border border-[#d8dde5] bg-white shadow-2xl shadow-slate-950/20">
        <div className="border-[#e2e8f0] border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-[#111827]">Import product image</h2>
          <p className="mt-1 text-xs text-[#64748b]">{productName}</p>
        </div>
        <div className="p-4">
          <div
            className="relative aspect-[4/5] cursor-grab touch-none overflow-hidden rounded-md border border-[#d8dde5] bg-[#f8fafc] bg-cover active:cursor-grabbing"
            onPointerDown={startImageDrag}
            onPointerMove={(event) => {
              if (event.buttons === 1) {
                moveImage(event);
              }
            }}
            onPointerUp={() => {
              dragStartRef.current = null;
            }}
            style={{
              backgroundColor: "#f8fafc",
              backgroundImage: preview,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: `${zoom}%`,
            }}
          >
            <span
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#111827] shadow-[0_2px_8px_rgb(15_23_42_/_0.35)]"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1.5 text-xs font-medium text-[#334155] shadow-sm">
              Drag image to reposition
            </div>
          </div>
          <label className="mt-4 block text-xs font-medium text-[#475569]">
            Zoom
            <span className="mt-1.5 flex items-center gap-3">
              <input
                className="w-full accent-[#2563eb]"
                max={180}
                min={100}
                onChange={(event) => setZoom(Number(event.target.value))}
                step={5}
                type="range"
                value={zoom}
              />
              <span className="w-10 text-right font-mono text-xs text-[#64748b]">{zoom}%</span>
            </span>
          </label>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-6 text-center hover:bg-[#f1f5f9]">
            <span className="text-sm font-medium text-[#334155]">Choose image</span>
            <span className="mt-1 text-xs text-[#64748b]">PNG, JPG, WebP under 1.5 MB</span>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  importFile(file);
                }
              }}
              type="file"
            />
          </label>
          {error ? <p className="mt-3 text-xs font-medium text-[#b91c1c]">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-2 border-[#e2e8f0] border-t px-4 py-3">
          <button
            className="mr-auto rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            onClick={() => {
              setPosition({ x: 50, y: 50 });
              setZoom(100);
            }}
            type="button"
          >
            Reset
          </button>
          <button
            className="rounded-md border border-[#fecaca] bg-white px-3 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2]"
            onClick={onRemove}
            type="button"
          >
            Remove
          </button>
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-[#111827] px-3 py-2 text-xs font-medium text-white hover:bg-[#1f2937]"
            onClick={() => onSave(preview, position.x, position.y, zoom)}
            type="button"
          >
            Save image
          </button>
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
