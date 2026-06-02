import { sampleTemplate } from "./sample-template";
import { createPage } from "./page-defaults";
import type { PageType, StoreCategory, StoreTemplate, TemplatePage, TemplateSection } from "./schema";

export type StarterTemplateConfig = {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  colors: StoreTemplate["theme"]["colors"];
  hero: {
    eyebrow: string;
    title: string;
    copy: string;
    cta: string;
  };
  announcement: string;
  categories: string[];
  featurePoints: string[];
  newsletterTitle: string;
  products: StoreTemplate["products"];
};

export type TemplateVisualStyle = "minimal" | "editorial" | "bold" | "premium" | "playful";
export type TemplatePageStructure = "quick" | "full" | "landing";

export type TemplateCreationOptions = {
  starterId: string;
  name?: string;
  category?: StoreCategory;
  structure: TemplatePageStructure;
  visualStyle: TemplateVisualStyle;
};

export const visualStyleOptions: Array<{ id: TemplateVisualStyle; name: string; description: string }> = [
  { id: "minimal", name: "Minimal", description: "Clean product-first storefront with restrained contrast." },
  { id: "editorial", name: "Editorial", description: "Campaign-style layouts with larger storytelling moments." },
  { id: "bold", name: "Bold", description: "High-contrast colors and stronger product calls to action." },
  { id: "premium", name: "Premium", description: "Quieter luxury direction with refined spacing and darker accents." },
  { id: "playful", name: "Playful", description: "Brighter accents for approachable, energetic stores." },
];

export const pageStructureOptions: Array<{ id: TemplatePageStructure; name: string; description: string; pages: PageType[] }> = [
  {
    id: "quick",
    name: "Quick launch",
    description: "Core commerce pages only: home, product, cart, and checkout.",
    pages: ["home", "product", "cart", "checkout"],
  },
  {
    id: "full",
    name: "Full store",
    description: "A complete starter with collection, about, and contact pages included.",
    pages: ["home", "collection", "product", "about", "contact", "cart", "checkout"],
  },
  {
    id: "landing",
    name: "Landing store",
    description: "A focused home page plus product and checkout flow for simple launches.",
    pages: ["home", "product", "cart", "checkout"],
  },
];

