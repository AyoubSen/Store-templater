import { sampleTemplate } from "./sample-template";
import type { StoreCategory, StoreTemplate } from "./schema";

type StarterTemplateConfig = {
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

export function createTemplateFromStarter(starterId: string): StoreTemplate {
  const starter = starterTemplates.find((template) => template.id === starterId) ?? starterTemplates[0];
  const baseTemplate = structuredClone(sampleTemplate);

  return {
    ...baseTemplate,
    id: `template-${Date.now()}`,
    name: starter.name,
    category: starter.category,
    theme: {
      ...baseTemplate.theme,
      colors: starter.colors,
    },
    products: starter.products,
    pages: baseTemplate.pages.map((page) => ({
      ...page,
      seoTitle: page.type === "home" ? `${starter.name} storefront` : page.seoTitle,
      sections: page.sections.map((section) => {
        if (section.type === "announcement") {
          return {
            ...section,
            settings: { ...section.settings, text: starter.announcement },
          };
        }

        if (section.type === "header") {
          return {
            ...section,
            settings: { ...section.settings, logo: starter.name.split(" ")[0].toUpperCase() },
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

        if (section.type === "productGrid") {
          return {
            ...section,
            settings: { ...section.settings, title: `${starter.category} favorites`, productCount: starter.products.length },
          };
        }

        if (section.type === "featureBand") {
          return {
            ...section,
            settings: { ...section.settings, title: `${starter.name} is ready to customize`, points: starter.featurePoints },
          };
        }

        if (section.type === "newsletter") {
          return {
            ...section,
            settings: { ...section.settings, title: starter.newsletterTitle },
          };
        }

        return section;
      }),
    })),
  };
}
