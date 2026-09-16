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
  currency: "BRL";
  /** URL final já com os parâmetros de afiliado aplicados. */
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

/** Produto canônico: agrupa ofertas equivalentes de diferentes marketplaces. */
export interface Product {
  id: string;
  category: Category;
  brand: string;
  name: string;
  size?: string;
  packCount?: number;
  imageUrl?: string;
  /** Termo de busca usado para consultar a API do Mercado Livre em tempo real. */
  mercadoLivreQuery?: string;
  /** Ofertas carregadas manualmente (Amazon, Shopee, etc.). */
  manualOffers: Offer[];
}

/** Produto já resolvido para exibição: catálogo manual + ofertas ao vivo mescladas. */
export interface ResolvedProduct extends Omit<Product, "manualOffers"> {
  offers: Offer[];
  bestOffer: Offer | null;
}

export interface SearchFilters {
  query?: string;
  category?: Category;
  brand?: string;
  size?: string;
}
