import { sampleTemplate } from "./sample-template";
import type { StoreCategory, StoreTemplate } from "./schema";

type StarterTemplateConfig = {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  colors: StoreTemplate["theme"]["colors"];
  products: StoreTemplate["products"];
};

export const starterTemplates: StarterTemplateConfig[] = [
  {
    id: "starter-fashion",
    name: "Atelier Minimal",
    category: "fashion",
    description: "Editorial fashion storefront with calm product storytelling.",
    colors: sampleTemplate.theme.colors,
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
  };
}
