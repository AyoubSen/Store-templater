import {
  arraySetting,
  ListEditor,
  numberSetting,
  RangeControl,
  SelectControl,
  stringSetting,
  TextArea,
  TextField,
} from "@/components/builder/controls";
import { useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import type { PageType, TemplateSection } from "@/lib/templater/schema";

export function SectionInspector({
  section,
  updateSetting,
}: {
  section: TemplateSection;
  updateSetting: (sectionId: string, key: string, value: unknown) => void;
}) {
  const { t } = useI18n();
  const settings = section.settings;
  const setValue = (key: string, value: unknown) => updateSetting(section.id, key, value);

  if (section.type === "announcement") {
    return (
      <div className="mt-4 space-y-3">
        <TextField label={t("inspector.message")} onChange={(value) => setValue("text", value)} value={stringSetting(settings.text)} />
      </div>
    );
  }

  if (section.type === "header") {
    return (
      <div className="mt-4 space-y-3">
        <TextField label={t("inspector.logoText")} onChange={(value) => setValue("logo", value)} value={stringSetting(settings.logo)} />
        <ControlGroup title={t("inspector.navigation")}>
          <NavItemsEditor onChange={(value) => setValue("navItems", value)} value={navItemsSetting(settings.navItems)} />
        </ControlGroup>
        <details className="rounded-md border border-[#e2e8f0] bg-white p-3 text-xs shadow-sm">
          <summary className="cursor-pointer list-none font-semibold uppercase text-[#475569]">{t("inspector.advancedNav")}</summary>
          <div className="mt-3 space-y-3">
            <TextField label={t("inspector.nav.cart")} onChange={(value) => setValue("labelCart", value)} value={stringSetting(settings.labelCart) || "Cart"} />
            <VisibilityControl
              label={t("inspector.showCartPill")}
              onChange={(value) => setValue("showCartLink", value)}
              value={settings.showCartLink !== false}
            />
            <details className="border-[#e2e8f0] border-t pt-3">
              <summary className="cursor-pointer list-none font-semibold text-[#64748b]">{t("inspector.legacyNavLabels")}</summary>
              <div className="mt-3 space-y-3">
                <TextField label={t("inspector.nav.home")} onChange={(value) => setValue("labelHome", value)} value={stringSetting(settings.labelHome) || "Home"} />
                <TextField label={t("inspector.nav.collection")} onChange={(value) => setValue("labelCollection", value)} value={stringSetting(settings.labelCollection) || "Shop"} />
                <TextField label={t("inspector.nav.about")} onChange={(value) => setValue("labelAbout", value)} value={stringSetting(settings.labelAbout) || "About"} />
                <TextField label={t("inspector.nav.contact")} onChange={(value) => setValue("labelContact", value)} value={stringSetting(settings.labelContact) || "Contact"} />
              </div>
            </details>
          </div>
        </details>
      </div>
    );
  }

  if (section.type === "hero") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.heroLayout")}>
          <SelectControl
            label={t("inspector.variant")}
            onChange={(value) => setValue("variant", value)}
            options={[
              { label: t("inspector.variant.split"), value: "split" },
              { label: t("inspector.variant.centered"), value: "centered" },
              { label: t("inspector.variant.productSpotlight"), value: "productSpotlight" },
            ]}
            value={styleSetting(settings.variant, "split")}
          />
        </ControlGroup>
        <ControlGroup title={t("inspector.content")}>
          <TextField label={t("inspector.eyebrow")} onChange={(value) => setValue("eyebrow", value)} value={stringSetting(settings.eyebrow)} />
          <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label={t("inspector.copy")} onChange={(value) => setValue("copy", value)} value={stringSetting(settings.copy)} />
          <TextField label={t("inspector.button")} onChange={(value) => setValue("cta", value)} value={stringSetting(settings.cta)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "categoryStrip") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ListEditor label={t("inspector.categories")} onChange={(value) => setValue("categories", value)} placeholder={t("inspector.category")} values={arraySetting(settings.categories)} />
      </div>
    );
  }

  if (section.type === "productGrid") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.content")}>
          <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <RangeControl label={t("inspector.columns")} max={4} min={2} onChange={(value) => setValue("columns", value)} value={numberSetting(settings.columns, 3)} />
          <RangeControl label={t("inspector.productCount")} max={12} min={1} onChange={(value) => setValue("productCount", value)} value={numberSetting(settings.productCount, 3)} />
        </ControlGroup>
        <ProductCardControls settings={settings} setValue={setValue} />
      </div>
    );
  }

  if (section.type === "collectionGrid") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.content")}>
          <TextField label={t("inspector.eyebrow")} onChange={(value) => setValue("eyebrow", value)} value={stringSetting(settings.eyebrow)} />
          <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label={t("inspector.description")} onChange={(value) => setValue("description", value)} value={stringSetting(settings.description)} />
          <ListEditor label={t("inspector.statusChips")} onChange={(value) => setValue("statusChips", value)} placeholder={t("inspector.placeholder.statusChip")} values={arraySetting(settings.statusChips)} />
          <RangeControl label={t("inspector.productCount")} max={12} min={1} onChange={(value) => setValue("productCount", value)} value={numberSetting(settings.productCount, 6)} />
        </ControlGroup>
        <ProductCardControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.collectionTools")}>
          <SelectControl
            label={t("inspector.filters")}
            onChange={(value) => setValue("showFilters", value === "show")}
            options={[
              { label: t("inspector.variant.show"), value: "show" },
              { label: t("inspector.variant.hide"), value: "hide" },
            ]}
            value={settings.showFilters === false ? "hide" : "show"}
          />
          <SelectControl
            label={t("inspector.sort")}
            onChange={(value) => setValue("showSort", value === "show")}
            options={[
              { label: t("inspector.variant.show"), value: "show" },
              { label: t("inspector.variant.hide"), value: "hide" },
            ]}
            value={settings.showSort === false ? "hide" : "show"}
          />
          <ListEditor label={t("inspector.filters")} onChange={(value) => setValue("filters", value)} placeholder={t("inspector.filters")} values={arraySetting(settings.filters)} />
          <TextField label={t("inspector.sortLabel")} onChange={(value) => setValue("sortLabel", value)} value={stringSetting(settings.sortLabel)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "productDetail") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.media")}>
          <SelectControl
            label={t("inspector.mediaLayout")}
            onChange={(value) => setValue("mediaLayout", value)}
            options={[
              { label: t("inspector.variant.gallery"), value: "gallery" },
              { label: t("inspector.variant.stacked"), value: "stacked" },
              { label: t("inspector.variant.minimal"), value: "minimal" },
            ]}
            value={styleSetting(settings.mediaLayout, "gallery")}
          />
          <SelectControl
            label={t("inspector.mediaEmphasis")}
            onChange={(value) => setValue("mediaEmphasis", value)}
            options={[
              { label: t("inspector.variant.balanced"), value: "balanced" },
              { label: t("inspector.variant.mediaFirst"), value: "media" },
              { label: t("inspector.variant.infoFirst"), value: "info" },
            ]}
            value={styleSetting(settings.mediaEmphasis, "balanced")}
          />
        </ControlGroup>
        <ControlGroup title={t("inspector.content")}>
          <TextField label={t("inspector.badge")} onChange={(value) => setValue("badge", value)} value={stringSetting(settings.badge)} />
          <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label={t("inspector.subtitle")} onChange={(value) => setValue("subtitle", value)} value={stringSetting(settings.subtitle)} />
          <ListEditor label={t("inspector.socialProof")} onChange={(value) => setValue("socialProof", value)} placeholder={t("inspector.placeholder.point")} values={arraySetting(settings.socialProof)} />
        </ControlGroup>
        <ControlGroup title={t("inspector.commerce")}>
          <ListEditor label={t("inspector.variants")} onChange={(value) => setValue("variants", value)} placeholder={t("inspector.placeholder.variant")} values={arraySetting(settings.variants)} />
          <ListEditor label={t("inspector.details")} onChange={(value) => setValue("details", value)} placeholder={t("inspector.details")} values={arraySetting(settings.details)} />
          <ListEditor label={t("inspector.trustItems")} onChange={(value) => setValue("trustItems", value)} placeholder={t("inspector.placeholder.trustItem")} values={arraySetting(settings.trustItems)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "cartSummary") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.cartContent")}>
          <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextField label={t("inspector.note")} onChange={(value) => setValue("note", value)} value={stringSetting(settings.note)} />
          <TextArea label={t("inspector.incentive")} onChange={(value) => setValue("incentive", value)} value={stringSetting(settings.incentive)} />
          <ListEditor label={t("inspector.perks")} onChange={(value) => setValue("perks", value)} placeholder={t("inspector.perk")} values={arraySetting(settings.perks)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "checkoutSummary") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title={t("inspector.checkoutContent")}>
          <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label={t("inspector.subtitle")} onChange={(value) => setValue("subtitle", value)} value={stringSetting(settings.subtitle)} />
          <ListEditor label={t("inspector.paymentMethods")} onChange={(value) => setValue("paymentMethods", value)} placeholder={t("inspector.paymentMethod")} values={arraySetting(settings.paymentMethods)} />
          <ListEditor label={t("inspector.steps")} onChange={(value) => setValue("steps", value)} placeholder={t("inspector.placeholder.step")} values={arraySetting(settings.steps)} />
          <TextArea label={t("inspector.reassurance")} onChange={(value) => setValue("reassurance", value)} value={stringSetting(settings.reassurance)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "featureBand") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label={t("inspector.points")} onChange={(value) => setValue("points", value)} placeholder={t("inspector.placeholder.point")} values={arraySetting(settings.points)} />
      </div>
    );
  }

  if (section.type === "promoTiles") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label={t("inspector.tiles")} onChange={(value) => setValue("tiles", value)} placeholder={t("inspector.placeholder.promoTile")} values={arraySetting(settings.tiles)} />
      </div>
    );
  }

  if (section.type === "reviews") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label={t("inspector.reviews")} onChange={(value) => setValue("reviews", value)} placeholder={t("inspector.customerQuote")} values={arraySetting(settings.reviews)} />
      </div>
    );
  }

  if (section.type === "trustBand") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ListEditor label={t("inspector.trustItems")} onChange={(value) => setValue("items", value)} placeholder={t("inspector.placeholder.trustItem")} values={arraySetting(settings.items)} />
      </div>
    );
  }

  if (section.type === "faq") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label={t("inspector.questions")} onChange={(value) => setValue("questions", value)} placeholder={t("inspector.placeholder.question")} values={arraySetting(settings.questions)} />
      </div>
    );
  }

  if (section.type === "newsletter") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label={t("inspector.title")} onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <TextField label={t("inspector.button")} onChange={(value) => setValue("cta", value)} value={stringSetting(settings.cta)} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ListEditor label={t("inspector.columns")} onChange={(value) => setValue("columns", value)} placeholder={t("inspector.columns")} values={arraySetting(settings.columns)} />
    </div>
  );
}

