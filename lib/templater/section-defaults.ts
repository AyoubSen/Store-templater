import type { SectionType, TemplateSection } from "./schema";

const defaultStyle = {
  spacing: "balanced",
  layoutDensity: "comfortable",
  background: "default",
  alignment: "left",
  buttonStyle: "solid",
  visibleOnDesktop: true,
  visibleOnTablet: true,
  visibleOnMobile: true,
};

const defaultSettingsByType: Record<SectionType, TemplateSection["settings"]> = {
  announcement: {
    text: "Free shipping on orders over $75",
    alignment: "center",
  },
  header: {
    logo: "STUDIO",
    links: ["Shop", "About", "Contact"],
  },
  hero: {
    ...defaultStyle,
    eyebrow: "New collection",
    title: "A storefront built around your brand.",
    copy: "Customize every section, token, and product story from a visual builder.",
    cta: "Shop now",
  },
  categoryStrip: {
    ...defaultStyle,
    categories: ["New", "Best sellers", "Bundles", "Sale"],
  },
  collectionGrid: {
    ...defaultStyle,
    eyebrow: "Collection",
    title: "Shop the full edit",
    description: "Browse a storefront-ready collection page with filters, sorting, and product cards.",
    statusChips: ["In stock", "Ships in 2 days"],
    productCount: 6,
    productCardStyle: "elevated",
    showQuickAdd: true,
    showFilters: true,
    showSort: true,
    filters: ["Category", "Size", "Color", "Price"],
    sortLabel: "Featured",
  },
  productDetail: {
    ...defaultStyle,
    mediaLayout: "gallery",
    mediaEmphasis: "balanced",
    badge: "Best seller",
    title: "Signature product page",
    subtitle: "A focused product detail layout with gallery, variants, and purchase action.",
    socialProof: ["★★★★★ 4.9", "128 reviews", "Low stock"],
    variants: ["S", "M", "L", "XL"],
    details: ["Premium materials", "Ships in 2 business days", "30-day returns"],
    trustItems: ["Secure checkout", "Free returns", "Ships tracked"],
  },
  cartSummary: {
    ...defaultStyle,
    title: "Your cart",
    note: "You are $24 away from free shipping.",
    incentive: "Add one more item to unlock free express shipping and a launch gift.",
    perks: ["Secure checkout", "Easy returns", "Fast dispatch"],
  },
  checkoutSummary: {
    ...defaultStyle,
    title: "Checkout",
    subtitle: "Preview a conversion-focused checkout flow.",
    paymentMethods: ["Shop Pay", "Apple Pay", "Card"],
    steps: ["Information", "Shipping", "Payment"],
    reassurance: "Encrypted payment, order tracking, and flexible returns included.",
  },
  productGrid: {
    ...defaultStyle,
    title: "Featured products",
    columns: 3,
    productCount: 3,
    productCardStyle: "elevated",
    showQuickAdd: true,
  },
  promoTiles: {
    ...defaultStyle,
    title: "Shop the latest edits",
    tiles: ["New season staples", "Bundle and save", "Last-chance pieces"],
  },
  reviews: {
    ...defaultStyle,
    title: "Loved by customers",
    reviews: ["Beautiful quality and fast shipping.", "The template made our launch feel premium.", "Clean design with all the sections we needed."],
  },
  trustBand: {
    ...defaultStyle,
    items: ["Free shipping over $75", "30-day returns", "Secure checkout", "Human support"],
  },
  faq: {
    ...defaultStyle,
    title: "Questions before checkout",
    questions: ["How fast is shipping?", "Can I return my order?", "Do you ship internationally?"],
  },
  featureBand: {
    ...defaultStyle,
    background: "primary",
    title: "Why customers choose us",
    points: ["Fast shipping", "Secure checkout", "Easy returns"],
  },
  newsletter: {
    ...defaultStyle,
    title: "Get launch notes and private offers.",
    cta: "Subscribe",
  },
  footer: {
    columns: ["Support", "Social", "Legal"],
  },
};

export function createSection(type: SectionType): TemplateSection {
  return {
    id: `${type}-${Date.now()}`,
    type,
    name: sectionName(type),
    enabled: true,
    settings: structuredClone(defaultSettingsByType[type]),
  };
}

function sectionName(type: SectionType) {
  const names: Record<SectionType, string> = {
    announcement: "Announcement",
    header: "Header",
    hero: "Hero",
    categoryStrip: "Categories",
    collectionGrid: "Collection grid",
    productDetail: "Product detail",
    cartSummary: "Cart summary",
    checkoutSummary: "Checkout summary",
    productGrid: "Product grid",
    promoTiles: "Promo tiles",
    reviews: "Reviews",
    trustBand: "Trust band",
    faq: "FAQ",
    featureBand: "Feature band",
    newsletter: "Newsletter",
    footer: "Footer",
  };

  return names[type];
}
