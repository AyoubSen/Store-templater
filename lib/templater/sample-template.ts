import type { StoreTemplate } from "./schema";

export const sampleTemplate: StoreTemplate = {
  id: "atelier-minimal",
  name: "Atelier Minimal",
  category: "fashion",
  theme: {
    colors: {
      canvas: "#f7f4ef",
      surface: "#ffffff",
      text: "#1f2933",
      muted: "#6b7280",
      primary: "#1f7a5f",
      secondary: "#f2c078",
      accent: "#ef6f6c",
      border: "#ded7ce",
    },
    typography: {
      heading: "Geist",
      body: "Geist",
      scale: "balanced",
    },
    layout: {
      radius: 10,
      spacing: 18,
      maxWidth: 1120,
      density: "comfortable",
    },
  },
  products: [
    {
      id: "linen-shirt",
      name: "Linen Camp Shirt",
      category: "New arrivals",
      price: 84,
      image: "linear-gradient(135deg, #d7eee5, #f2c078)",
      badge: "New",
    },
    {
      id: "canvas-tote",
      name: "Structured Canvas Tote",
      category: "Accessories",
      price: 62,
      image: "linear-gradient(135deg, #f7d9d7, #ffffff)",
    },
    {
      id: "wide-trouser",
      name: "Wide Leg Trouser",
      category: "Essentials",
      price: 128,
      image: "linear-gradient(135deg, #d8d3c7, #6f7f74)",
      badge: "Best seller",
    },
  ],
  pages: [
    {
      id: "home",
      type: "home",
      name: "Home",
      sections: [
        {
          id: "announcement",
          type: "announcement",
          name: "Announcement",
          enabled: true,
          settings: { text: "Free shipping over $75", alignment: "center" },
        },
        {
          id: "header",
          type: "header",
          name: "Header",
          enabled: true,
          settings: { logo: "ATELIER", links: ["Shop", "Journal", "About"] },
        },
        {
          id: "hero",
          type: "hero",
          name: "Hero",
          enabled: true,
          settings: {
            eyebrow: "Spring edit",
            title: "Quiet staples for daily rotation.",
            copy: "Build a storefront from editable sections, brand tokens, and commerce-ready blocks.",
            cta: "Shop the edit",
          },
        },
        {
          id: "category-strip",
          type: "categoryStrip",
          name: "Categories",
          enabled: true,
          settings: { categories: ["New arrivals", "Essentials", "Accessories", "Sale"] },
        },
        {
          id: "product-grid",
          type: "productGrid",
          name: "Product grid",
          enabled: true,
          settings: { title: "Featured products", columns: 3 },
        },
        {
          id: "feature-band",
          type: "featureBand",
          name: "Feature band",
          enabled: true,
          settings: {
            title: "Designed for conversion",
            points: ["Reusable sections", "Theme tokens", "Responsive preview"],
          },
        },
        {
          id: "newsletter",
          type: "newsletter",
          name: "Newsletter",
          enabled: true,
          settings: { title: "Drop alerts, launches, and edits.", cta: "Join list" },
        },
        {
          id: "footer",
          type: "footer",
          name: "Footer",
          enabled: true,
          settings: { columns: ["Support", "Social", "Legal"] },
        },
      ],
    },
  ],
};
