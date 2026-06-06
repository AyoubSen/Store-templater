"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  deleteAccountTemplateAction,
  getTemplateShareStateAction,
  listAccountTemplatesAction,
  saveAccountTemplateAction,
  setTemplateShareEnabledAction,
  type TemplateShareState,
} from "@/app/actions/templates";
import { deleteTemplateImagesAction } from "@/app/actions/images";
import { AuthControls } from "@/components/auth-controls";
import { ContextualHelp } from "@/components/contextual-help";
import { GuidedTour, type GuidedTourStep } from "@/components/guided-tour";
import { TemplateCreationFlow } from "@/components/template-creation-flow";
import { TemplateThumbnail } from "@/components/template-thumbnail";
import { useI18n } from "@/lib/i18n";
import { downloadNextProject, downloadStaticStorefront, downloadTemplateExport, parseTemplateExport } from "@/lib/templater/export";
import { betaLimits, productLimitMessage, templateLimitMessage } from "@/lib/templater/limits";
import type { StoreTemplate } from "@/lib/templater/schema";
import { createTemplateFromStarter, type TemplateCreationOptions } from "@/lib/templater/starter-templates";
import {
  readActiveTemplateId,
  readStoredTemplates,
  writeActiveTemplateId,
  writeStoredTemplates,
} from "@/lib/templater/storage";
import { syncStatusClassName, syncStatusLabel, type TemplateSyncState } from "@/lib/templater/sync-status";

const dashboardTourStorageKey = "store-templater:dashboard-tour-dismissed";

