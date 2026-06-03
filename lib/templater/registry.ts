import type { SectionType } from "./schema";

export type SectionCapability = {
  type: SectionType;
  label: string;
  description: string;
  editableSettings: string[];
};

export const sectionRegistry: Record<SectionType, SectionCapability> = {
  announcement: {
    type: "announcement",
    label: "Announcement bar",
    description: "Short global promo or shipping message.",
    editableSettings: ["text", "alignment"],
  },
  header: {
    type: "header",
    label: "Header",
    description: "Logo, links, and primary navigation.",
    editableSettings: ["logo", "links"],
  },
  hero: {
    type: "hero",
    label: "Hero",
    description: "First viewport merchandising section.",
    editableSettings: ["variant", "eyebrow", "title", "copy", "cta"],
  },
  categoryStrip: {
    type: "categoryStrip",
    label: "Category strip",
    description: "Fast links into collections.",
    editableSettings: ["categories"],
  },
  collectionGrid: {
    type: "collectionGrid",
    label: "Collection grid",
    description: "Collection page header, filters, sort, and products.",
    editableSettings: ["eyebrow", "title", "description", "statusChips", "filters", "sortLabel", "productGridLayout"],
  },
  productDetail: {
    type: "productDetail",
    label: "Product detail",
    description: "Product gallery, variants, details, and buy action.",
    editableSettings: ["badge", "title", "subtitle", "socialProof", "variants", "details", "trustItems"],
  },
  cartSummary: {
    type: "cartSummary",
    label: "Cart summary",
    description: "Cart line items, order totals, and checkout CTA.",
    editableSettings: ["title", "note", "incentive", "perks"],
  },
  checkoutSummary: {
    type: "checkoutSummary",
    label: "Checkout summary",
    description: "Checkout steps, form preview, and order summary.",
    editableSettings: ["title", "subtitle", "paymentMethods", "steps", "reassurance"],
  },
  productGrid: {
    type: "productGrid",
    label: "Product grid",
    description: "Reusable product listing module.",
    editableSettings: ["title", "columns", "productCount", "productGridLayout", "productCardStyle", "showQuickAdd"],
  },
  promoTiles: {
    type: "promoTiles",
    label: "Promo tiles",
    description: "Editorial tiles for offers or collections.",
    editableSettings: ["title", "tiles"],
  },
  reviews: {
    type: "reviews",
    label: "Reviews",
    description: "Customer quotes and social proof.",
    editableSettings: ["title", "reviews"],
  },
  trustBand: {
    type: "trustBand",
    label: "Trust band",
    description: "Shipping, returns, guarantees, and support.",
    editableSettings: ["items"],
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "Common questions before checkout.",
    editableSettings: ["title", "questions"],
  },
  featureBand: {
    type: "featureBand",
    label: "Feature band",
    description: "Trust, positioning, or service benefits.",
    editableSettings: ["title", "points"],
  },
  newsletter: {
    type: "newsletter",
    label: "Newsletter",
    description: "Email capture block.",
    editableSettings: ["title", "cta"],
  },
  footer: {
    type: "footer",
    label: "Footer",
    description: "Support, social, and legal navigation.",
    editableSettings: ["columns"],
  },
};
