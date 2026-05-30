export type StoreCategory =
  | "fashion"
  | "beauty"
  | "electronics"
  | "home"
  | "food"
  | "digital";

export type PageType = "home" | "collection" | "product" | "cart" | "checkout" | "about" | "contact";

export type SectionType =
  | "announcement"
  | "header"
  | "hero"
  | "categoryStrip"
  | "collectionGrid"
  | "productDetail"
  | "cartSummary"
  | "checkoutSummary"
  | "productGrid"
  | "promoTiles"
  | "reviews"
  | "trustBand"
  | "faq"
  | "featureBand"
  | "newsletter"
  | "footer";

export type ThemeTokens = {
  colors: {
    canvas: string;
    surface: string;
    text: string;
    muted: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
  };
  typography: {
    heading: string;
    body: string;
    scale: "compact" | "balanced" | "editorial";
  };
  layout: {
    radius: number;
    spacing: number;
    maxWidth: number;
    density: "compact" | "comfortable" | "spacious";
  };
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  imagePositionX?: number;
  imagePositionY?: number;
  imageZoom?: number;
  badge?: string;
};

export type TemplateSection<TSettings extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  type: SectionType;
  name: string;
  enabled: boolean;
  settings: TSettings;
};

export type TemplatePage = {
  id: string;
  type: PageType;
  name: string;
  sections: TemplateSection[];
};

export type StoreTemplate = {
  schemaVersion?: number;
  id: string;
  name: string;
  category: StoreCategory;
  theme: ThemeTokens;
  products: Product[];
  pages: TemplatePage[];
};