export const starterTemplates: StarterTemplateConfig[] = [
  {
    id: "starter-fashion",
    name: "Atelier Minimal",
    category: "fashion",
    description: "Editorial fashion storefront with calm product storytelling.",
    colors: sampleTemplate.theme.colors,
    announcement: "Free shipping over $75",
    hero: {
      eyebrow: "Spring edit",
      title: "Quiet staples for daily rotation.",
      copy: "Build a polished fashion storefront around seasonal edits, premium basics, and restrained product storytelling.",
      cta: "Shop the edit",
    },
    categories: ["New arrivals", "Essentials", "Accessories", "Sale"],
    featurePoints: ["Reusable product stories", "Editorial collection pages", "Mobile-first buying paths"],
    newsletterTitle: "Drop alerts, launches, and edits.",
    products: sampleTemplate.products,
  },
  {
    id: "starter-home",
    name: "Haven Objects",
    category: "home",
    description: "Calm home goods storefront for curated objects and room edits.",
    colors: {
      canvas: "#f4f6f8",
      surface: "#ffffff",
      text: "#1f2933",
      muted: "#667085",
      primary: "#365f46",
      secondary: "#c7d6c2",
      accent: "#d99a5b",
      border: "#d8dde5",
    },
    announcement: "Room edits ship free this week",
    hero: {
      eyebrow: "Home edit",
      title: "Objects that make daily rooms feel intentional.",
      copy: "A composed home goods template for curated collections, material notes, and warm product discovery.",
      cta: "Shop the room",
    },
    categories: ["Lighting", "Textiles", "Tabletop", "Decor"],
    featurePoints: ["Room-based product stories", "Calm collection grids", "Trust cues for shipping and materials"],
    newsletterTitle: "Room notes, restocks, and seasonal edits.",
    products: [
      {
        id: "lamp",
        name: "Mica Table Lamp",
        category: "Lighting",
        price: 128,
        image: "linear-gradient(135deg, #c7d6c2, #ffffff)",
        badge: "New",
      },
      {
        id: "throw",
        name: "Linen Grid Throw",
        category: "Textiles",
        price: 86,
        image: "linear-gradient(135deg, #f4f6f8, #d99a5b)",
      },
      {
        id: "vase",
        name: "Low Stone Vase",
        category: "Decor",
        price: 54,
        image: "linear-gradient(135deg, #365f46, #c7d6c2)",
      },
    ],
  },
  {
    id: "starter-beauty",
    name: "Glow Theory",
    category: "beauty",
    description: "Soft beauty brand layout for skincare, bundles, and reviews.",
    colors: {
      canvas: "#fff7f3",
      surface: "#ffffff",
      text: "#2a1f2d",
      muted: "#7c6f7f",
      primary: "#c75d7c",
      secondary: "#f6c8d8",
      accent: "#f29f8f",
      border: "#ead7dd",
    },
    announcement: "Complimentary samples with every routine",
    hero: {
      eyebrow: "Daily ritual",
      title: "Skincare routines that feel considered.",
      copy: "A soft commerce layout for bundles, ingredient-led stories, reviews, and repeat purchase flows.",
      cta: "Build your routine",
    },
    categories: ["Cleansers", "Serums", "Moisturizers", "Kits"],
    featurePoints: ["Routine-first merchandising", "Trust and review sections", "Bundle-friendly product grids"],
    newsletterTitle: "Get routine notes and replenishment reminders.",
    products: [
      {
        id: "serum",
        name: "Barrier Repair Serum",
        category: "Skincare",
        price: 48,
        image: "linear-gradient(135deg, #f6c8d8, #ffffff)",
        badge: "New",
      },
      {
        id: "cream",
        name: "Cloud Cream",
        category: "Moisturizers",
        price: 56,
        image: "linear-gradient(135deg, #fff7f3, #f29f8f)",
      },
      {
        id: "kit",
        name: "Evening Reset Kit",
        category: "Bundles",
        price: 92,
        image: "linear-gradient(135deg, #ead7dd, #c75d7c)",
        badge: "Best seller",
      },
    ],
  },
  {
    id: "starter-electronics",
    name: "Circuit Supply",
    category: "electronics",
    description: "Clean product-first template for devices and accessories.",
    colors: {
      canvas: "#f3f6fb",
      surface: "#ffffff",
      text: "#111827",
      muted: "#667085",
      primary: "#2563eb",
      secondary: "#93c5fd",
      accent: "#22d3ee",
      border: "#d8e0ec",
    },
    announcement: "Fast dispatch on workspace essentials",
    hero: {
      eyebrow: "Desk upgrade",
      title: "Sharper gear for focused work.",
      copy: "A product-first electronics template with comparison-friendly cards, quick-add flows, and technical trust cues.",
      cta: "Shop devices",
    },
    categories: ["Audio", "Workspace", "Accessories", "Chargers"],
    featurePoints: ["Spec-ready product pages", "Accessory cross-sells", "Clean checkout confidence"],
    newsletterTitle: "New gear, setup notes, and restock alerts.",
    products: [
      {
        id: "headphones",
        name: "Studio Wireless Headphones",
        category: "Audio",
        price: 149,
        image: "linear-gradient(135deg, #93c5fd, #111827)",
        badge: "Popular",
      },
      {
        id: "dock",
        name: "USB-C Desk Dock",
        category: "Workspace",
        price: 89,
        image: "linear-gradient(135deg, #d8e0ec, #22d3ee)",
      },
      {
        id: "keyboard",
        name: "Low Profile Keyboard",
        category: "Accessories",
        price: 118,
        image: "linear-gradient(135deg, #f3f6fb, #2563eb)",
        badge: "New",
      },
    ],
  },
  {
    id: "starter-digital",
    name: "Studio Downloads",
    category: "digital",
    description: "Digital product storefront for templates, assets, courses, and bundles.",
    colors: {
      canvas: "#f5f7ff",
      surface: "#ffffff",
      text: "#182034",
      muted: "#64708b",
      primary: "#4f46e5",
      secondary: "#c7d2fe",
      accent: "#14b8a6",
      border: "#d9def2",
    },
    announcement: "Instant downloads with lifetime updates",
    hero: {
      eyebrow: "Digital launch",
      title: "Downloadable tools for faster creative work.",
      copy: "A focused digital-product storefront for templates, resource bundles, licenses, and instant delivery flows.",
      cta: "Browse downloads",
    },
    categories: ["Templates", "Assets", "Courses", "Bundles"],
    featurePoints: ["Instant file delivery", "License and update messaging", "Bundle-friendly product pages"],
    newsletterTitle: "New drops, update notes, and creator resources.",
    products: [
      {
        id: "notion-dashboard",
        name: "Creator OS Dashboard",
        category: "Templates",
        price: 39,
        image: "linear-gradient(135deg, #c7d2fe, #4f46e5)",
        badge: "Popular",
      },
      {
        id: "icon-pack",
        name: "Interface Icon Pack",
        category: "Assets",
        price: 24,
        image: "linear-gradient(135deg, #f5f7ff, #14b8a6)",
      },
      {
        id: "launch-kit",
        name: "Digital Launch Kit",
        category: "Bundles",
        price: 79,
        image: "linear-gradient(135deg, #182034, #c7d2fe)",
        badge: "Bundle",
      },
    ],
  },
  {
    id: "starter-food",
    name: "Harvest Pantry",
    category: "food",
    description: "Warm grocery and packaged goods storefront.",
    colors: {
      canvas: "#fbf7ed",
      surface: "#ffffff",
      text: "#2b2118",
      muted: "#76695f",
      primary: "#3f7d20",
      secondary: "#f5c16c",
      accent: "#d65a31",
      border: "#e6d9c5",
    },
    announcement: "Local delivery windows open weekly",
    hero: {
      eyebrow: "Pantry drop",
      title: "Small-batch staples for everyday shelves.",
      copy: "A warm packaged-goods storefront for curated pantry edits, subscriptions, and local delivery messaging.",
      cta: "Shop pantry",
    },
    categories: ["Breakfast", "Pantry", "Preserves", "Bundles"],
    featurePoints: ["Batch and origin storytelling", "Simple subscriptions", "Delivery-first checkout cues"],
    newsletterTitle: "Fresh batches, seasonal notes, and pantry picks.",
    products: [
      {
        id: "granola",
        name: "Maple Seed Granola",
        category: "Breakfast",
        price: 16,
        image: "linear-gradient(135deg, #f5c16c, #fbf7ed)",
        badge: "Small batch",
      },
      {
        id: "olive-oil",
        name: "Cold Press Olive Oil",
        category: "Pantry",
        price: 28,
        image: "linear-gradient(135deg, #3f7d20, #e6d9c5)",
      },
      {
        id: "jam",
        name: "Stone Fruit Jam",
        category: "Preserves",
        price: 12,
        image: "linear-gradient(135deg, #d65a31, #f5c16c)",
      },
    ],
  },
];

