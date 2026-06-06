import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useState } from "react";
import { AuthControls } from "@/components/auth-controls";
import { ContextualHelp } from "@/components/contextual-help";
import { TemplateCreationFlow } from "@/components/template-creation-flow";
import { useI18n } from "@/lib/i18n";
import { betaLimits, templateLimitMessage } from "@/lib/templater/limits";
import { pageTypeLabels, pageTypes } from "@/lib/templater/page-defaults";
import { sectionRegistry } from "@/lib/templater/registry";
import type { PageType, SectionType, StoreTemplate, TemplatePage, TemplateSection } from "@/lib/templater/schema";
import { syncStatusClassName, syncStatusLabel, type TemplateSyncState } from "@/lib/templater/sync-status";
import type { TemplateCreationOptions } from "@/lib/templater/starter-templates";

export function SectionSidebar({
  addSection,
  activeTemplateId,
  addPage,
  createTemplate,
  deletePage,
  deleteTemplate,
  duplicateTemplate,
  onStartTour,
  pages,
  reorderSections,
  saveState,
  saveStatusMessage,
  sectionGroups,
  sections,
  selectedPageId,
  selectedSectionId,
  selectPage,
  setSelectedSectionId,
  selectTemplate,
  template,
  templates,
  updatePageField,
}: {
  addSection: (type: SectionType) => void;
  activeTemplateId: string;
  addPage: (type: PageType) => void;
  createTemplate: (options: TemplateCreationOptions) => void;
  deletePage: (pageId: string) => void;
  deleteTemplate: (templateId: string) => void;
  duplicateTemplate: () => void;
  onStartTour: () => void;
  pages: TemplatePage[];
  reorderSections: (sectionIds: string[]) => void;
  saveState: TemplateSyncState;
  saveStatusMessage?: string;
  sectionGroups: Array<{ label: string; sections: SectionType[] }>;
  sections: TemplateSection[];
  selectedPageId: string;
  selectedSectionId: string;
  selectPage: (pageId: string) => void;
  setSelectedSectionId: (sectionId: string) => void;
  selectTemplate: (templateId: string) => void;
  template: StoreTemplate;
  templates: StoreTemplate[];
  updatePageField: <K extends "name" | "slug" | "seoTitle" | "status">(pageId: string, key: K, value: TemplatePage[K]) => void;
}) {
  const { t } = useI18n();
  const [isStarterPickerOpen, setIsStarterPickerOpen] = useState(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [isTemplateActionsOpen, setIsTemplateActionsOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<"pages" | "sections" | "library">("sections");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const sectionIds = sections.map((section) => section.id);
  const selectedPage = pages.find((page) => page.id === selectedPageId);
  const selectedSection = sections.find((section) => section.id === selectedSectionId);
  const hasReachedTemplateLimit = templates.length >= betaLimits.maxTemplatesPerUser;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sectionIds.indexOf(String(active.id));
    const newIndex = sectionIds.indexOf(String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    reorderSections(arrayMove(sectionIds, oldIndex, newIndex));
  }

  return (
    <aside className="flex min-h-0 flex-col border-[#d8dde5] border-r bg-[#f8fafc]" data-tour="builder-sidebar">
      <div className="shrink-0 border-[#e2e8f0] border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-[#111827] text-[11px] font-semibold text-white">
            ST
          </div>
          <div>
            <h1 className="text-sm font-semibold">Store Templater</h1>
            <p className="text-[11px] text-[#64748b]">{t("builder.templateWorkspace")}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[#d8dde5] bg-white px-2.5 text-center text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9]"
            onClick={onStartTour}
            type="button"
          >
            {t("builder.tour")}
          </button>
          <AuthControls />
        </div>
      </div>

      <div className="shrink-0 border-[#e2e8f0] border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{template.name}</p>
            <p className="truncate text-xs capitalize text-[#64748b]">{template.category} template</p>
          </div>
          <span className={`shrink-0 rounded-md border px-2 py-1 text-[11px] font-medium ${syncStatusClassName(saveState)}`} title={saveStatusMessage}>
            {syncStatusLabel(saveState, t)}
          </span>
        </div>
        {saveStatusMessage ? <p className="mt-2 text-[11px] leading-4 text-[#64748b]">{saveStatusMessage}</p> : null}
        <div className="mt-3">
          <button
            className="flex min-h-9 w-full items-center justify-between gap-3 rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            onClick={() => setIsTemplateActionsOpen((current) => !current)}
            type="button"
          >
            <span className="min-w-0 truncate">{t("builder.manageTemplates")}</span>
            <span className="shrink-0 text-[#94a3b8]">{isTemplateActionsOpen ? t("builder.hide") : t("builder.show")}</span>
          </button>
          {isTemplateActionsOpen ? (
            <div className="mt-2 space-y-2 rounded-md border border-[#e2e8f0] bg-white p-2">
              <select
                className="w-full rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium text-[#334155]"
                onChange={(event) => selectTemplate(event.target.value)}
                value={activeTemplateId}
              >
                {templates.map((storedTemplate) => (
                  <option key={storedTemplate.id} value={storedTemplate.id}>
                    {storedTemplate.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  className="inline-flex min-h-8 items-center justify-center rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-center text-[11px] font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9]"
                  href="/templates"
                  title={t("builder.manageTemplates")}
                >
                  {t("common.open")}
                </Link>
                <button
                  className="min-h-8 rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-[11px] font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={hasReachedTemplateLimit}
                  onClick={() => setIsStarterPickerOpen(true)}
                  title={hasReachedTemplateLimit ? templateLimitMessage() : undefined}
                  type="button"
                >
                  {t("builder.new")}
                </button>
                <button
                  className="min-h-8 rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-[11px] font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={hasReachedTemplateLimit}
                  onClick={duplicateTemplate}
                  title={hasReachedTemplateLimit ? templateLimitMessage() : undefined}
                  type="button"
                >
                  {t("common.copy")}
                </button>
                <button
                  aria-disabled={templates.length <= 1}
                  className={`min-h-8 rounded-md border border-[#fecaca] bg-white px-2 py-1.5 text-[11px] font-medium leading-4 text-[#b91c1c] hover:bg-[#fef2f2] ${
                    templates.length <= 1 ? "cursor-not-allowed opacity-40" : ""
                  }`}
                  onClick={() => {
                    if (templates.length > 1) {
                      deleteTemplate(activeTemplateId);
                    }
                  }}
                  type="button"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-[#e2e8f0] border-b bg-white px-3 py-2" data-tour="builder-sidebar-modes">
        <div className="grid grid-cols-3 rounded-md bg-[#f1f5f9] p-0.5">
          {[
            { label: t("builder.pages"), value: "pages" },
            { label: t("builder.sections"), value: "sections" },
            { label: t("builder.add"), value: "library" },
          ].map((item) => (
            <button
              className={`rounded px-2 py-1.5 text-xs font-semibold ${
                sidebarMode === item.value ? "bg-white text-[#111827] shadow-sm" : "text-[#64748b] hover:text-[#111827]"
              }`}
              key={item.value}
              onClick={() => setSidebarMode(item.value as typeof sidebarMode)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {sidebarMode === "pages" ? <section className="px-3 py-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="text-xs font-semibold uppercase text-[#475569]">{t("builder.pages")}</h2>
              <ContextualHelp body={t("builder.pagesHelp.body")} title={t("builder.pagesHelp.title")} />
            </div>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#64748b]">{pages.length}</span>
          </div>
          <div className="space-y-1">
            {pages.map((page) => (
              <PageRow
                canDelete={pages.length > 1}
                isSelected={selectedPageId === page.id}
                key={page.id}
                onDelete={() => deletePage(page.id)}
                onSelect={() => selectPage(page.id)}
                page={page}
              />
            ))}
          </div>
          <details className="mt-3 rounded-md border border-[#e2e8f0] bg-white p-2">
            <summary className="cursor-pointer list-none text-xs font-semibold text-[#475569]">{t("builder.addPage")}</summary>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {pageTypes.map((type) => {
                const existingPage = pages.find((page) => page.type === type);

                return (
                  <button
                    className="min-h-8 rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9]"
                    key={type}
                    onClick={() => addPage(type)}
                    type="button"
                  >
                    {existingPage ? pageTypeLabels[type] : `+ ${pageTypeLabels[type]}`}
                  </button>
                );
              })}
            </div>
          </details>
          {selectedPage ? (
            <div className="mt-3">
              <button
                className="flex min-h-9 w-full items-center justify-between gap-3 rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-left text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setIsPageSettingsOpen((isOpen) => !isOpen)}
                type="button"
              >
                <span className="min-w-0 truncate">Page settings</span>
                <span className="shrink-0 text-[#94a3b8]">{isPageSettingsOpen ? t("builder.hide") : t("builder.show")}</span>
              </button>
              {isPageSettingsOpen ? <PageSettings page={selectedPage} updatePageField={updatePageField} /> : null}
            </div>
          ) : null}
        </section> : null}

        {sidebarMode === "sections" ? <section className="px-3 py-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase text-[#475569]">{t("builder.sections")}</h2>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#64748b]">{sections.length}</span>
          </div>
          {selectedSection ? (
            <div className="mb-3 rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2">
              <p className="text-[11px] font-semibold uppercase text-[#2563eb]">{t("builder.selectedSection")}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-[#1e293b]">{sectionRegistry[selectedSection.type].label}</p>
              <p className="mt-0.5 truncate text-xs text-[#64748b]">{sectionPreviewLabel(selectedSection)}</p>
            </div>
          ) : null}
          <DndContext id="section-sidebar-sortable" onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {sections.map((section) => (
                  <SortableSectionRow
                    isSelected={selectedSectionId === section.id}
                    key={section.id}
                    section={section}
                    setSelectedSectionId={setSelectedSectionId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section> : null}

        {sidebarMode === "library" ? <section className="px-3 py-4" data-tour="builder-section-library">
          <div className="mb-2 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase text-[#475569]">{t("builder.addSection")}</h2>
              <ContextualHelp body={t("builder.addHelp.body")} title={t("builder.addHelp.title")} />
            </div>
            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              Inserts after {selectedSection ? sectionRegistry[selectedSection.type].label : "the selected block"}.
            </p>
          </div>
            <div className="mt-3 space-y-3">
              {sectionGroups.map((group) => (
                <details className="rounded-md border border-[#e2e8f0] bg-white p-2" key={group.label} open={group === sectionGroups[0]}>
                  <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase text-[#64748b]">{group.label}</summary>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {group.sections.map((type) => (
                      <button
                        className="min-h-12 rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-2 text-left hover:border-[#93c5fd] hover:bg-[#eff6ff]"
                        key={type}
                        onClick={() => {
                          addSection(type);
                          setSidebarMode("sections");
                        }}
                        type="button"
                      >
                        <span className="block text-xs font-semibold text-[#334155]">{sectionRegistry[type].label}</span>
                        <span className="mt-0.5 line-clamp-1 block text-[11px] leading-4 text-[#64748b]">
                          {sectionRegistry[type].description}
                        </span>
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
        </section> : null}
      </div>
      {isStarterPickerOpen ? (
        <TemplateCreationFlow
          onClose={() => setIsStarterPickerOpen(false)}
          onCreate={(options) => {
            createTemplate(options);
            setIsStarterPickerOpen(false);
          }}
        />
      ) : null}
    </aside>
  );
}

function PageRow({
  canDelete,
  isSelected,
  onDelete,
  onSelect,
  page,
}: {
  canDelete: boolean;
  isSelected: boolean;
  onDelete: () => void;
  onSelect: () => void;
  page: TemplatePage;
}) {
  const { t } = useI18n();

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1 rounded-md border ${
        isSelected ? "border-[#2563eb] bg-[#eff6ff]" : "border-transparent hover:border-[#e2e8f0] hover:bg-white"
      }`}
    >
      <button className="min-w-0 px-3 py-2 text-left" onClick={onSelect} type="button">
        <span className="flex min-w-0 items-center gap-2">
          <span className="block truncate text-sm font-medium text-[#1f2937]">{page.name}</span>
          {page.status === "draft" ? (
            <span className="rounded-full bg-[#fef3c7] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#92400e]">{t("common.draft")}</span>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate font-mono text-xs text-[#64748b]">{page.slug}</span>
      </button>
      <button
        aria-disabled={!canDelete}
        className={`mr-1 rounded px-2 py-1 text-[11px] font-semibold text-[#b91c1c] hover:bg-[#fef2f2] ${
          canDelete ? "" : "cursor-not-allowed opacity-35"
        }`}
        onClick={() => {
          if (canDelete) {
            onDelete();
          }
        }}
        type="button"
      >
        {t("common.delete")}
      </button>
    </div>
  );
}

function PageSettings({
  page,
  updatePageField,
}: {
  page: TemplatePage;
  updatePageField: <K extends "name" | "slug" | "seoTitle" | "status">(pageId: string, key: K, value: TemplatePage[K]) => void;
}) {
  return (
    <div className="mt-4 rounded-md border border-[#e2e8f0] bg-white p-3">
      <p className="text-xs font-semibold uppercase text-[#475569]">Page settings</p>
      <div className="mt-3 space-y-2">
        <label className="block text-[11px] font-medium text-[#64748b]">
          Name
          <input
            className="mt-1 w-full rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-xs text-[#111827]"
            onChange={(event) => updatePageField(page.id, "name", event.target.value)}
            value={page.name}
          />
        </label>
        <label className="block text-[11px] font-medium text-[#64748b]">
          Slug
          <input
            className="mt-1 w-full rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 font-mono text-xs text-[#111827]"
            onChange={(event) => updatePageField(page.id, "slug", normalizeSlug(event.target.value))}
            value={page.slug}
          />
        </label>
        <label className="block text-[11px] font-medium text-[#64748b]">
          SEO title
          <input
            className="mt-1 w-full rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-xs text-[#111827]"
            onChange={(event) => updatePageField(page.id, "seoTitle", event.target.value)}
            value={page.seoTitle}
          />
        </label>
        <label className="block text-[11px] font-medium text-[#64748b]">
          Status
          <select
            className="mt-1 w-full rounded-md border border-[#d8dde5] bg-white px-2 py-1.5 text-xs text-[#111827]"
            onChange={(event) => updatePageField(page.id, "status", event.target.value as TemplatePage["status"])}
            value={page.status}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function normalizeSlug(value: string) {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-/]/g, "");

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function SortableSectionRow({
  isSelected,
  section,
  setSelectedSectionId,
}: {
  isSelected: boolean;
  section: TemplateSection;
  setSelectedSectionId: (sectionId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const registryItem = sectionRegistry[section.type];
  const editableCount = registryItem.editableSettings.length;

  return (
    <div
      className={isDragging ? "relative z-10 opacity-80" : undefined}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        className={`w-full rounded-md border px-3 py-2.5 text-left transition ${
          isSelected
            ? "border-[#2563eb] bg-[#eff6ff] shadow-[inset_3px_0_0_#2563eb]"
            : "border-transparent bg-transparent hover:border-[#e2e8f0] hover:bg-white"
        }`}
        onClick={() => setSelectedSectionId(section.id)}
        type="button"
      >
        <span className="flex items-start gap-2">
          <span
            aria-label={`Drag ${registryItem.label}`}
            className="mt-0.5 cursor-grab select-none rounded px-1 text-sm leading-5 text-[#94a3b8] active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            ::
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-[#1f2937]">{registryItem.label}</span>
              <span
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  section.enabled ? "bg-[#dcfce7] text-[#166534]" : "bg-[#e2e8f0] text-[#64748b]"
                }`}
              >
                {section.enabled ? "On" : "Off"}
              </span>
            </span>
            <span className="mt-0.5 block truncate text-xs leading-5 text-[#64748b]">{sectionPreviewLabel(section)}</span>
            <span className="mt-1 flex items-center gap-2 text-[11px] text-[#94a3b8]">
              <span>{editableCount} controls</span>
              <span aria-hidden="true">/</span>
              <span>{registryItem.description}</span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

function sectionPreviewLabel(section: TemplateSection) {
  const candidates = [
    section.settings.title,
    section.settings.logo,
    section.settings.text,
    section.settings.eyebrow,
    section.name,
  ];
  const value = candidates.find((candidate) => typeof candidate === "string" && candidate.trim());

  return typeof value === "string" ? value : section.name;
}
