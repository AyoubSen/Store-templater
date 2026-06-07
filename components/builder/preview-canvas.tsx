"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ContextualHelp } from "@/components/contextual-help";
import { StorefrontPreview } from "@/components/storefront-preview";
import type { PreviewCartItem } from "@/components/storefront-preview";
import { useI18n } from "@/lib/i18n";
import { useOnClickOutside } from "@/lib/use-on-click-outside";
import { sectionRegistry } from "@/lib/templater/registry";
import { isShareActionBusy, type ShareActionState } from "@/lib/templater/share-actions";
import type { StoreTemplate, TemplatePage, TemplateSection } from "@/lib/templater/schema";

export type Device = "desktop" | "tablet" | "mobile";

export function PreviewCanvas({
  activeProductId,
  addCartItem,
  canRedo,
  canUndo,
  cartItems,
  device,
  exportNextProject,
  exportStaticStorefront,
  exportTemplatePackage,
  openProduct,
  previewStyle,
  redoTemplateChange,
  resetTemplate,
  selectedPage,
  selectedSection,
  selectedSectionId,
  selectPage,
  selectSection,
  setDevice,
  shareEnabled,
  shareLink,
  shareActionState,
  sharedAt,
  shareStatus,
  shareUpdatedAt,
  setZoom,
  template,
  toggleShareLink,
  copyShareLink,
  undoTemplateChange,
  zoom,
}: {
  activeProductId?: string;
  addCartItem: (productId: string) => void;
  canRedo: boolean;
  canUndo: boolean;
  cartItems: PreviewCartItem[];
  device: Device;
  exportNextProject: () => void;
  exportStaticStorefront: () => void;
  exportTemplatePackage: () => void;
  openProduct: (productId: string) => void;
  previewStyle: React.CSSProperties;
  redoTemplateChange: () => void;
  resetTemplate: () => void;
  selectedPage?: TemplatePage;
  selectedSection?: TemplateSection;
  selectedSectionId: string;
  selectPage: (pageId: string) => void;
  selectSection: (sectionId: string) => void;
  setDevice: (device: Device) => void;
  shareEnabled: boolean;
  shareLink?: string;
  shareActionState: ShareActionState;
  sharedAt?: string | null;
  shareStatus?: string;
  shareUpdatedAt?: string | null;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  template: StoreTemplate;
  toggleShareLink: () => void;
  copyShareLink: () => void;
  undoTemplateChange: () => void;
  zoom: number;
}) {
  const { t } = useI18n();
  const [isSharePanelOpen, setIsSharePanelOpen] = useState(false);
  const [isMorePanelOpen, setIsMorePanelOpen] = useState(false);
  const sharePanelRef = useRef<HTMLDivElement | null>(null);
  const morePanelRef = useRef<HTMLDivElement | null>(null);
  const closeFloatingPanels = useCallback(() => {
    setIsSharePanelOpen(false);
    setIsMorePanelOpen(false);
  }, []);
  const floatingPanelRefs = useMemo(() => [sharePanelRef, morePanelRef], []);
  useOnClickOutside(isSharePanelOpen || isMorePanelOpen, closeFloatingPanels, floatingPanelRefs);

  return (
    <section className="flex min-h-0 flex-col bg-[#eef0f3]" data-tour="builder-preview">
      <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-[#d8dde5] border-b bg-white px-4 py-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{selectedPage?.name ?? "Page"}</p>
          <p className="text-xs text-[#64748b]">{t("builder.previewSubtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            aria-disabled={!canUndo}
            className={`min-h-9 whitespace-nowrap rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] ${
              canUndo ? "" : "cursor-not-allowed opacity-40"
            }`}
            onClick={() => {
              if (canUndo) {
                undoTemplateChange();
              }
            }}
            type="button"
          >
            {t("builder.undo")}
          </button>
          <button
            aria-disabled={!canRedo}
            className={`min-h-9 whitespace-nowrap rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] ${
              canRedo ? "" : "cursor-not-allowed opacity-40"
            }`}
            onClick={() => {
              if (canRedo) {
                redoTemplateChange();
              }
            }}
            type="button"
          >
            {t("builder.redo")}
          </button>
          <div className="flex rounded-md border border-[#d8dde5] bg-[#f8fafc] p-0.5" data-tour="builder-devices">
            {(["desktop", "tablet", "mobile"] as const).map((option) => (
              <button
                className={`min-h-8 rounded px-2.5 py-1.5 text-xs font-medium capitalize ${
                  device === option ? "bg-white text-[#111827] shadow-sm" : "text-[#64748b] hover:text-[#111827]"
                }`}
                key={option}
                onClick={() => setDevice(option)}
                type="button"
              >
                {deviceShortLabel(option, t)}
              </button>
            ))}
          </div>
          <Link
            className="inline-flex min-h-9 items-center whitespace-nowrap rounded-md bg-[#111827] px-3 py-2 text-xs font-medium text-white hover:bg-[#1f2937]"
            href={`/preview/${template.id}?page=${encodeURIComponent(selectedPage?.slug ?? selectedPage?.id ?? "")}`}
            target="_blank"
            title={t("builder.preview")}
          >
            {t("builder.openStorefront")}
          </Link>
          <div className="relative" data-tour="builder-publish" ref={sharePanelRef}>
            <button
              className={`min-h-9 whitespace-nowrap rounded-md border px-3 py-2 text-xs font-semibold ${
                shareEnabled
                  ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7]"
                  : "border-[#d8dde5] bg-white text-[#334155] hover:bg-[#f1f5f9]"
              }`}
              onClick={() => {
                setIsMorePanelOpen(false);
                setIsSharePanelOpen((current) => !current);
              }}
              type="button"
            >
              {shareEnabled ? t("builder.published") : t("builder.publish")}
            </button>
            {isSharePanelOpen ? (
              <SharePanel
                copyShareLink={copyShareLink}
                shareEnabled={shareEnabled}
                shareLink={shareLink}
                shareActionState={shareActionState}
                sharedAt={sharedAt}
                shareStatus={shareStatus}
                shareUpdatedAt={shareUpdatedAt}
                toggleShareLink={toggleShareLink}
              />
            ) : null}
          </div>
          <div className="relative" ref={morePanelRef}>
            <button
              className="min-h-9 whitespace-nowrap rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => {
                setIsSharePanelOpen(false);
                setIsMorePanelOpen((current) => !current);
              }}
              type="button"
            >
              {t("builder.templateActions")}
            </button>
            {isMorePanelOpen ? (
              <MorePanel
                exportNextProject={exportNextProject}
                exportStaticStorefront={exportStaticStorefront}
                exportTemplatePackage={exportTemplatePackage}
                resetTemplate={resetTemplate}
              />
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:18px_18px] p-6">
        <div className="w-full max-w-7xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748b]">
            <span>{deviceLabel(device)}</span>
            <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
              <span>Zoom</span>
              <button
                className="min-h-7 rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
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
                className="min-h-7 rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setZoom((current) => Math.min(120, current + 10))}
                type="button"
              >
                +
              </button>
              <button
                className="min-h-7 rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setZoom(90)}
                type="button"
              >
                {zoom}%
              </button>
            </div>
            <span className="min-w-0 truncate">{selectedSection ? sectionRegistry[selectedSection.type].label : t("builder.noSection")}</span>
          </div>
          <div className="mb-3 flex items-start gap-2 rounded-md border border-[#d8dde5] bg-white/90 px-3 py-2 text-xs text-[#475569] shadow-sm">
            <div className="min-w-0 flex-1 break-words leading-5">
              <span className="font-semibold text-[#111827]">{t("previewHint.label")}</span> {t("previewHint.text")}
            </div>
            <ContextualHelp body={t("builder.previewHelp.body")} title={t("builder.previewHelp.title")} />
          </div>
          <StorePreview
            device={device}
            activeProductId={activeProductId}
            addCartItem={addCartItem}
            cartItems={cartItems}
            openProduct={openProduct}
            pageId={selectedPage?.id}
            selectPage={selectPage}
            selectedSectionId={selectedSectionId}
            style={previewStyle}
            selectSection={selectSection}
            template={template}
            zoom={zoom}
          />
        </div>
      </div>
    </section>
  );
}

function SharePanel({
  copyShareLink,
  shareEnabled,
  shareLink,
  shareActionState,
  sharedAt,
  shareStatus,
  shareUpdatedAt,
  toggleShareLink,
}: {
  copyShareLink: () => void;
  shareEnabled: boolean;
  shareLink?: string;
  shareActionState: ShareActionState;
  sharedAt?: string | null;
  shareStatus?: string;
  shareUpdatedAt?: string | null;
  toggleShareLink: () => void;
}) {
  const { t } = useI18n();
  const isBusy = isShareActionBusy(shareActionState);
  const toggleLabel =
    shareActionState === "publishing"
      ? t("share.publishing")
      : shareActionState === "unpublishing"
        ? t("share.unpublishing")
        : shareEnabled
          ? t("share.unpublish")
          : t("share.publishLink");
  const copyLabel =
    shareActionState === "copying" ? t("share.copying") : shareActionState === "copied" ? t("share.copied") : t("share.copyLink");

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[min(320px,calc(100vw-32px))] rounded-lg border border-[#d8dde5] bg-white p-4 text-left shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#111827]">{t("share.publicSharing")}</p>
          <p className="mt-1 text-xs leading-5 text-[#64748b]">{t("share.publicSharingBody")}</p>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-xs font-semibold ${
            shareEnabled ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]" : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]"
          }`}
        >
          {shareEnabled ? t("builder.published") : t("common.private")}
        </span>
      </div>

      {shareEnabled && shareLink ? (
        <div className="mt-4 rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
          <p className="truncate text-xs font-medium text-[#334155]">{shareLink}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className={`min-h-9 rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9] ${
                isBusy ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isBusy}
              onClick={copyShareLink}
              type="button"
            >
              {copyLabel}
            </button>
            <Link
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-[#111827] px-3 py-2 text-center text-xs font-medium leading-4 text-white hover:bg-[#1f2937]"
              href={shareLink}
              target="_blank"
            >
              {t("share.openPreview")}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-4 space-y-1.5 text-xs text-[#64748b]">
        <p className={shareActionState === "failed" ? "text-[#b91c1c]" : ""}>{shareStatus}</p>
        <p>{t("share.lastSaved")} {formatShareDate(shareUpdatedAt, t("common.notYet"))}</p>
        <p>{t("share.lastPublished")} {formatShareDate(sharedAt, t("common.notYet"))}</p>
      </div>

      <button
        className={`mt-4 min-h-9 w-full rounded-md px-3 py-2 text-xs font-semibold leading-4 ${
          shareEnabled ? "border border-[#fecaca] bg-white text-[#b91c1c] hover:bg-[#fef2f2]" : "bg-[#111827] text-white hover:bg-[#1f2937]"
        } ${isBusy ? "cursor-not-allowed opacity-60" : ""}`}
        disabled={isBusy}
        onClick={toggleShareLink}
        type="button"
      >
        {toggleLabel}
      </button>
    </div>
  );
}

function MorePanel({
  exportNextProject,
  exportStaticStorefront,
  exportTemplatePackage,
  resetTemplate,
}: {
  exportNextProject: () => void;
  exportStaticStorefront: () => void;
  exportTemplatePackage: () => void;
  resetTemplate: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[min(288px,calc(100vw-32px))] rounded-lg border border-[#d8dde5] bg-white p-3 text-left shadow-2xl shadow-slate-950/20">
      <p className="px-1 text-xs font-semibold uppercase text-[#64748b]">{t("builder.templateActions")}</p>
      <p className="mt-1 px-1 text-xs leading-5 text-[#64748b]">
        Export files or reset this template. Publishing lives in Share link.
      </p>
      <div className="mt-2 grid gap-2">
        <button
          className="rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-left text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
          onClick={exportTemplatePackage}
          type="button"
        >
          Download editing package
        </button>
        <button
          className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-left text-xs font-medium text-[#1d4ed8] hover:bg-[#dbeafe]"
          onClick={exportStaticStorefront}
          type="button"
        >
          Export static site
        </button>
        <button
          className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-left text-xs font-medium text-[#15803d] hover:bg-[#dcfce7]"
          onClick={exportNextProject}
          type="button"
        >
          Export Next app
        </button>
        <button
          className="rounded-md border border-[#fecaca] bg-white px-3 py-2 text-left text-xs font-medium text-[#b91c1c] hover:bg-[#fef2f2]"
          onClick={resetTemplate}
          type="button"
        >
          Reset active template
        </button>
      </div>
    </div>
  );
}

function formatShareDate(value: string | null | undefined, fallback = "Not yet") {
  if (!value) {
    return fallback;
  }

  return value.replace("T", " ").slice(0, 16);
}

function deviceLabel(device: Device) {
  const labels: Record<Device, string> = {
    desktop: "Desktop 1440px",
    tablet: "Tablet 768px",
    mobile: "Mobile 390px",
  };

  return labels[device];
}

function deviceShortLabel(device: Device, t: (key: "builder.device.desktop" | "builder.device.tablet" | "builder.device.mobile") => string) {
  const labels: Record<Device, ReturnType<typeof t>> = {
    desktop: t("builder.device.desktop"),
    tablet: t("builder.device.tablet"),
    mobile: t("builder.device.mobile"),
  };

  return labels[device];
}

function StorePreview({
  activeProductId,
  addCartItem,
  cartItems,
  device,
  openProduct,
  pageId,
  selectPage,
  selectSection,
  selectedSectionId,
  style,
  template,
  zoom,
}: {
  activeProductId?: string;
  addCartItem: (productId: string) => void;
  cartItems: PreviewCartItem[];
  device: Device;
  openProduct: (productId: string) => void;
  pageId?: string;
  selectPage: (pageId: string) => void;
  selectSection: (sectionId: string) => void;
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
          <StorefrontPreview
            activeProductId={activeProductId}
            cartItems={cartItems}
            onAddToCart={addCartItem}
            onNavigatePage={selectPage}
            onOpenProduct={openProduct}
            onSelectSection={selectSection}
            pageId={pageId}
            previewDevice={device}
            selectedSectionId={selectedSectionId}
            template={template}
          />
        </div>
      </div>
    </div>
  );
}