export function createTemplateFromStarter(input: string | TemplateCreationOptions): StoreTemplate {
  const options = typeof input === "string" ? defaultCreationOptions(input) : input;
  const starter = starterTemplates.find((template) => template.id === options.starterId) ?? starterTemplates[0];
  const baseTemplate = structuredClone(sampleTemplate);
  const structure = pageStructureOptions.find((item) => item.id === options.structure) ?? pageStructureOptions[0];
  const style = visualStyles[options.visualStyle] ?? visualStyles.editorial;
  const templateName = options.name?.trim() || starter.name;

  return {
    ...baseTemplate,
    id: `template-${Date.now()}`,
    name: templateName,
    category: options.category ?? starter.category,
    theme: {
      ...baseTemplate.theme,
      colors: resolveStarterPalette(starter.colors, options.visualStyle),
      typography: style.typography,
      layout: style.layout,
    },
    products: starter.products,
    pages: structure.pages.map((pageType) => {
      const page = baseTemplate.pages.find((candidate) => candidate.type === pageType) ?? createPage(pageType);

      return {
        ...page,
        seoTitle: page.type === "home" ? `${templateName} storefront` : page.seoTitle,
        sections: customizeSectionsForStructure(page, options.structure).map((section) =>
          customizeSection(section, {
            productCardStyle: style.productCardStyle,
            starter,
            structure: options.structure,
            templateName,
          }),
        ),
      };
    }),
  };
}

