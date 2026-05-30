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
        <TextField label="Eyebrow" onChange={(value) => setValue("eyebrow", value)} value={stringSetting(settings.eyebrow)} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <TextArea label="Copy" onChange={(value) => setValue("copy", value)} value={stringSetting(settings.copy)} />
        <TextField label="Button" onChange={(value) => setValue("cta", value)} value={stringSetting(settings.cta)} />
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
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <RangeControl label="Columns" max={4} min={2} onChange={(value) => setValue("columns", value)} value={numberSetting(settings.columns, 3)} />
      </div>
    );
  }

  if (section.type === "collectionGrid") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Eyebrow" onChange={(value) => setValue("eyebrow", value)} value={stringSetting(settings.eyebrow)} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label="Filters" onChange={(value) => setValue("filters", value)} placeholder="Filter" values={arraySetting(settings.filters)} />
        <TextField label="Sort label" onChange={(value) => setValue("sortLabel", value)} value={stringSetting(settings.sortLabel)} />
      </div>
    );
  }

  if (section.type === "productDetail") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Badge" onChange={(value) => setValue("badge", value)} value={stringSetting(settings.badge)} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <TextArea label="Subtitle" onChange={(value) => setValue("subtitle", value)} value={stringSetting(settings.subtitle)} />
        <ListEditor label="Variants" onChange={(value) => setValue("variants", value)} placeholder="Variant" values={arraySetting(settings.variants)} />
        <ListEditor label="Details" onChange={(value) => setValue("details", value)} placeholder="Detail" values={arraySetting(settings.details)} />
      </div>
    );
  }

  if (section.type === "cartSummary") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <TextField label="Note" onChange={(value) => setValue("note", value)} value={stringSetting(settings.note)} />
        <ListEditor label="Perks" onChange={(value) => setValue("perks", value)} placeholder="Perk" values={arraySetting(settings.perks)} />
      </div>
    );
  }

  if (section.type === "checkoutSummary") {
    return (
      <div className="mt-4 space-y-3">
        <SectionStyleControls settings={settings} setValue={setValue} />
        <TextField label="Title" onChange={(value) => setValue("title", value)} value={stringSetting(settings.title)} />
        <ListEditor label="Steps" onChange={(value) => setValue("steps", value)} placeholder="Step" values={arraySetting(settings.steps)} />
        <TextArea label="Reassurance" onChange={(value) => setValue("reassurance", value)} value={stringSetting(settings.reassurance)} />
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
      <p className="mb-3 text-xs font-semibold uppercase text-[#475569]">Style</p>
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
      </div>
    </div>
  );
}

function styleSetting<TValue extends string>(value: unknown, fallback: TValue) {
  return typeof value === "string" ? (value as TValue) : fallback;
}
