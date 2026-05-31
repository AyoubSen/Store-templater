"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InspectorPanel, type InspectorTab } from "@/components/builder/inspector-panel";
import { PreviewCanvas, type Device } from "@/components/builder/preview-canvas";
import { SectionSidebar } from "@/components/builder/section-sidebar";
import { createPage } from "@/lib/templater/page-defaults";
import { sampleTemplate } from "@/lib/templater/sample-template";
import { createSection } from "@/lib/templater/section-defaults";
import type { PageType, SectionType, StoreTemplate, TemplatePage, ThemeTokens } from "@/lib/templater/schema";
import { createTemplateFromStarter } from "@/lib/templater/starter-templates";
import {
  clearStoredTemplate,
  readStoredTemplate,
  readStoredTemplates,
  writeActiveTemplateId,
  writeStoredTemplate,
  writeStoredTemplates,
} from "@/lib/templater/storage";

const colorControls: Array<keyof ThemeTokens["colors"]> = [
  "canvas",
  "surface",
  "text",
  "muted",
  "primary",
  "secondary",
  "accent",
  "border",
];

const sectionGroups: Array<{ label: string; sections: SectionType[] }> = [
  { label: "Store basics", sections: ["announcement", "header", "footer"] },
  { label: "Merchandising", sections: ["hero", "categoryStrip", "collectionGrid", "productGrid", "productDetail", "promoTiles"] },
  { label: "Checkout", sections: ["cartSummary", "checkoutSummary"] },
  { label: "Conversion", sections: ["featureBand", "trustBand", "reviews", "faq", "newsletter"] },
];

type TemplateUpdater = StoreTemplate | ((current: StoreTemplate) => StoreTemplate);

type TemplateHistory = {
  past: StoreTemplate[];
  future: StoreTemplate[];
};