export default function TemplatesPage() {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<StoreTemplate[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState("");
  const [isStarterPickerOpen, setIsStarterPickerOpen] = useState(false);
  const [syncState, setSyncState] = useState<TemplateSyncState>("loading");
  const [syncMessage, setSyncMessage] = useState(t("status.loadingTemplates"));
  const [shareStates, setShareStates] = useState<Record<string, TemplateShareState>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [publishFilter, setPublishFilter] = useState<"all" | "published" | "private">("all");
  const [sortMode, setSortMode] = useState<"recent" | "name" | "products">("recent");
  const [isTourOpen, setIsTourOpen] = useState(false);
  const hasReachedTemplateLimit = templates.length >= betaLimits.maxTemplatesPerUser;
  const dashboardTourSteps = useMemo<GuidedTourStep[]>(
    () => [
      {
        target: "dashboard-new-template",
        title: t("tour.dashboard.new.title"),
        body: t("tour.dashboard.new.body"),
      },
      {
        target: "dashboard-filters",
        title: t("tour.dashboard.filters.title"),
        body: t("tour.dashboard.filters.body"),
      },
      {
        target: "dashboard-template-card",
        title: t("tour.dashboard.card.title"),
        body: t("tour.dashboard.card.body"),
      },
      {
        target: "dashboard-share",
        title: t("tour.dashboard.share.title"),
        body: t("tour.dashboard.share.body"),
      },
    ],
    [t],
  );

  const visibleTemplates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return templates
      .filter((template) => {
        const shareState = shareStates[template.id] ?? emptyShareState();
        const matchesPublishFilter =
          publishFilter === "all" ||
          (publishFilter === "published" && shareState.shareEnabled) ||
          (publishFilter === "private" && !shareState.shareEnabled);
        const matchesSearch =
          !normalizedQuery ||
          template.name.toLowerCase().includes(normalizedQuery) ||
          template.category.toLowerCase().includes(normalizedQuery);

        return matchesPublishFilter && matchesSearch;
      })
      .sort((leftTemplate, rightTemplate) => {
        if (sortMode === "name") {
          return leftTemplate.name.localeCompare(rightTemplate.name);
        }

        if (sortMode === "products") {
          return rightTemplate.products.length - leftTemplate.products.length;
        }

        const leftUpdatedAt = shareStates[leftTemplate.id]?.updatedAt ?? "";
        const rightUpdatedAt = shareStates[rightTemplate.id]?.updatedAt ?? "";
        return rightUpdatedAt.localeCompare(leftUpdatedAt);
      });
  }, [publishFilter, searchQuery, shareStates, sortMode, templates]);

  useEffect(() => {
    if (window.localStorage.getItem(dashboardTourStorageKey) !== "true") {
      window.setTimeout(() => setIsTourOpen(true), 400);
    }

    window.setTimeout(() => {
      setTemplates(readStoredTemplates());
      setActiveTemplateId(readActiveTemplateId());
      setSyncState("local-only");
      setSyncMessage(t("status.loadedLocal"));
    }, 0);

    listAccountTemplatesAction().then((result) => {
      if (!result.isDatabaseConfigured) {
        setSyncState("local-only");
        setSyncMessage(t("status.databaseMissing"));
        return;
      }

      if (result.error) {
        setSyncState("failed");
        setSyncMessage(result.error);
        return;
      }

      if (!result.data?.length) {
        setSyncState("local-only");
        setSyncMessage(t("status.noAccountTemplates"));
        return;
      }

      const storedActiveTemplateId = readActiveTemplateId();
      const nextActiveTemplateId =
        result.data.find((template) => template.id === storedActiveTemplateId)?.id ?? result.data[0]?.id ?? "";

      writeStoredTemplates(result.data);
      if (nextActiveTemplateId) {
        writeActiveTemplateId(nextActiveTemplateId);
      }
      setTemplates(result.data);
      setActiveTemplateId(nextActiveTemplateId);
      setSyncState("saved");
      setSyncMessage(t("status.loadedAccount"));
      Promise.all(
        result.data.map(async (template) => {
          const shareResult = await getTemplateShareStateAction(template.id);
          return [template.id, shareResult.data ?? emptyShareState()] as const;
        }),
      ).then((entries) => {
        setShareStates(Object.fromEntries(entries));
      });
    });
  }, [t]);

  function openTemplate(templateId: string) {
    writeActiveTemplateId(templateId);
    setActiveTemplateId(templateId);
  }

  async function createTemplate(options: TemplateCreationOptions) {
    if (templates.length >= betaLimits.maxTemplatesPerUser) {
      setSyncState("failed");
      setSyncMessage(templateLimitMessage());
      setIsStarterPickerOpen(false);
      return;
    }

    const template = createTemplateFromStarter(options);
    const nextTemplates = [...templates, template];

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(template.id);
    setTemplates(nextTemplates);
    setActiveTemplateId(template.id);
    setIsStarterPickerOpen(false);
    await reportTemplateSave(template, t("status.createdTemplate"));
  }

  async function duplicateTemplate(template: StoreTemplate) {
    if (templates.length >= betaLimits.maxTemplatesPerUser) {
      setSyncState("failed");
      setSyncMessage(templateLimitMessage());
      return;
    }

    const copy = {
      ...structuredClone(template),
      // eslint-disable-next-line react-hooks/purity -- Client event handler needs a unique local template id.
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} copy`,
    };
    const nextTemplates = [...templates, copy];

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(copy.id);
    setTemplates(nextTemplates);
    setActiveTemplateId(copy.id);
    await reportTemplateSave(copy, "Template duplicated locally and saved to your account.");
  }

  async function deleteTemplate(templateId: string) {
    if (templates.length <= 1) {
      return;
    }

    const nextTemplates = templates.filter((template) => template.id !== templateId);
    const nextActiveTemplateId = activeTemplateId === templateId ? nextTemplates[0]?.id : activeTemplateId;

    writeStoredTemplates(nextTemplates);
    void deleteTemplateImagesAction(templateId);
    if (nextActiveTemplateId) {
      writeActiveTemplateId(nextActiveTemplateId);
      setActiveTemplateId(nextActiveTemplateId);
    }
    setTemplates(nextTemplates);
    setShareStates((current) => {
      const nextShareStates = { ...current };
      delete nextShareStates[templateId];
      return nextShareStates;
    });
    setSyncState("saving");
    setSyncMessage(t("status.deletingTemplate"));
    const result = await deleteAccountTemplateAction(templateId);

    if (!result.isDatabaseConfigured) {
      setSyncState("local-only");
      setSyncMessage(t("status.deletedLocal"));
      return;
    }

    if (result.error) {
      setSyncState("failed");
      setSyncMessage(result.error);
      return;
    }

    setSyncState("saved");
    setSyncMessage(t("status.deletedTemplate"));
  }

  function exportTemplate(template: StoreTemplate) {
    downloadTemplateExport(template);
  }

  function exportStatic(template: StoreTemplate) {
    downloadStaticStorefront(template);
  }

  function exportNext(template: StoreTemplate) {
    downloadNextProject(template);
  }

  function importTemplate(file: File) {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const parsedTemplate = parseTemplateExport(JSON.parse(String(reader.result)));

        if (!parsedTemplate) {
          window.alert("This file does not look like a Store Templater export.");
          return;
        }

        const importedTemplate = {
          ...parsedTemplate,
          id: `${parsedTemplate.id}-import-${Date.now()}`,
          name: `${parsedTemplate.name} import`,
        };

        if (templates.length >= betaLimits.maxTemplatesPerUser) {
          setSyncState("failed");
          setSyncMessage(templateLimitMessage());
          return;
        }

        if (importedTemplate.products.length > betaLimits.maxProductsPerTemplate) {
          setSyncState("failed");
          setSyncMessage(productLimitMessage());
          return;
        }

        const nextTemplates = [...templates, importedTemplate];

        writeStoredTemplates(nextTemplates);
        writeActiveTemplateId(importedTemplate.id);
        setTemplates(nextTemplates);
        setActiveTemplateId(importedTemplate.id);
        await reportTemplateSave(importedTemplate, t("status.importedLocal"));
      } catch {
        window.alert("Could not read this JSON file.");
      }
    };

    reader.readAsText(file);
  }

  async function reportTemplateSave(template: StoreTemplate, successMessage: string) {
    setSyncState("saving");
    setSyncMessage(t("status.savingAccount"));
    const result = await saveAccountTemplateAction(template);

    if (!result.isDatabaseConfigured) {
      setSyncState("local-only");
      setSyncMessage(t("status.savedLocalDatabaseMissing"));
      return;
    }

    if (result.error) {
      setSyncState("failed");
      setSyncMessage(result.error);
      return;
    }

    setSyncState("saved");
    setSyncMessage(successMessage);
    setShareStates((current) => ({
      ...current,
      [template.id]: current[template.id] ?? emptyShareState(),
    }));
  }

  async function toggleShare(templateId: string) {
    const currentShareState = shareStates[templateId] ?? emptyShareState();

    setSyncState("saving");
    setSyncMessage(currentShareState.shareEnabled ? t("status.disablingShare") : t("status.publishingShare"));
    const result = await setTemplateShareEnabledAction(templateId, !currentShareState.shareEnabled);

    if (!result.isDatabaseConfigured) {
      setSyncState("local-only");
      setSyncMessage(t("status.shareNeedsAccount"));
      return;
    }

    if (result.error) {
      setSyncState("failed");
      setSyncMessage(result.error);
      return;
    }

    setShareStates((current) => ({
      ...current,
      [templateId]: result.data ?? emptyShareState(),
    }));
    setSyncState("saved");
    setSyncMessage(result.data?.shareEnabled ? t("status.shareLive") : t("status.shareDisabled"));
  }

  async function copyShare(shareId: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/s/${shareId}`);
    setSyncState("saved");
    setSyncMessage(t("status.copiedShare"));
  }

  function closeTour() {
    window.localStorage.setItem(dashboardTourStorageKey, "true");
    setIsTourOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#eef0f3] text-[#111827]">
      <header className="border-[#d8dde5] border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-[#64748b]">Store Templater</p>
            <h1 className="mt-1 text-2xl font-semibold">{t("dashboard.templates")}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              className="min-h-10 whitespace-nowrap rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => setIsTourOpen(true)}
              type="button"
            >
              {t("builder.tour")}
            </button>
            <label className="inline-flex min-h-10 cursor-pointer items-center whitespace-nowrap rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]">
              {t("dashboard.importExport")}
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
              data-tour="dashboard-new-template"
              className="min-h-10 whitespace-nowrap rounded-md bg-[#111827] px-3 py-2 text-sm font-medium text-white hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={hasReachedTemplateLimit}
              onClick={() => setIsStarterPickerOpen(true)}
              title={hasReachedTemplateLimit ? templateLimitMessage() : undefined}
              type="button"
            >
              {t("dashboard.newTemplate")}
            </button>
            <Link className="inline-flex min-h-10 items-center whitespace-nowrap rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]" href="/builder">
              {t("dashboard.openBuilder")}
            </Link>
            <AuthControls />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6">
        <div className="mb-5 rounded-lg border border-[#d8dde5] bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">{t("dashboard.localExport.title")}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#64748b]">{t("dashboard.localExport.body")}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2 py-1 text-xs font-medium ${syncStatusClassName(syncState)}`}>
                  {syncStatusLabel(syncState, t)}
                </span>
                <span className="text-xs text-[#64748b]">{syncMessage}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Metric label={t("dashboard.metric.templates")} value={templates.length} />
              <Metric label={t("dashboard.metric.products")} value={templates.reduce((total, template) => total + template.products.length, 0)} />
              <Metric label={t("dashboard.metric.targets")} value="3" />
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-[#d8dde5] bg-white p-3 shadow-sm" data-tour="dashboard-filters">
          <div className="mb-3 flex items-center gap-2 px-1">
            <h2 className="text-xs font-semibold uppercase text-[#475569]">{t("dashboard.filters")}</h2>
            <ContextualHelp body={t("dashboard.filtersHelp.body")} title={t("dashboard.filtersHelp.title")} />
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
            <input
              className="min-h-10 rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb]"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("dashboard.searchPlaceholder")}
              type="search"
              value={searchQuery}
            />
            <div className="flex min-w-0 rounded-md border border-[#d8dde5] bg-[#f8fafc] p-0.5">
              {(["all", "published", "private"] as const).map((filter) => (
                <button
                  className={`min-h-9 rounded px-2.5 py-2 text-xs font-semibold capitalize leading-4 ${
                    publishFilter === filter ? "bg-white text-[#111827] shadow-sm" : "text-[#64748b] hover:text-[#111827]"
                  }`}
                  key={filter}
                  onClick={() => setPublishFilter(filter)}
                  type="button"
                >
                  {filterLabel(filter, t)}
                </button>
              ))}
            </div>
            <select
              className="min-h-10 rounded-md border border-[#d8dde5] bg-white px-3 text-sm font-medium text-[#334155] outline-none focus:border-[#2563eb]"
              onChange={(event) => setSortMode(event.target.value as typeof sortMode)}
              value={sortMode}
            >
              <option value="recent">{t("dashboard.sort.recent")}</option>
              <option value="name">{t("dashboard.sort.name")}</option>
              <option value="products">{t("dashboard.sort.products")}</option>
            </select>
          </div>
          <p className="mt-3 text-xs text-[#64748b]">
            {t("dashboard.showing")} {visibleTemplates.length} {t("dashboard.templatesOf")} {templates.length} {t("dashboard.templatesSuffix")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleTemplates.map((template) => {
            const shareState = shareStates[template.id] ?? emptyShareState();
            const isActive = activeTemplateId === template.id;

            return (
              <TemplateCard
                canDelete={templates.length > 1}
                copyShare={copyShare}
                deleteTemplate={() => deleteTemplate(template.id)}
                duplicateTemplate={() => duplicateTemplate(template)}
                exportNext={() => exportNext(template)}
                exportStatic={() => exportStatic(template)}
                exportTemplate={() => exportTemplate(template)}
                isActive={isActive}
                key={template.id}
                openTemplate={() => openTemplate(template.id)}
                shareState={shareState}
                template={template}
                toggleShare={() => toggleShare(template.id)}
                hasReachedTemplateLimit={hasReachedTemplateLimit}
              />
            );
          })}
        </div>
        {visibleTemplates.length === 0 ? (
          <div className="rounded-lg border border-[#d8dde5] bg-white p-8 text-center shadow-sm">
            <h2 className="text-base font-semibold text-[#111827]">{t("dashboard.noTemplates.title")}</h2>
            <p className="mt-2 text-sm text-[#64748b]">{t("dashboard.noTemplates.body")}</p>
          </div>
        ) : null}
      </section>

      {isStarterPickerOpen ? (
        <TemplateCreationFlow
          onClose={() => setIsStarterPickerOpen(false)}
          onCreate={(options) => {
            void createTemplate(options);
          }}
        />
      ) : null}
      <GuidedTour isOpen={isTourOpen} onClose={closeTour} steps={dashboardTourSteps} />
    </main>
  );
}