function defaultCreationOptions(starterId: string): TemplateCreationOptions {
  return {
    starterId,
    structure: "full",
    visualStyle: "editorial",
  };
}

function customizeSectionsForStructure(page: TemplatePage, structure: TemplatePageStructure): TemplateSection[] {
  if (structure !== "landing" || page.type !== "home") {
    return page.sections;
  }

  const landingSections = new Set(["announcement", "header", "hero", "productGrid", "reviews", "trustBand", "newsletter", "footer"]);

  return page.sections.filter((section) => landingSections.has(section.type));
}

function customizeSection(
  section: TemplateSection,
  {
    productCardStyle,
    starter,
    structure,
    templateName,
  }: {
    productCardStyle: "elevated" | "minimal" | "editorial";
    starter: StarterTemplateConfig;
    structure: TemplatePageStructure;
    templateName: string;
  },
) {
  if (section.type === "announcement") {
    return {
      ...section,
      settings: { ...section.settings, text: starter.announcement },
    };
  }

  if (section.type === "header") {
    return {
      ...section,
      settings: { ...section.settings, logo: templateName.split(" ")[0].toUpperCase() },
    };
  }

  if (section.type === "hero") {
    return {
      ...section,
      settings: { ...section.settings, ...starter.hero },
    };
  }

  if (section.type === "categoryStrip") {
    return {
      ...section,
      settings: { ...section.settings, categories: starter.categories },
    };
  }

  if (section.type === "collectionGrid") {
    return {
      ...section,
      settings: {
        ...section.settings,
        description: `Browse ${starter.name}'s core categories and featured edits.`,
        productCount: starter.products.length,
        statusChips: starter.categories.slice(0, 3),
        title: `${starter.category} collection`,
      },
    };
  }

  if (section.type === "productGrid") {
    return {
      ...section,
      settings: {
        ...section.settings,
        cardStyle: productCardStyle,
        productCount: starter.products.length,
        quickAdd: structure === "landing" ? "show" : section.settings.quickAdd,
        title: `${starter.category} favorites`,
      },
    };
  }

  if (section.type === "productDetail") {
    return {
      ...section,
      settings: {
        ...section.settings,
        socialProof: starter.featurePoints,
        subtitle: starter.hero.copy,
      },
    };
  }

  if (section.type === "featureBand") {
    return {
      ...section,
      settings: { ...section.settings, title: `${templateName} is ready to customize`, points: starter.featurePoints },
    };
  }

  if (section.type === "reviews") {
    return {
      ...section,
      settings: {
        ...section.settings,
        title: structure === "landing" ? "Why customers come back" : section.settings.title,
      },
    };
  }

  if (section.type === "newsletter") {
    return {
      ...section,
      settings: { ...section.settings, title: starter.newsletterTitle },
    };
  }

  return section;
}

const visualStyles: Record<
  TemplateVisualStyle,
  Pick<StoreTemplate["theme"], "layout" | "typography"> & {
    productCardStyle: "elevated" | "minimal" | "editorial";
  }