function SectionStyleControls({
  settings,
  setValue,
}: {
  settings: TemplateSection["settings"];
  setValue: (key: string, value: unknown) => void;
}) {
  const { t } = useI18n();
  const spacing = styleSetting(settings.spacing, "balanced");
  const background = styleSetting(settings.background, "default");

  return (
    <details className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
      <summary className="cursor-pointer list-none">
        <span className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.layout")}</span>
          <span className="truncate text-[11px] font-medium text-[#64748b]">
            {spacing} / {background}
          </span>
        </span>
      </summary>
      <div className="mt-3 space-y-3 border-[#e2e8f0] border-t pt-3">
        <SelectControl
          label={t("inspector.spacing")}
          onChange={(value) => setValue("spacing", value)}
          options={[
            { label: t("inspector.variant.compact"), value: "compact" },
            { label: t("inspector.variant.balanced"), value: "balanced" },
            { label: t("inspector.variant.spacious"), value: "spacious" },
          ]}
          value={styleSetting(settings.spacing, "balanced")}
        />
        <SelectControl
          label={t("inspector.background")}
          onChange={(value) => setValue("background", value)}
          options={[
            { label: t("inspector.variant.default"), value: "default" },
            { label: t("inspector.variant.canvas"), value: "canvas" },
            { label: t("inspector.variant.surface"), value: "surface" },
            { label: t("inspector.variant.primary"), value: "primary" },
            { label: t("inspector.variant.dark"), value: "dark" },
          ]}
          value={styleSetting(settings.background, "default")}
        />
        <details className="border-[#e2e8f0] border-t pt-3">
          <summary className="cursor-pointer list-none text-xs font-semibold text-[#475569]">{t("inspector.advancedLayout")}</summary>
          <div className="mt-3 space-y-3">
            <SelectControl
              label={t("inspector.density")}
              onChange={(value) => setValue("layoutDensity", value)}
              options={[
                { label: t("inspector.variant.compact"), value: "compact" },
                { label: t("inspector.variant.comfortable"), value: "comfortable" },
                { label: t("inspector.variant.spacious"), value: "spacious" },
              ]}
              value={styleSetting(settings.layoutDensity, "comfortable")}
            />
            <SelectControl
              label={t("inspector.alignment")}
              onChange={(value) => setValue("alignment", value)}
              options={[
                { label: t("inspector.variant.left"), value: "left" },
                { label: t("inspector.variant.center"), value: "center" },
              ]}
              value={styleSetting(settings.alignment, "left")}
            />
            <SelectControl
              label={t("inspector.buttonStyle")}
              onChange={(value) => setValue("buttonStyle", value)}
              options={[
                { label: t("inspector.variant.solid"), value: "solid" },
                { label: t("inspector.variant.dark"), value: "dark" },
                { label: t("inspector.variant.outline"), value: "outline" },
              ]}
              value={styleSetting(settings.buttonStyle, "solid")}
            />
            <div className="grid grid-cols-3 gap-2">
              <VisibilityControl
                label={t("inspector.desktop")}
                onChange={(value) => setValue("visibleOnDesktop", value)}
                value={settings.visibleOnDesktop !== false}
              />
              <VisibilityControl
                label={t("inspector.tablet")}
                onChange={(value) => setValue("visibleOnTablet", value)}
                value={settings.visibleOnTablet !== false}
              />
              <VisibilityControl
                label={t("inspector.mobile")}
                onChange={(value) => setValue("visibleOnMobile", value)}
                value={settings.visibleOnMobile !== false}
              />
            </div>
          </div>
        </details>
      </div>
    </details>
  );
}

