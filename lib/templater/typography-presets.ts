import type { ThemeTokens } from "./schema";

export type TypographyPreset = {
  id: string;
  name: string;
  description: string;
  typography: ThemeTokens["typography"];
};

export const typographyPresets: TypographyPreset[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, neutral, product-focused typography.",
    typography: { heading: "Geist", body: "Geist", scale: "balanced" },
  },
  {
    id: "compact",
    name: "Compact",
    description: "Tighter scale for dense commerce pages.",
    typography: { heading: "Geist", body: "Geist", scale: "compact" },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Larger headings for campaign-style stores.",
    typography: { heading: "Geist", body: "Geist", scale: "editorial" },
  },
];