function emptyShareState(): TemplateShareState {
  return { shareEnabled: false, shareId: null, sharedAt: null, updatedAt: null };
}

function filterLabel(filter: "all" | "published" | "private", t: ReturnType<typeof useI18n>["t"]) {
  const labels = {
    all: t("dashboard.filter.all"),
    private: t("dashboard.filter.private"),
    published: t("dashboard.filter.published"),
  };

  return labels[filter];
}

function TemplateCard({
  canDelete,
  copyShare,
  deleteTemplate,
  duplicateTemplate,
  exportNext,
  exportStatic,
  exportTemplate,
  isActive,
  openTemplate,
  shareState,
  template,
  toggleShare,
  hasReachedTemplateLimit,
}: {
  canDelete: boolean;
  copyShare: (shareId: string) => void;
  deleteTemplate: () => void;
  duplicateTemplate: () => void;
  exportNext: () => void;
  exportStatic: () => void;
  exportTemplate: () => void;
  isActive: boolean;
  openTemplate: () => void;
  shareState: TemplateShareState;
  template: StoreTemplate;
  toggleShare: () => void;
  hasReachedTemplateLimit: boolean;
}) {
  const { t } = useI18n();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const statusLabel = shareState.shareEnabled ? t("builder.published") : t("common.private");
  const statusClassName = shareState.shareEnabled
    ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
    : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]";

  return (
    <article className="rounded-lg border border-[#d8dde5] bg-white p-4 shadow-sm" data-tour="dashboard-template-card">
      <TemplateThumbnail
        activeLabel={t("common.active")}
        isActive={isActive}
        isPublished={shareState.shareEnabled}
        privateLabel={t("common.private")}
        publishedLabel={t("builder.published")}
        template={template}
      />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">{template.name}</h2>
          <p className="mt-1 text-sm capitalize text-[#64748b]">{template.category}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {isActive ? (
            <span className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-1 text-xs font-medium text-[#15803d]">
              {t("common.active")}
            </span>
          ) : null}
          <span className={`rounded-md border px-2 py-1 text-xs font-medium ${statusClassName}`}>{statusLabel}</span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-[#64748b]">
        <div>
          <dt className="font-medium text-[#475569]">{t("dashboard.card.sections")}</dt>
          <dd className="mt-1">{template.pages[0]?.sections.length ?? 0}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#475569]">{t("dashboard.card.products")}</dt>
          <dd className="mt-1">{template.products.length}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#475569]">{t("dashboard.card.updated")}</dt>
          <dd className="mt-1 truncate">
            {formatDashboardDate(shareState.updatedAt, t("common.notYet"), t("dashboard.today"), t("dashboard.yesterday"))}
          </dd>
        </div>
      </dl>

      <div className="mt-5 grid grid-cols-[1fr_1fr_auto] gap-2">
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#111827] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#1f2937]"
          href="/builder"
          onClick={openTemplate}
        >
          {t("common.edit")}
        </Link>
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-center text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
          href={`/preview/${template.id}`}
          target="_blank"
        >
          {t("builder.preview")}
        </Link>
        <button
          aria-expanded={isActionsOpen}
          className="min-h-10 rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
          data-tour="dashboard-share"
          onClick={() => setIsActionsOpen((current) => !current)}
          type="button"
        >
          {isActionsOpen ? t("dashboard.hideActions") : t("common.more")}
        </button>
      </div>

      {isActionsOpen ? (
        <div className="mt-3 grid gap-3 border-[#e2e8f0] border-t pt-3">
          <TemplateSharePanel copyShare={copyShare} shareState={shareState} toggleShare={toggleShare} />
          <TemplateActions
            canDelete={canDelete}
            deleteTemplate={deleteTemplate}
            duplicateTemplate={duplicateTemplate}
            exportNext={exportNext}
            exportStatic={exportStatic}
            exportTemplate={exportTemplate}
            hasReachedTemplateLimit={hasReachedTemplateLimit}
          />
        </div>
      ) : null}
    </article>
  );
}

function TemplateSharePanel({
  copyShare,
  shareState,
  toggleShare,
}: {
  copyShare: (shareId: string) => void;
  shareState: TemplateShareState;
  toggleShare: () => void;
}) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const shareLink = shareState.shareId ? `/s/${shareState.shareId}` : "";

  return (
    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3" data-tour="dashboard-share">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#111827]">{t("share.publicSharing")}</p>
          <p className="mt-1 text-xs leading-5 text-[#64748b]">{t("share.publishedPagesOnly")}</p>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-xs font-semibold ${
            shareState.shareEnabled
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
              : "border-[#e2e8f0] bg-white text-[#64748b]"
          }`}
        >
          {shareState.shareEnabled ? t("builder.published") : t("common.private")}
        </span>
      </div>

      <button
        className="mt-3 min-h-9 w-full rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-semibold leading-4 text-[#334155] hover:bg-[#f1f5f9]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? t("share.hideControls") : shareState.shareEnabled ? t("share.manageLink") : t("share.options")}
      </button>

      {isOpen ? (
        <>

          {shareState.shareEnabled && shareLink ? (
            <p className="mt-3 truncate rounded border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-medium text-[#334155]">
              {shareLink}
            </p>
          ) : null}

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              className={`min-h-9 rounded-md px-2 py-2 text-xs font-semibold leading-4 ${
                shareState.shareEnabled
                  ? "border border-[#fecaca] bg-white text-[#b91c1c] hover:bg-[#fef2f2]"
                  : "bg-[#111827] text-white hover:bg-[#1f2937]"
              }`}
              onClick={toggleShare}
              type="button"
            >
              {shareState.shareEnabled ? t("share.unpublish") : t("share.publish")}
            </button>
            <button
              aria-disabled={!shareState.shareEnabled || !shareState.shareId}
              className={`min-h-9 rounded-md border border-[#d8dde5] bg-white px-2 py-2 text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9] ${
                !shareState.shareEnabled || !shareState.shareId ? "cursor-not-allowed opacity-40" : ""
              }`}
              onClick={() => {
                if (shareState.shareId) {
                  copyShare(shareState.shareId);
                }
              }}
              type="button"
            >
              {t("common.copy")}
            </button>
            {shareState.shareEnabled && shareLink ? (
              <Link
                className="inline-flex min-h-9 items-center justify-center rounded-md border border-[#d8dde5] bg-white px-2 py-2 text-center text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9]"
                href={shareLink}
                target="_blank"
              >
                {t("common.open")}
              </Link>
            ) : (
              <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-[#d8dde5] bg-white px-2 py-2 text-center text-xs font-medium leading-4 text-[#94a3b8]">
                {t("common.open")}
              </span>
            )}
          </div>

          <div className="mt-3 grid gap-1 text-[11px] text-[#64748b]">
            <p>{t("share.lastSaved")} {formatShareDate(shareState.updatedAt, t("common.notYet"))}</p>
            <p>{t("share.lastPublished")} {formatShareDate(shareState.sharedAt, t("common.notYet"))}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}

function TemplateActions({
  canDelete,
  deleteTemplate,
  duplicateTemplate,
  exportNext,
  exportStatic,
  exportTemplate,
  hasReachedTemplateLimit,
}: {
  canDelete: boolean;
  deleteTemplate: () => void;
  duplicateTemplate: () => void;
  exportNext: () => void;
  exportStatic: () => void;
  exportTemplate: () => void;
  hasReachedTemplateLimit: boolean;
}) {
  const { t } = useI18n();

  return (
    <div className="grid gap-2 rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          className="min-h-10 rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-sm font-medium leading-5 text-[#334155] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={hasReachedTemplateLimit}
          onClick={duplicateTemplate}
          title={hasReachedTemplateLimit ? templateLimitMessage() : undefined}
          type="button"
        >
          {t("common.duplicate")}
        </button>
        <button
          aria-disabled={!canDelete}
          className={`min-h-10 rounded-md border border-[#fecaca] bg-white px-3 py-2 text-sm font-medium leading-5 text-[#b91c1c] hover:bg-[#fef2f2] ${
            canDelete ? "" : "cursor-not-allowed opacity-40"
          }`}
          onClick={() => {
            if (canDelete) {
              deleteTemplate();
            }
          }}
          type="button"
        >
          {t("common.delete")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          className="min-h-9 rounded-md border border-[#d8dde5] bg-[#f8fafc] px-2 py-2 text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9]"
          onClick={exportTemplate}
          type="button"
        >
          {t("common.package")}
        </button>
        <button
          className="min-h-9 rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-2 py-2 text-xs font-medium leading-4 text-[#1d4ed8] hover:bg-[#dbeafe]"
          onClick={exportStatic}
          type="button"
        >
          {t("common.site")}
        </button>
        <button
          className="min-h-9 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-2 text-xs font-medium leading-4 text-[#15803d] hover:bg-[#dcfce7]"
          onClick={exportNext}
          type="button"
        >
          {t("common.next")}
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

function formatDashboardDate(value: string | null | undefined, fallback = "Not yet", todayLabel = "Today", yesterdayLabel = "Yesterday") {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ").slice(0, 10);
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return todayLabel;
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return yesterdayLabel;
  }

  return value.replace("T", " ").slice(0, 10);
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
      <p className="font-semibold text-[#111827]">{value}</p>
      <p className="mt-0.5 text-[#64748b]">{label}</p>
    </div>
  );
}