function VisibilityControl({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <button
      className={`rounded-md border px-2 py-1.5 text-[11px] font-semibold ${
        value
          ? "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
          : "border-[#e2e8f0] bg-white text-[#94a3b8]"
      }`}
      onClick={() => onChange(!value)}
      type="button"
    >
      {label}
    </button>
  );
}

type EditableNavItem = {
  id: string;
  label: string;
  pageType: PageType;
  targetType: "page" | "url";
  url: string;
};

function NavItemsEditor({
  onChange,
  value,
}: {
  onChange: (value: EditableNavItem[]) => void;
  value: EditableNavItem[];
}) {
  const { t } = useI18n();
  const [expandedItemId, setExpandedItemId] = useState(value[0]?.id ?? "");

  function updateItem(itemId: string, updates: Partial<EditableNavItem>) {
    onChange(value.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
  }

  function moveItem(itemId: string, direction: -1 | 1) {
    const currentIndex = value.findIndex((item) => item.id === itemId);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= value.length) {
      return;
    }

    const nextItems = [...value];
    const [item] = nextItems.splice(currentIndex, 1);
    nextItems.splice(nextIndex, 0, item);
    onChange(nextItems);
  }

  function addItem() {
    const item = {
      id: `nav-${Date.now()}`,
      label: t("inspector.nav.newLink"),
      pageType: "home" as const,
      targetType: "page" as const,
      url: "",
    };

    onChange([
      ...value,
      item,
    ]);
    setExpandedItemId(item.id);
  }

  function applyPreset(preset: "commerce" | "content" | "minimal") {
    const presets: Record<typeof preset, EditableNavItem[]> = {
      commerce: [
        { id: "nav-shop", label: t("inspector.nav.collection"), pageType: "collection", targetType: "page", url: "" },
        { id: "nav-product", label: t("inspector.nav.product"), pageType: "product", targetType: "page", url: "" },
        { id: "nav-about", label: t("inspector.nav.about"), pageType: "about", targetType: "page", url: "" },
        { id: "nav-contact", label: t("inspector.nav.contact"), pageType: "contact", targetType: "page", url: "" },
      ],
      content: [
        { id: "nav-home", label: t("inspector.nav.home"), pageType: "home", targetType: "page", url: "" },
        { id: "nav-about", label: t("inspector.nav.about"), pageType: "about", targetType: "page", url: "" },
        { id: "nav-faq", label: "FAQ", pageType: "about", targetType: "page", url: "" },
        { id: "nav-contact", label: t("inspector.nav.contact"), pageType: "contact", targetType: "page", url: "" },
      ],
      minimal: [
        { id: "nav-shop", label: t("inspector.nav.collection"), pageType: "collection", targetType: "page", url: "" },
        { id: "nav-contact", label: t("inspector.nav.contact"), pageType: "contact", targetType: "page", url: "" },
      ],
    };

    onChange(presets[preset]);
    setExpandedItemId(presets[preset][0]?.id ?? "");
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
        <p className="text-xs leading-5 text-[#64748b]">{t("inspector.nav.help")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["commerce", "minimal", "content"] as const).map((preset) => (
            <button
              className="min-h-8 min-w-[5.5rem] flex-1 rounded-md border border-[#d8dde5] bg-white px-3 py-1.5 text-center text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9]"
              key={preset}
              onClick={() => applyPreset(preset)}
              type="button"
            >
              {t(`inspector.navPreset.${preset}`)}
            </button>
          ))}
        </div>
      </div>

      {value.length === 0 ? (
        <div className="rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4 text-center">
          <p className="text-sm font-semibold text-[#334155]">{t("inspector.nav.emptyTitle")}</p>
          <p className="mt-1 text-xs leading-5 text-[#64748b]">{t("inspector.nav.emptyBody")}</p>
        </div>
      ) : null}

      {value.map((item, index) => (
        <div className="rounded-md border border-[#e2e8f0] bg-white" key={item.id}>
          <button
            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
            onClick={() => setExpandedItemId((current) => (current === item.id ? "" : item.id))}
            type="button"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#111827]">{item.label || t("inspector.nav.newLink")}</span>
              <span className="mt-0.5 block truncate text-xs text-[#64748b]">
                {item.targetType === "url" ? normalizeNavUrl(item.url) || t("inspector.nav.targetUrl") : pageLabel(item.pageType, t)}
              </span>
            </span>
            <span className="text-xs font-semibold text-[#64748b]">{expandedItemId === item.id ? t("common.close") : t("common.edit")}</span>
          </button>

          {expandedItemId === item.id ? (
            <div className="border-[#e2e8f0] border-t p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="min-w-0 truncate text-xs font-semibold uppercase text-[#475569]">
                  {t("inspector.nav.link")} {index + 1}
                </p>
                <div className="flex gap-1">
                  <button
                    aria-label={t("common.moveUp")}
                    className="rounded border border-[#d8dde5] bg-white px-2 py-1 text-xs font-semibold text-[#334155] disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => moveItem(item.id, -1)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label={t("common.moveDown")}
                    className="rounded border border-[#d8dde5] bg-white px-2 py-1 text-xs font-semibold text-[#334155] disabled:opacity-40"
                    disabled={index === value.length - 1}
                    onClick={() => moveItem(item.id, 1)}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    className="rounded border border-[#fecaca] bg-white px-2 py-1 text-xs font-semibold text-[#b91c1c]"
                    onClick={() => onChange(value.filter((navItem) => navItem.id !== item.id))}
                    type="button"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <TextField label={t("inspector.nav.label")} onChange={(label) => updateItem(item.id, { label })} value={item.label} />
                <SelectControl
                  label={t("inspector.nav.target")}
                  onChange={(targetType) => updateItem(item.id, { targetType })}
                  options={[
                    { label: t("inspector.nav.targetPage"), value: "page" },
                    { label: t("inspector.nav.targetUrl"), value: "url" },
                  ]}
                  value={item.targetType}
                />
                {item.targetType === "page" ? (
                  <SelectControl
                    label={t("inspector.nav.page")}
                    onChange={(pageType) => updateItem(item.id, { pageType })}
                    options={[
                      { label: t("inspector.nav.home"), value: "home" },
                      { label: t("inspector.nav.collection"), value: "collection" },
                      { label: t("inspector.nav.product"), value: "product" },
                      { label: t("inspector.nav.about"), value: "about" },
                      { label: t("inspector.nav.contact"), value: "contact" },
                      { label: t("inspector.nav.cart"), value: "cart" },
                      { label: t("inspector.nav.checkout"), value: "checkout" },
                    ]}
                    value={item.pageType}
                  />
                ) : (
                  <TextField label={t("inspector.nav.url")} onChange={(url) => updateItem(item.id, { url: normalizeNavUrl(url) })} value={item.url} />
                )}
              </div>
            </div>
          ) : null}
        </div>
      ))}
      <button
        className="min-h-9 w-full rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9]"
        onClick={addItem}
        type="button"
      >
        {t("inspector.nav.add")}
      </button>
    </div>
  );
}

