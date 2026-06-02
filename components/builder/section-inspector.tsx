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
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import type { TemplateSection } from "@/lib/templater/schema";

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
        <ListEditor label={t("inspector.navigation")} onChange={(value) => setValue("links", value)} placeholder={t("inspector.navItem")} values={arraySetting(settings.links)} />
      </div>
    );
  }

  if (section.type === "hero") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
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

  return (
    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">{t("inspector.layout")}</p>
      <div className="space-y-3">
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
    </div>
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

function ProductCardControls({
  settings,
  setValue,
}: {
  settings: TemplateSection["settings"];
  setValue: (key: string, value: unknown) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">{t("inspector.productCards")}</p>
      <div className="space-y-3">
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
    </div>
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
