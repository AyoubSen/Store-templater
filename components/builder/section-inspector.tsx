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
import type { TemplateSection } from "@/lib/templater/schema";

export function SectionInspector({
  section,
  updateSetting,
}: {
  section: TemplateSection;
  updateSetting: (sectionId: string, key: string, value: unknown) => void;
}) {
  const settings = section.settings;
  const setValue = (key: string, value: unknown) => updateSetting(section.id, key, value);

  if (section.type === "announcement") {
    return (
      <div className="mt-4 space-y-3">
        <TextField label="Message" onChange={(value) => setValue("text", value)} value={stringSetting(settings.text)} />
      </div>
    );
  }

  if (section.type === "header") {
    return (
      <div className="mt-4 space-y-3">
        <TextField label="Logo text" onChange={(value) => setValue("logo", value)} value={stringSetting(settings.logo)} />
        <ListEditor label="Navigation" onChange={(value) => setValue("links", value)} placeholder="Nav item" values={arraySetting(settings.links)} />
      </div>
    );
  }

  if (section.type === "hero") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title="Content">
          <TextField label="Eyebrow" onChange={(value) => setValue("eyebrow", value)} value={stringSetting(settings.eyebrow)} />
          <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label="Copy" onChange={(value) => setValue("copy", value)} value={stringSetting(settings.copy)} />
          <TextField label="Button" onChange={(value) => setValue("cta", value)} value={stringSetting(settings.cta)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "categoryStrip") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ListEditor label="Categories" onChange={(value) => setValue("categories", value)} placeholder="Category" values={arraySetting(settings.categories)} />
      </div>
    );
  }

  if (section.type === "productGrid") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title="Content">
          <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <RangeControl label="Columns" max={4} min={2} onChange={(value) => setValue("columns", value)} value={numberSetting(settings.columns, 3)} />
          <RangeControl label="Product count" max={12} min={1} onChange={(value) => setValue("productCount", value)} value={numberSetting(settings.productCount, 3)} />
        </ControlGroup>
        <ProductCardControls settings={settings} setValue={setValue} />
      </div>
    );
  }

  if (section.type === "collectionGrid") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title="Content">
          <TextField label="Eyebrow" onChange={(value) => setValue("eyebrow", value)} value={stringSetting(settings.eyebrow)} />
          <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label="Description" onChange={(value) => setValue("description", value)} value={stringSetting(settings.description)} />
          <ListEditor label="Status chips" onChange={(value) => setValue("statusChips", value)} placeholder="Status chip" values={arraySetting(settings.statusChips)} />
          <RangeControl label="Product count" max={12} min={1} onChange={(value) => setValue("productCount", value)} value={numberSetting(settings.productCount, 6)} />
        </ControlGroup>
        <ProductCardControls settings={settings} setValue={setValue} />
        <ControlGroup title="Collection tools">
          <SelectControl
            label="Filters"
            onChange={(value) => setValue("showFilters", value === "show")}
            options={[
              { label: "Show", value: "show" },
              { label: "Hide", value: "hide" },
            ]}
            value={settings.showFilters === false ? "hide" : "show"}
          />
          <SelectControl
            label="Sort"
            onChange={(value) => setValue("showSort", value === "show")}
            options={[
              { label: "Show", value: "show" },
              { label: "Hide", value: "hide" },
            ]}
            value={settings.showSort === false ? "hide" : "show"}
          />
          <ListEditor label="Filters" onChange={(value) => setValue("filters", value)} placeholder="Filter" values={arraySetting(settings.filters)} />
          <TextField label="Sort label" onChange={(value) => setValue("sortLabel", value)} value={stringSetting(settings.sortLabel)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "productDetail") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title="Media">
          <SelectControl
            label="Media layout"
            onChange={(value) => setValue("mediaLayout", value)}
            options={[
              { label: "Gallery", value: "gallery" },
              { label: "Stacked", value: "stacked" },
              { label: "Minimal", value: "minimal" },
            ]}
            value={styleSetting(settings.mediaLayout, "gallery")}
          />
          <SelectControl
            label="Media emphasis"
            onChange={(value) => setValue("mediaEmphasis", value)}
            options={[
              { label: "Balanced", value: "balanced" },
              { label: "Media first", value: "media" },
              { label: "Info first", value: "info" },
            ]}
            value={styleSetting(settings.mediaEmphasis, "balanced")}
          />
        </ControlGroup>
        <ControlGroup title="Content">
          <TextField label="Badge" onChange={(value) => setValue("badge", value)} value={stringSetting(settings.badge)} />
          <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label="Subtitle" onChange={(value) => setValue("subtitle", value)} value={stringSetting(settings.subtitle)} />
          <ListEditor label="Social proof" onChange={(value) => setValue("socialProof", value)} placeholder="Proof point" values={arraySetting(settings.socialProof)} />
        </ControlGroup>
        <ControlGroup title="Commerce">
          <ListEditor label="Variants" onChange={(value) => setValue("variants", value)} placeholder="Variant" values={arraySetting(settings.variants)} />
          <ListEditor label="Details" onChange={(value) => setValue("details", value)} placeholder="Detail" values={arraySetting(settings.details)} />
          <ListEditor label="Trust items" onChange={(value) => setValue("trustItems", value)} placeholder="Trust item" values={arraySetting(settings.trustItems)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "cartSummary") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title="Cart content">
          <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextField label="Note" onChange={(value) => setValue("note", value)} value={stringSetting(settings.note)} />
          <TextArea label="Incentive" onChange={(value) => setValue("incentive", value)} value={stringSetting(settings.incentive)} />
          <ListEditor label="Perks" onChange={(value) => setValue("perks", value)} placeholder="Perk" values={arraySetting(settings.perks)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "checkoutSummary") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ControlGroup title="Checkout content">
          <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
          <TextArea label="Subtitle" onChange={(value) => setValue("subtitle", value)} value={stringSetting(settings.subtitle)} />
          <ListEditor label="Payment methods" onChange={(value) => setValue("paymentMethods", value)} placeholder="Payment method" values={arraySetting(settings.paymentMethods)} />
          <ListEditor label="Steps" onChange={(value) => setValue("steps", value)} placeholder="Step" values={arraySetting(settings.steps)} />
          <TextArea label="Reassurance" onChange={(value) => setValue("reassurance", value)} value={stringSetting(settings.reassurance)} />
        </ControlGroup>
      </div>
    );
  }

  if (section.type === "featureBand") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label="Points" onChange={(value) => setValue("points", value)} placeholder="Point" values={arraySetting(settings.points)} />
      </div>
    );
  }

  if (section.type === "promoTiles") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label="Tiles" onChange={(value) => setValue("tiles", value)} placeholder="Promo tile" values={arraySetting(settings.tiles)} />
      </div>
    );
  }

  if (section.type === "reviews") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label="Reviews" onChange={(value) => setValue("reviews", value)} placeholder="Customer quote" values={arraySetting(settings.reviews)} />
      </div>
    );
  }

  if (section.type === "trustBand") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <ListEditor label="Trust items" onChange={(value) => setValue("items", value)} placeholder="Trust item" values={arraySetting(settings.items)} />
      </div>
    );
  }

  if (section.type === "faq") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label="Questions" onChange={(value) => setValue("questions", value)} placeholder="Question" values={arraySetting(settings.questions)} />
      </div>
    );
  }

  if (section.type === "newsletter") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <TextField label="Button" onChange={(value) => setValue("cta", value)} value={stringSetting(settings.cta)} />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ListEditor label="Columns" onChange={(value) => setValue("columns", value)} placeholder="Footer column" values={arraySetting(settings.columns)} />
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
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-3">
      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">Layout</p>
      <div className="space-y-3">
        <SelectControl
          label="Spacing"
          onChange={(value) => setValue("spacing", value)}
          options={[
            { label: "Compact", value: "compact" },
            { label: "Balanced", value: "balanced" },
            { label: "Spacious", value: "spacious" },
          ]}
          value={styleSetting(settings.spacing, "balanced")}
        />
        <SelectControl
          label="Density"
          onChange={(value) => setValue("layoutDensity", value)}
          options={[
            { label: "Compact", value: "compact" },
            { label: "Comfortable", value: "comfortable" },
            { label: "Spacious", value: "spacious" },
          ]}
          value={styleSetting(settings.layoutDensity, "comfortable")}
        />
        <SelectControl
          label="Background"
          onChange={(value) => setValue("background", value)}
          options={[
            { label: "Default", value: "default" },
            { label: "Canvas", value: "canvas" },
            { label: "Surface", value: "surface" },
            { label: "Primary", value: "primary" },
            { label: "Dark", value: "dark" },
          ]}
          value={styleSetting(settings.background, "default")}
        />
        <SelectControl
          label="Alignment"
          onChange={(value) => setValue("alignment", value)}
          options={[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ]}
          value={styleSetting(settings.alignment, "left")}
        />
        <SelectControl
          label="Button style"
          onChange={(value) => setValue("buttonStyle", value)}
          options={[
            { label: "Solid", value: "solid" },
            { label: "Dark", value: "dark" },
            { label: "Outline", value: "outline" },
          ]}
          value={styleSetting(settings.buttonStyle, "solid")}
        />
        <div className="grid grid-cols-3 gap-2">
          <VisibilityControl
            label="Desktop"
            onChange={(value) => setValue("visibleOnDesktop", value)}
            value={settings.visibleOnDesktop !== false}
          />
          <VisibilityControl
            label="Tablet"
            onChange={(value) => setValue("visibleOnTablet", value)}
            value={settings.visibleOnTablet !== false}
          />
          <VisibilityControl
            label="Mobile"
            onChange={(value) => setValue("visibleOnMobile", value)}
            value={settings.visibleOnMobile !== false}
          />
        </div>
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
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-white p-3 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">Product cards</p>
      <div className="space-y-3">
        <SelectControl
          label="Card style"
          onChange={(value) => setValue("productCardStyle", value)}
          options={[
            { label: "Elevated", value: "elevated" },
            { label: "Minimal", value: "minimal" },
            { label: "Editorial", value: "editorial" },
          ]}
          value={styleSetting(settings.productCardStyle, "elevated")}
        />
        <SelectControl
          label="Quick add"
          onChange={(value) => setValue("showQuickAdd", value === "show")}
          options={[
            { label: "Show", value: "show" },
            { label: "Hide", value: "hide" },
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