function ProductCardControls({
  settings,
  setValue,
}: {
  settings: TemplateSection["settings"];
  setValue: (key: string, value: unknown) => void;
}) {
  const { t } = useI18n();
  const layout = styleSetting(settings.productGridLayout, "grid");
  const cardStyle = styleSetting(settings.productCardStyle, "elevated");

  return (
    <details className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-sm">
      <summary className="cursor-pointer list-none">
        <span className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase text-[#475569]">{t("inspector.productCards")}</span>
          <span className="truncate text-[11px] font-medium text-[#64748b]">
            {layout} / {cardStyle}
          </span>
        </span>
      </summary>
      <div className="mt-3 space-y-3 border-[#e2e8f0] border-t pt-3">
        <SelectControl
          label={t("inspector.productGridLayout")}
          onChange={(value) => setValue("productGridLayout", value)}
          options={[
            { label: t("inspector.variant.grid"), value: "grid" },
            { label: t("inspector.variant.editorialLayout"), value: "editorial" },
            { label: t("inspector.variant.compactCatalog"), value: "compact" },
          ]}
          value={styleSetting(settings.productGridLayout, "grid")}
        />
        <SelectControl
          label={t("inspector.cardStyle")}
          onChange={(value) => setValue("productCardStyle", value)}
          options={[
            { label: t("inspector.variant.elevated"), value: "elevated" },
            { label: t("inspector.variant.minimal"), value: "minimal" },
            { label: t("inspector.variant.editorial"), value: "editorial" },
          ]}
          value={styleSetting(settings.productCardStyle, "elevated")}
        />
        <SelectControl
          label={t("inspector.quickAdd")}
          onChange={(value) => setValue("showQuickAdd", value === "show")}
          options={[
            { label: t("inspector.variant.show"), value: "show" },
            { label: t("inspector.variant.hide"), value: "hide" },
          ]}
          value={settings.showQuickAdd === false ? "hide" : "show"}
        />
      </div>
    </details>
  );
}

function ControlGroup({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function styleSetting<TValue extends string>(value: unknown, fallback: TValue) {
  return typeof value === "string" ? (value as TValue) : fallback;
}

function navItemsSetting(value: unknown): EditableNavItem[] {
  if (!Array.isArray(value)) {
    return [
      { id: "nav-home", label: "Home", pageType: "home", targetType: "page", url: "" },
      { id: "nav-shop", label: "Shop", pageType: "collection", targetType: "page", url: "" },
      { id: "nav-about", label: "About", pageType: "about", targetType: "page", url: "" },
      { id: "nav-contact", label: "Contact", pageType: "contact", targetType: "page", url: "" },
    ];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const navItem = item as Record<string, unknown>;
      return {
        id: stringSetting(navItem.id) || `nav-${index}`,
        label: stringSetting(navItem.label) || "Link",
        pageType: pageTypeSetting(navItem.pageType),
        targetType: navItem.targetType === "url" ? "url" : "page",
        url: stringSetting(navItem.url),
      };
    })
    .filter((item): item is EditableNavItem => Boolean(item));
}

function pageTypeSetting(value: unknown): PageType {
  const pageTypes: PageType[] = ["home", "collection", "product", "cart", "checkout", "about", "contact"];
  return typeof value === "string" && pageTypes.includes(value as PageType) ? (value as PageType) : "home";
}

function normalizeNavUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function pageLabel(pageType: PageType, t: ReturnType<typeof useI18n>["t"]) {
  const labels: Record<PageType, string> = {
    about: t("inspector.nav.about"),
    cart: t("inspector.nav.cart"),
    checkout: t("inspector.nav.checkout"),
    collection: t("inspector.nav.collection"),
    contact: t("inspector.nav.contact"),
    home: t("inspector.nav.home"),
    product: t("inspector.nav.product"),
  };

  return labels[pageType];
}
