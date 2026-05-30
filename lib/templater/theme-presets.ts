import type { ThemeTokens } from "./schema";

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  colors: ThemeTokens["colors"];
};

export const themePresets: ThemePreset[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean neutral storefront with strong contrast.",
    colors: {
      canvas: "#f8fafc",
      surface: "#ffffff",
      text: "#111827",
      muted: "#64748b",
      primary: "#111827",
      secondary: "#e2e8f0",
      accent: "#2563eb",
      border: "#d8dde5",
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Warm fashion-inspired palette.",
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
  },
  {
    id: "fresh",
    name: "Fresh",
    description: "Bright wellness and beauty colors.",
    colors: {
      canvas: "#f4fbf7",
      surface: "#ffffff",
      text: "#173126",
      muted: "#5f766b",
      primary: "#0f766e",
      secondary: "#a7f3d0",
      accent: "#f9a8d4",
      border: "#cfebdc",
    },
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "Dark premium palette for high-end goods.",
    colors: {
      canvas: "#f5f1e8",
      surface: "#fffaf0",
      text: "#18130d",
      muted: "#726657",
      primary: "#7c2d12",
      secondary: "#d6b56d",
      accent: "#8b5cf6",
      border: "#ded2bd",
    },
  },
  {
    id: "tech",
    name: "Tech",
    description: "Crisp blue palette for gadgets and accessories.",
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
  },
  {
    id: "warm",
    name: "Warm",
    description: "Natural palette for food and home stores.",
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
  },
];