> = {
  minimal: {
    layout: { density: "comfortable", maxWidth: 1120, radius: 8, spacing: 18 },
    productCardStyle: "minimal",
    typography: { body: "Geist", heading: "Geist", scale: "balanced" },
  },
  editorial: {
    layout: { density: "spacious", maxWidth: 1180, radius: 14, spacing: 22 },
    productCardStyle: "editorial",
    typography: { body: "Geist", heading: "Geist", scale: "editorial" },
  },
  bold: {
    layout: { density: "comfortable", maxWidth: 1200, radius: 10, spacing: 20 },
    productCardStyle: "elevated",
    typography: { body: "Geist", heading: "Geist", scale: "editorial" },
  },
  premium: {
    layout: { density: "spacious", maxWidth: 1160, radius: 6, spacing: 24 },
    productCardStyle: "minimal",
    typography: { body: "Geist", heading: "Geist", scale: "editorial" },
  },
  playful: {
    layout: { density: "comfortable", maxWidth: 1140, radius: 18, spacing: 20 },
    productCardStyle: "elevated",
    typography: { body: "Geist", heading: "Geist", scale: "balanced" },
  },
};

export function resolveStarterPalette(
  colors: StoreTemplate["theme"]["colors"],
  visualStyle: TemplateVisualStyle,
): StoreTemplate["theme"]["colors"] {
  if (visualStyle === "minimal") {
    return {
      ...colors,
      canvas: mixHex(colors.canvas, "#ffffff", 0.58),
      surface: "#ffffff",
      muted: mixHex(colors.muted, colors.text, 0.16),
      secondary: mixHex(colors.secondary, "#ffffff", 0.62),
      accent: mixHex(colors.primary, "#ffffff", 0.28),
      border: mixHex(colors.border, "#ffffff", 0.42),
    };
  }

  if (visualStyle === "bold") {
    return {
      ...colors,
      canvas: mixHex(colors.canvas, "#ffffff", 0.18),
      primary: mixHex(colors.primary, colors.text, 0.28),
      secondary: mixHex(colors.secondary, colors.primary, 0.22),
      accent: mixHex(colors.accent, colors.primary, 0.18),
      border: mixHex(colors.border, colors.primary, 0.12),
    };
  }

  if (visualStyle === "premium") {
    return {
      ...colors,
      canvas: mixHex(colors.canvas, "#0f172a", 0.08),
      surface: mixHex(colors.surface, colors.canvas, 0.22),
      text: mixHex(colors.text, "#000000", 0.16),
      muted: mixHex(colors.muted, "#000000", 0.1),
      primary: mixHex(colors.primary, "#111827", 0.34),
      secondary: mixHex(colors.secondary, "#ffffff", 0.2),
      accent: mixHex(colors.accent, colors.primary, 0.24),
      border: mixHex(colors.border, "#111827", 0.08),
    };
  }

  if (visualStyle === "playful") {
    return {
      ...colors,
      canvas: mixHex(colors.canvas, "#ffffff", 0.22),
      primary: mixHex(colors.primary, colors.accent, 0.16),
      secondary: mixHex(colors.secondary, "#ffffff", 0.28),
      accent: mixHex(colors.accent, "#ffffff", 0.12),
      border: mixHex(colors.border, colors.secondary, 0.18),
    };
  }

  return colors;
}

function mixHex(baseHex: string, overlayHex: string, amount: number) {
  const base = parseHex(baseHex);
  const overlay = parseHex(overlayHex);

  if (!base || !overlay) {
    return baseHex;
  }

  return toHex({
    b: Math.round(base.b * (1 - amount) + overlay.b * amount),
    g: Math.round(base.g * (1 - amount) + overlay.g * amount),
    r: Math.round(base.r * (1 - amount) + overlay.r * amount),
  });
}

function parseHex(value: string) {
  const normalized = value.trim().replace("#", "");

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    b: Number.parseInt(normalized.slice(4, 6), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    r: Number.parseInt(normalized.slice(0, 2), 16),
  };
}

function toHex({ b, g, r }: { b: number; g: number; r: number }) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}
