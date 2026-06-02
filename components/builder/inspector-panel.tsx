"use client";

import { useRef, useState } from "react";
import { deleteProductImageAction, uploadProductImageAction } from "@/app/actions/images";
import { ColorTokenControl, GradientField, NumberField, RangeControl, TextField } from "@/components/builder/controls";
import { SectionInspector } from "@/components/builder/section-inspector";
import { sectionRegistry } from "@/lib/templater/registry";
import { useI18n } from "@/lib/i18n";
import type { Product, StoreTemplate, TemplateSection, ThemeTokens } from "@/lib/templater/schema";
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
  updateProduct: (productId: string, key: keyof Product, value: Product[keyof Product]) => void;
  updateSectionSetting: (sectionId: string, key: string, value: unknown) => void;
  updateTemplateField: <K extends "name" | "category">(key: K, value: StoreTemplate[K]) => void;
}) {
  const { t } = useI18n();
  const [imageProductId, setImageProductId] = useState<string | null>(null);
  const imageProduct = template.products.find((product) => product.id === imageProductId);

  return (
    <aside className="relative z-30 flex min-h-0 flex-col border-[#d8dde5] border-l bg-[#f8fafc]" data-tour="builder-inspector">
      <div className="shrink-0 border-[#e2e8f0] border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">{t("builder.inspector")}</h2>
          <p className="text-xs text-[#64748b]">{t("inspector.themeSubtitle")}</p>
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
              {inspectorTabLabel(tab, t)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {inspectorTab === "store" ? (
          <section className="px-4 py-4">
            <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.store")}</h3>
            <div className="mt-3 space-y-3">
              <TextField label={t("inspector.templateName")} onChange={(value) => updateTemplateField("name", value)} value={template.name} />
              <label className="block text-xs font-medium text-[#475569]">
                {t("inspector.category")}
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
              <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.themePresets")}</h3>
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
              <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.themeTokens")}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {colorControls.map((key) => (
                  <ColorTokenControl key={key} label={key} onChange={(value) => updateColor(key, value)} value={template.theme.colors[key]} />
                ))}
              </div>
            </section>

            <section className="border-[#e2e8f0] border-b px-4 py-4">
              <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.typography")}</h3>
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
              <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.layout")}</h3>
              <div className="mt-3 space-y-4">
                <RangeControl label={t("inspector.radius")} max={24} min={0} onChange={(value) => updateLayout("radius", value)} value={template.theme.layout.radius} />
                <RangeControl label={t("inspector.spacing")} max={32} min={10} onChange={(value) => updateLayout("spacing", value)} value={template.theme.layout.spacing} />
                <RangeControl
                  label={t("inspector.maxWidth")}
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
              <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.products")}</h3>
              <button
                className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={addProduct}
                type="button"
              >
                {t("inspector.addProduct")}
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {template.products.map((product) => (
                <details className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-sm" key={product.id}>
                  <summary className="cursor-pointer list-none">
                    <span className="flex items-center gap-3">
                      <span
                        className="h-14 w-11 shrink-0 rounded-md border border-[#e2e8f0] bg-[#f8fafc] bg-cover bg-center"
                        style={{
                          backgroundImage: product.image,
                          backgroundPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: `${product.imageZoom ?? 100}%`,
                        }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[#111827]">{product.name}</span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-[#64748b]">
                          <span>${product.price}</span>
                          <span>/</span>
                          <span>{product.category}</span>
                        </span>
                        <span
                          className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isImportedImage(product.image) ? "bg-[#dcfce7] text-[#166534]" : "bg-[#e2e8f0] text-[#64748b]"
                          }`}
                        >
                          {isImportedImage(product.image) ? t("inspector.image") : t("inspector.gradient")}
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
                      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">{t("inspector.details")}</p>
                      <div className="space-y-3">
                        <TextField label={t("inspector.name")} onChange={(value) => updateProduct(product.id, "name", value)} value={product.name} />
                        <TextField label={t("inspector.category")} onChange={(value) => updateProduct(product.id, "category", value)} value={product.category} />
                        <NumberField label={t("inspector.price")} min={0} onChange={(value) => updateProduct(product.id, "price", value)} value={product.price} />
                        <TextField label={t("inspector.badge")} onChange={(value) => updateProduct(product.id, "badge", value)} value={product.badge ?? ""} />
                      </div>
                    </div>
                    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.visual")}</p>
                        <span className="text-[11px] font-medium text-[#64748b]">
                          {isImportedImage(product.image) ? `${product.imageZoom ?? 100}% ${t("inspector.zoom").toLowerCase()}` : t("inspector.gradient")}
                        </span>
                      </div>
                      <GradientField label={t("inspector.image.placeholder")} onChange={(value) => updateProduct(product.id, "image", value)} value={product.image} />
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                          className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                          onClick={() => setImageProductId(product.id)}
                          type="button"
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                          onClick={() => {
                            updateProduct(product.id, "imagePositionX", 50);
                            updateProduct(product.id, "imagePositionY", 50);
                            updateProduct(product.id, "imageZoom", 100);
                          }}
                          type="button"
                        >
                          {t("common.center")}
                        </button>
                        <button
                          className="rounded-md border border-[#fecaca] bg-white px-2.5 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2]"
                          onClick={() => {
                            updateProduct(product.id, "image", "linear-gradient(135deg, #dbeafe, #f8fafc)");
                            updateProduct(product.id, "imagePositionX", 50);
                            updateProduct(product.id, "imagePositionY", 50);
                            updateProduct(product.id, "imageZoom", 100);
                            updateProduct(product.id, "imageStorage", undefined);
                            updateProduct(product.id, "imageKey", undefined);
                            if (product.imageStorage === "r2" && product.imageKey) {
                              void deleteProductImageAction(product.imageKey);
                            }
                          }}
                          type="button"
                        >
                          {t("common.clear")}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                        onClick={() => duplicateProduct(product.id)}
                        type="button"
                      >
                        {t("common.duplicate")}
                      </button>
                      <button
                        className="rounded-md border border-[#fecaca] bg-white px-2.5 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={template.products.length <= 1}
                        onClick={() => deleteProduct(product.id)}
                        type="button"
                      >
                        {t("common.delete")}
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
            <div className="rounded-md border border-[#d8dde5] bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.selectedSection")}</h3>
                  <p className="mt-1 truncate text-sm font-semibold text-[#111827]">{sectionRegistry[selectedSection.type].label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#64748b]">{sectionRegistry[selectedSection.type].description}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                    selectedSection.enabled ? "bg-[#dcfce7] text-[#166534]" : "bg-[#e2e8f0] text-[#64748b]"
                  }`}
                >
                  {selectedSection.enabled ? t("common.visible") : t("common.hidden")}
                </span>
              </div>
              <div className="mt-3 border-[#e2e8f0] border-t pt-3">
                <h3 className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.controls")}</h3>
                <p className="mt-1 text-sm font-medium">{selectedSection.name}</p>
                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  {sectionRegistry[selectedSection.type].editableSettings.join(", ")}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-[#e2e8f0] bg-white p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-[#475569]">{t("inspector.sectionActions")}</span>
                <button
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                    selectedSection.enabled ? "bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                  }`}
                  onClick={() => toggleSection(selectedSection.id)}
                  type="button"
                >
                  {selectedSection.enabled ? t("common.visible") : t("common.hidden")}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={homeSections[0]?.id === selectedSection.id}
                  onClick={() => moveSection(selectedSection.id, "up")}
                  type="button"
                >
                  {t("common.moveUp")}
                </button>
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={homeSections.at(-1)?.id === selectedSection.id}
                  onClick={() => moveSection(selectedSection.id, "down")}
                  type="button"
                >
                  {t("common.moveDown")}
                </button>
                <button
                  className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                  onClick={() => duplicateSection(selectedSection.id)}
                  type="button"
                >
                  {t("common.duplicate")}
                </button>
                <button
                  className="rounded-md border border-[#fecaca] bg-white px-2.5 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={homeSections.length <= 1}
                  onClick={() => deleteSection(selectedSection.id)}
                  type="button"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
            <SectionInspector section={selectedSection} updateSetting={updateSectionSetting} />
          </section>
        ) : null}

        {inspectorTab === "section" && !selectedSection ? (
          <section className="px-4 py-4">
            <div className="rounded-md border border-dashed border-[#cbd5e1] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#111827]">{t("inspector.noSection.title")}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">{t("inspector.noSection.body")}</p>
            </div>
          </section>
        ) : null}
      </div>
      {imageProduct ? (
        <ImageImportModal
          currentImage={imageProduct.image}
          currentPositionX={imageProduct.imagePositionX ?? 50}
          currentPositionY={imageProduct.imagePositionY ?? 50}
          currentZoom={imageProduct.imageZoom ?? 100}
          currentImageKey={imageProduct.imageKey}
          currentImageStorage={imageProduct.imageStorage}
          productId={imageProduct.id}
          onClose={() => setImageProductId(null)}
          onRemove={() => {
            updateProduct(imageProduct.id, "image", "linear-gradient(135deg, #dbeafe, #f8fafc)");
            updateProduct(imageProduct.id, "imagePositionX", 50);
            updateProduct(imageProduct.id, "imagePositionY", 50);
            updateProduct(imageProduct.id, "imageZoom", 100);
            updateProduct(imageProduct.id, "imageStorage", undefined);
            updateProduct(imageProduct.id, "imageKey", undefined);
            if (imageProduct.imageStorage === "r2" && imageProduct.imageKey) {
              void deleteProductImageAction(imageProduct.imageKey);
            }
            setImageProductId(null);
          }}
          onSave={(image, positionX, positionY, zoom, imageKey) => {
            updateProduct(imageProduct.id, "image", image);
            updateProduct(imageProduct.id, "imagePositionX", positionX);
            updateProduct(imageProduct.id, "imagePositionY", positionY);
            updateProduct(imageProduct.id, "imageZoom", zoom);
            updateProduct(imageProduct.id, "imageStorage", imageKey ? "r2" : undefined);
            updateProduct(imageProduct.id, "imageKey", imageKey);
            if (imageProduct.imageStorage === "r2" && imageProduct.imageKey && imageProduct.imageKey !== imageKey) {
              void deleteProductImageAction(imageProduct.imageKey);
            }
            setImageProductId(null);
          }}
          templateId={template.id}
          productName={imageProduct.name}
        />
      ) : null}
    </aside>
  );
}

function ImageImportModal({
  currentImage,
  currentImageKey,
  currentImageStorage,
  currentPositionX,
  currentPositionY,
  currentZoom,
  onClose,
  onRemove,
  onSave,
  productId,
  productName,
  templateId,
}: {
  currentImage: string;
  currentImageKey?: string;
  currentImageStorage?: "r2";
  currentPositionX: number;
  currentPositionY: number;
  currentZoom: number;
  onClose: () => void;
  onRemove: () => void;
  onSave: (image: string, positionX: number, positionY: number, zoom: number, imageKey?: string) => void;
  productId: string;
  productName: string;
  templateId: string;
}) {
  const { t } = useI18n();
  const [preview, setPreview] = useState(currentImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageStatus, setImageStatus] = useState("");
  const [position, setPosition] = useState({ x: currentPositionX, y: currentPositionY });
  const [zoom, setZoom] = useState(currentZoom);
  const [error, setError] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "preparing" | "uploading" | "failed" | "saved">("idle");
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

  async function importFile(file: File) {
    setError("");
    setImageStatus("");

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError(t("inspector.image.formatError"));
      return;
    }

    if (file.size > 20_000_000) {
      setError(t("inspector.image.largeError"));
      return;
    }

    setUploadState("preparing");

    try {
      const preparedImage = await prepareImageForUpload(file);
      setPreview(`url("${preparedImage.dataUrl}")`);
      setSelectedFile(preparedImage.file);
      setImageStatus(preparedImage.message);
      setUploadState("idle");
    } catch (error) {
      setUploadState("failed");
      setError(error instanceof Error ? error.message : t("inspector.image.clearError"));
    }
  }

  async function saveImage() {
    if (!selectedFile) {
      onSave(preview, position.x, position.y, zoom, currentImageStorage === "r2" ? currentImageKey : undefined);
      return;
    }

    setUploadState("uploading");
    setError("");

    const formData = new FormData();
    formData.set("file", selectedFile);
    formData.set("templateId", templateId);
    formData.set("productId", productId);

    const result = await uploadProductImageAction(formData);

    if (!result.imageUrl) {
      setUploadState("failed");
      setError(result.error ?? t("inspector.image.uploadError"));
      return;
    }

    setUploadState("saved");
    onSave(`url("${result.imageUrl}")`, position.x, position.y, zoom, result.imageKey);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <div className="w-full max-w-md rounded-lg border border-[#d8dde5] bg-white shadow-2xl shadow-slate-950/20">
        <div className="border-[#e2e8f0] border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-[#111827]">{t("inspector.image.product")}</h2>
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
              backgroundRepeat: "no-repeat",
              backgroundSize: `${zoom}%`,
            }}
          >
            <span
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#111827] shadow-[0_2px_8px_rgb(15_23_42_/_0.35)]"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            />
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md bg-white/90 px-2.5 py-1.5 text-xs font-medium text-[#334155] shadow-sm">
              {t("inspector.image.cropHint")}
            </div>
          </div>
          <label className="mt-4 block text-xs font-medium text-[#475569]">
            {t("inspector.zoom")}
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
            <span className="text-sm font-medium text-[#334155]">{isImportedImage(preview) ? t("inspector.image.replace") : t("inspector.image.choose")}</span>
            <span className="mt-1 text-xs text-[#64748b]">{t("inspector.image.help")}</span>
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
          {imageStatus ? (
            <p className="mt-3 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-xs font-medium text-[#166534]">
              {imageStatus}
            </p>
          ) : null}
          {uploadState === "preparing" ? (
            <p className="mt-3 rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-xs font-medium text-[#1d4ed8]">
              {t("inspector.image.preparing")}
            </p>
          ) : null}
          {uploadState === "failed" && selectedFile ? (
            <p className="mt-3 rounded-md border border-[#fed7aa] bg-[#fff7ed] px-3 py-2 text-xs font-medium text-[#9a3412]">
              {t("inspector.image.uploadFailed")}
            </p>
          ) : null}
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
            {t("common.reset")}
          </button>
          <button
            className="rounded-md border border-[#fecaca] bg-white px-3 py-2 text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2]"
            onClick={onRemove}
            type="button"
          >
            {t("common.remove")}
          </button>
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            onClick={onClose}
            type="button"
          >
            {t("common.cancel")}
          </button>
          <button
            className="rounded-md bg-[#111827] px-3 py-2 text-xs font-medium text-white hover:bg-[#1f2937]"
            disabled={uploadState === "preparing" || uploadState === "uploading"}
            onClick={saveImage}
            type="button"
          >
            {uploadState === "preparing"
              ? t("inspector.image.preparingButton")
              : uploadState === "uploading"
                ? t("inspector.image.uploading")
                : uploadState === "failed"
                  ? t("inspector.image.retry")
                  : t("inspector.image.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function prepareImageForUpload(file: File) {
  const image = await loadImage(file);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("This browser could not prepare the image.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, "image/webp", 0.84);

  if (blob.size > 5_000_000) {
    throw new Error("This image is still over 5 MB after compression. Try a smaller image.");
  }

  const preparedFile =
    blob.size < file.size || file.size > 5_000_000
      ? new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" })
      : file;
  const dataUrl = await readFileAsDataUrl(preparedFile);
  const originalSize = formatFileSize(file.size);
  const finalSize = formatFileSize(preparedFile.size);
  const dimensions = `${width}x${height}`;
  const message =
    preparedFile === file
      ? `Ready to upload: ${dimensions}, ${finalSize}.`
      : `Compressed from ${originalSize} to ${finalSize} at ${dimensions}.`;

  return {
    dataUrl,
    file: preparedFile,
    message,
  };
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read this image."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Could not compress this image."));
      },
      type,
      quality,
    );
  });
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not preview this image."));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(size: number) {
  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1_000))} KB`;
}

function isImportedImage(image: string) {
  return image.startsWith("url(");
}

function inspectorTabLabel(tab: InspectorTab, t: ReturnType<typeof useI18n>["t"]) {
  const labels: Record<InspectorTab, string> = {
    products: t("inspector.items"),
    section: t("builder.sections"),
    store: t("inspector.store"),
    theme: t("inspector.theme"),
  };

  return labels[tab];
}