export default function Home() {
  const [template, setTemplate] = useState<StoreTemplate>(sampleTemplate);
  const [templates, setTemplates] = useState<StoreTemplate[]>([sampleTemplate]);
  const [selectedPageId, setSelectedPageId] = useState(sampleTemplate.pages[0]?.id ?? "");
  const [selectedSectionId, setSelectedSectionId] = useState("hero");
  const [device, setDevice] = useState<Device>("desktop");
  const [zoom, setZoom] = useState(90);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("section");
  const [saveState, setSaveState] = useState<"loading" | "saved">("loading");
  const [history, setHistory] = useState<TemplateHistory>({ past: [], future: [] });
  const hasLoadedStoredTemplate = useRef(false);

  const selectedPage = template.pages.find((page) => page.id === selectedPageId) ?? template.pages[0];
  const selectedSection = selectedPage?.sections.find((section) => section.id === selectedSectionId);

  useEffect(() => {
    window.setTimeout(() => {
      const storedTemplates = readStoredTemplates();
      const storedTemplate = readStoredTemplate();
      setTemplates(storedTemplates);
      setTemplate(storedTemplate);
      selectFirstSection(storedTemplate);
      setHistory({ past: [], future: [] });
      hasLoadedStoredTemplate.current = true;
      setSaveState("saved");
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredTemplate.current) {
      return;
    }

    writeStoredTemplate(template);
    setTemplates((current) =>
      current.some((storedTemplate) => storedTemplate.id === template.id)
        ? current.map((storedTemplate) => (storedTemplate.id === template.id ? template : storedTemplate))
        : [...current, template],
    );
    setSaveState("saved");
  }, [template]);

  const previewStyle = useMemo(
    () =>
      ({
        "--store-canvas": template.theme.colors.canvas,
        "--store-surface": template.theme.colors.surface,
        "--store-text": template.theme.colors.text,
        "--store-muted": template.theme.colors.muted,
        "--store-primary": template.theme.colors.primary,
        "--store-secondary": template.theme.colors.secondary,
        "--store-accent": template.theme.colors.accent,
        "--store-border": template.theme.colors.border,
        "--store-radius": `${template.theme.layout.radius}px`,
        "--store-spacing": `${template.theme.layout.spacing}px`,
        "--store-max-width": `${template.theme.layout.maxWidth}px`,
      }) as React.CSSProperties,
    [template],
  );

  function commitTemplateUpdate(updater: TemplateUpdater) {
    setTemplate((current) => {
      const nextTemplate = typeof updater === "function" ? updater(current) : updater;

      if (nextTemplate === current) {
        return current;
      }

      setHistory((currentHistory) => ({
        past: [...currentHistory.past.slice(-49), current],
        future: [],
      }));

      return nextTemplate;
    });
  }

  function replaceTemplate(nextTemplate: StoreTemplate) {
    setTemplate(nextTemplate);
    selectFirstSection(nextTemplate);
    setHistory({ past: [], future: [] });
  }

  function selectFirstSection(nextTemplate: StoreTemplate, pageId = nextTemplate.pages[0]?.id) {
    const nextPage = nextTemplate.pages.find((page) => page.id === pageId) ?? nextTemplate.pages[0];

    setSelectedPageId(nextPage?.id ?? "");
    setSelectedSectionId(nextPage?.sections[0]?.id ?? "");
  }

  function syncSelection(nextTemplate: StoreTemplate) {
    const nextPage = nextTemplate.pages.find((page) => page.id === selectedPageId) ?? nextTemplate.pages[0];
    const nextSection = nextPage?.sections.find((section) => section.id === selectedSectionId) ?? nextPage?.sections[0];

    setSelectedPageId(nextPage?.id ?? "");
    setSelectedSectionId(nextSection?.id ?? "");
  }

  function undoTemplateChange() {
    const previousTemplate = history.past.at(-1);

    if (!previousTemplate) {
      return;
    }

    setHistory({
      past: history.past.slice(0, -1),
      future: [template, ...history.future].slice(0, 50),
    });
    setTemplate(previousTemplate);
    syncSelection(previousTemplate);
  }

  function redoTemplateChange() {
    const nextTemplate = history.future[0];

    if (!nextTemplate) {
      return;
    }

    setHistory({
      past: [...history.past, template].slice(-50),
      future: history.future.slice(1),
    });
    setTemplate(nextTemplate);
    syncSelection(nextTemplate);
  }

  function selectPage(pageId: string) {
    const nextPage = template.pages.find((page) => page.id === pageId);

    if (!nextPage) {
      return;
    }

    setSelectedPageId(nextPage.id);
    setSelectedSectionId(nextPage.sections[0]?.id ?? "");
  }

  function addPage(type: PageType) {
    const existingPage = template.pages.find((page) => page.type === type);

    if (existingPage) {
      selectPage(existingPage.id);
      return;
    }

    const page = createPage(type);

    commitTemplateUpdate((current) => ({
      ...current,
      pages: [...current.pages, page],
    }));
    setSelectedPageId(page.id);
    setSelectedSectionId(page.sections[0]?.id ?? "");
  }

  function deletePage(pageId: string) {
    commitTemplateUpdate((current) => {
      if (current.pages.length <= 1) {
        return current;
      }

      const nextPages = current.pages.filter((page) => page.id !== pageId);
      const nextTemplate = {
        ...current,
        pages: nextPages,
      };

      if (selectedPageId === pageId) {
        selectFirstSection(nextTemplate, nextPages[0]?.id);
      }

      return nextTemplate;
    });
  }

  function updatePageField<K extends "name" | "slug" | "seoTitle" | "status">(pageId: string, key: K, value: TemplatePage[K]) {
    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) => (page.id === pageId ? { ...page, [key]: value } : page)),
    }));
  }

  function updateColor(key: keyof ThemeTokens["colors"], value: string) {
    commitTemplateUpdate((current) => ({
      ...current,
      theme: {
        ...current.theme,
        colors: {
          ...current.theme.colors,
          [key]: value,
        },
      },
    }));
  }

  function applyThemePreset(colors: ThemeTokens["colors"]) {
    commitTemplateUpdate((current) => ({
      ...current,
      theme: {
        ...current.theme,
        colors,
      },
    }));
  }

  function applyTypographyPreset(typography: ThemeTokens["typography"]) {
    commitTemplateUpdate((current) => ({
      ...current,
      theme: {
        ...current.theme,
        typography,
      },
    }));
  }

  function updateLayout(key: keyof ThemeTokens["layout"], value: number | ThemeTokens["layout"]["density"]) {
    commitTemplateUpdate((current) => ({
      ...current,
      theme: {
        ...current.theme,
        layout: {
          ...current.theme.layout,
          [key]: value,
        },
      },
    }));
  }

  function updateTemplateField<K extends "name" | "category">(key: K, value: StoreTemplate[K]) {
    commitTemplateUpdate((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateProduct(productId: string, key: string, value: string | number) {
    commitTemplateUpdate((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === productId ? { ...product, [key]: value } : product)),
    }));
  }

  function addProduct() {
    const product = {
      id: `product-${Date.now()}`,
      name: "New product",
      category: "Collection",
      price: 49,
      image: "linear-gradient(135deg, #dbeafe, #f8fafc)",
      imagePositionX: 50,
      imagePositionY: 50,
      imageZoom: 100,
      badge: "New",
    };

    commitTemplateUpdate((current) => ({
      ...current,
      products: [...current.products, product],
    }));
  }

  function duplicateProduct(productId: string) {
    commitTemplateUpdate((current) => {
      const currentIndex = current.products.findIndex((product) => product.id === productId);
      const product = current.products[currentIndex];

      if (!product) {
        return current;
      }

      const copy = {
        ...product,
        id: `${product.id}-copy-${Date.now()}`,
        name: `${product.name} copy`,
      };
      const products = [...current.products];
      products.splice(currentIndex + 1, 0, copy);

      return {
        ...current,
        products,
      };
    });
  }

  function deleteProduct(productId: string) {
    commitTemplateUpdate((current) => {
      if (current.products.length <= 1) {
        return current;
      }

      return {
        ...current,
        products: current.products.filter((product) => product.id !== productId),
      };
    });
  }

  function toggleSection(sectionId: string) {
    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) =>
        page.id === selectedPage?.id
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId ? { ...section, enabled: !section.enabled } : section,
              ),
            }
          : page,
      ),
    }));
  }

  function moveSection(sectionId: string, direction: "up" | "down") {
    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) => {
        if (page.id !== selectedPage?.id) {
          return page;
        }

        const currentIndex = page.sections.findIndex((section) => section.id === sectionId);
        const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (currentIndex < 0 || nextIndex < 0 || nextIndex >= page.sections.length) {
          return page;
        }

        const sections = [...page.sections];
        const [movedSection] = sections.splice(currentIndex, 1);
        sections.splice(nextIndex, 0, movedSection);

        return {
          ...page,
          sections,
        };
      }),
    }));
  }

  function reorderSections(sectionIds: string[]) {
    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) => {
        if (page.id !== selectedPage?.id) {
          return page;
        }

        const sectionById = new Map(page.sections.map((section) => [section.id, section]));
        const sections = sectionIds
          .map((sectionId) => sectionById.get(sectionId))
          .filter((section): section is (typeof page.sections)[number] => Boolean(section));

        return {
          ...page,
          sections,
        };
      }),
    }));
  }

  function addSection(type: SectionType) {
    const section = createSection(type);

    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) => {
        if (page.id !== selectedPage?.id) {
          return page;
        }

        const selectedIndex = page.sections.findIndex((pageSection) => pageSection.id === selectedSectionId);
        const insertIndex = selectedIndex >= 0 ? selectedIndex + 1 : page.sections.length;
        const sections = [...page.sections];
        sections.splice(insertIndex, 0, section);

        return {
          ...page,
          sections,
        };
      }),
    }));
    setSelectedSectionId(section.id);
  }

  function duplicateSection(sectionId: string) {
    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) => {
        if (page.id !== selectedPage?.id) {
          return page;
        }

        const currentIndex = page.sections.findIndex((section) => section.id === sectionId);
        const section = page.sections[currentIndex];

        if (!section) {
          return page;
        }

        const copy = {
          ...section,
          id: `${section.id}-copy-${Date.now()}`,
          name: `${section.name} copy`,
          settings: structuredClone(section.settings),
        };

        const sections = [...page.sections];
        sections.splice(currentIndex + 1, 0, copy);

        return {
          ...page,
          sections,
        };
      }),
    }));
  }

  function deleteSection(sectionId: string) {
    commitTemplateUpdate((current) => {
      const nextPages = current.pages.map((page) => {
        if (page.id !== selectedPage?.id) {
          return page;
        }

        return {
          ...page,
          sections: page.sections.filter((section) => section.id !== sectionId),
        };
      });

      const nextSelectedPage = nextPages.find((page) => page.id === selectedPage?.id);
      const nextSelectedSection = nextSelectedPage?.sections.find((section) => section.id === selectedSectionId);

      if (!nextSelectedSection) {
        setSelectedSectionId(nextSelectedPage?.sections[0]?.id ?? "");
      }

      return {
        ...current,
        pages: nextPages,
      };
    });
  }

  function updateSectionSetting(sectionId: string, key: string, value: unknown) {
    commitTemplateUpdate((current) => ({
      ...current,
      pages: current.pages.map((page) =>
        page.id === selectedPage?.id
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      settings: {
                        ...section.settings,
                        [key]: value,
                      },
                    }
                  : section,
              ),
            }
          : page,
      ),
    }));
  }

  function resetTemplate() {
    clearStoredTemplate();
    replaceTemplate(sampleTemplate);
    setTemplates([sampleTemplate]);
  }

  function createTemplate(starterId: string) {
    const nextTemplate = createTemplateFromStarter(starterId);
    const nextTemplates = [...templates, nextTemplate];

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(nextTemplate.id);
    setTemplates(nextTemplates);
    replaceTemplate(nextTemplate);
  }

  function duplicateTemplate() {
    const nextTemplate = {
      ...structuredClone(template),
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} copy`,
    };
    const nextTemplates = [...templates, nextTemplate];

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(nextTemplate.id);
    setTemplates(nextTemplates);
    replaceTemplate(nextTemplate);
  }

  function deleteTemplate(templateId: string) {
    if (templates.length <= 1) {
      return;
    }

    const nextTemplates = templates.filter((storedTemplate) => storedTemplate.id !== templateId);
    const nextTemplate = template.id === templateId ? nextTemplates[0] : template;

    writeStoredTemplates(nextTemplates);
    writeActiveTemplateId(nextTemplate.id);
    setTemplates(nextTemplates);
    replaceTemplate(nextTemplate);
  }

  function selectTemplate(templateId: string) {
    const nextTemplate = templates.find((storedTemplate) => storedTemplate.id === templateId);

    if (!nextTemplate) {
      return;
    }

    writeActiveTemplateId(templateId);
    replaceTemplate(nextTemplate);
  }

  return (
    <main className="min-h-screen bg-[#eef0f3] text-[#111827]">
      <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <SectionSidebar
          addSection={addSection}
          activeTemplateId={template.id}
          createTemplate={createTemplate}
          deleteTemplate={deleteTemplate}
          duplicateTemplate={duplicateTemplate}
          reorderSections={reorderSections}
          saveState={saveState}
          sectionGroups={sectionGroups}
          addPage={addPage}
          deletePage={deletePage}
          pages={template.pages}
          sections={selectedPage?.sections ?? []}
          selectedPageId={selectedPage?.id ?? ""}
          selectedSectionId={selectedSectionId}
          selectPage={selectPage}
          setSelectedSectionId={setSelectedSectionId}
          selectTemplate={selectTemplate}
          template={template}
          templates={templates}
          updatePageField={updatePageField}
        />

        <PreviewCanvas
          device={device}
          previewStyle={previewStyle}
          resetTemplate={resetTemplate}
          canRedo={history.future.length > 0}
          canUndo={history.past.length > 0}
          redoTemplateChange={redoTemplateChange}
          selectedPage={selectedPage}
          selectedSection={selectedSection}
          selectedSectionId={selectedSectionId}
          setDevice={setDevice}
          setZoom={setZoom}
          template={template}
          undoTemplateChange={undoTemplateChange}
          zoom={zoom}
        />

        <InspectorPanel
          addProduct={addProduct}
          colorControls={colorControls}
          deleteProduct={deleteProduct}
          deleteSection={deleteSection}
          duplicateProduct={duplicateProduct}
          duplicateSection={duplicateSection}
          homeSections={selectedPage?.sections ?? []}
          inspectorTab={inspectorTab}
          moveSection={moveSection}
          selectedSection={selectedSection}
          setInspectorTab={setInspectorTab}
          template={template}
          toggleSection={toggleSection}
          updateColor={updateColor}
          applyThemePreset={applyThemePreset}
          applyTypographyPreset={applyTypographyPreset}
          updateLayout={updateLayout}
          updateProduct={updateProduct}
          updateSectionSetting={updateSectionSetting}
          updateTemplateField={updateTemplateField}
        />
      </div>
    </main>
  );
}
