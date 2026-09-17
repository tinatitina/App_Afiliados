export type Marketplace = "amazon" | "mercadolivre" | "shopee";

export type Category =
  | "fraldas"
  | "lencos-umedecidos"
  | "pomada"
  | "formula-infantil"
  | "lanches-saudaveis";

/** Uma oferta concreta de um produto em um marketplace específico. */
export interface Offer {
  marketplace: Marketplace;
  /** Título do anúncio como aparece no marketplace (pode variar do nome canônico do produto). */
  title: string;
  price: number;
  /** Preço "de tabela" antes do desconto, quando conhecido (para o badge de % off). */
  originalPrice?: number;
  currency: "BRL";
  /** URL do produto. Vira link de afiliado ao passar por `resolveAffiliateUrl`. */
  url: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  available: boolean;
  /** ISO date. Para ofertas manuais, é a data em que o preço foi conferido pela última vez. */
  updatedAt: string;
  /** true quando o preço veio de catálogo manual (precisa revisão periódica), false quando é ao vivo via API. */
  isManualPrice: boolean;
}

/** Offer já resolvida para exibição: link de afiliado aplicado + métricas calculadas. */
export interface DisplayOffer extends Offer {
  /** Preço dividido pela quantidade de unidades do pacote (null se não der pra calcular). */
  unitPrice: number | null;
  /** % de desconto vs. originalPrice (null se não houver desconto). */
  discountPercent: number | null;
}

/** Produto canônico: agrupa ofertas equivalentes de diferentes marketplaces. */
export interface Product {
  id: string;
  category: Category;
  brand: string;
  name: string;
  size?: string;
  packCount?: number;
  imageUrl?: string;
  /** Ofertas carregadas manualmente (Amazon, Mercado Livre, Shopee). */
  manualOffers: Offer[];
}

/** Produto já resolvido para exibição: catálogo manual + ofertas ao vivo mescladas. */
export interface ResolvedProduct extends Omit<Product, "manualOffers"> {
  offers: DisplayOffer[];
  bestOffer: DisplayOffer | null;
}

export interface SearchFilters {
  query?: string;
  category?: Category;
  brand?: string;
  size?: string;
  marketplace?: Marketplace;
}
