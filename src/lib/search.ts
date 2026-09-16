import { products } from "@/data/products";
import { resolveAffiliateUrl } from "@/lib/affiliate";
import { computeDiscountPercent, computeUnitPrice } from "@/lib/pricing";
import { searchMercadoLivre } from "@/lib/providers/mercadolivre";
import type { DisplayOffer, Offer, Product, ResolvedProduct, SearchFilters } from "@/lib/types";

function matchesFilters(product: Product, filters: SearchFilters): boolean {
  if (filters.category && product.category !== filters.category) return false;
  if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
  if (filters.size && product.size?.toLowerCase() !== filters.size.toLowerCase()) return false;

  if (filters.query) {
    const haystack = `${product.brand} ${product.name} ${product.size ?? ""}`.toLowerCase();
    const needle = filters.query.toLowerCase().trim();
    if (needle && !haystack.includes(needle)) return false;
  }

  return true;
}

/**
 * Prepara uma oferta bruta para exibição: aplica o link de afiliado
 * correto pra plataforma e calcula preço/unidade e % de desconto.
 * Esse é o único lugar do app que deve chamar `resolveAffiliateUrl`.
 */
function toDisplayOffer(offer: Offer, packCount?: number): DisplayOffer {
  return {
    ...offer,
    url: resolveAffiliateUrl(offer.marketplace, offer.url),
    unitPrice: computeUnitPrice(offer.price, packCount),
    discountPercent: computeDiscountPercent(offer.price, offer.originalPrice),
  };
}

/** Preço de comparação: por unidade quando dá pra calcular, senão o preço total. */
function comparablePrice(offer: DisplayOffer): number {
  return offer.unitPrice ?? offer.price;
}

function pickBestOffer(offers: DisplayOffer[]): DisplayOffer | null {
  const available = offers.filter((o) => o.available);
  const pool = available.length > 0 ? available : offers;
  if (pool.length === 0) return null;
  return pool.reduce((best, current) => (comparablePrice(current) < comparablePrice(best) ? current : best));
}

async function resolveProduct(product: Product, marketplaceFilter?: Offer["marketplace"]): Promise<ResolvedProduct> {
  const liveOffers = product.mercadoLivreQuery
    ? await searchMercadoLivre(product.mercadoLivreQuery, 3)
    : [];

  let offers = [...product.manualOffers, ...liveOffers].map((o) => toDisplayOffer(o, product.packCount));

  if (marketplaceFilter) {
    offers = offers.filter((o) => o.marketplace === marketplaceFilter);
  }

  return {
    id: product.id,
    category: product.category,
    brand: product.brand,
    name: product.name,
    size: product.size,
    packCount: product.packCount,
    imageUrl: product.imageUrl,
    mercadoLivreQuery: product.mercadoLivreQuery,
    offers,
    bestOffer: pickBestOffer(offers),
  };
}

/**
 * Busca produtos no catálogo aplicando filtros e resolve as ofertas
 * (manuais + Mercado Livre ao vivo) em paralelo para cada resultado.
 * Ordena por preço/unidade — não pelo preço total do pacote — porque é
 * isso que permite comparar embalagens de tamanhos diferentes de verdade.
 */
export async function searchProducts(filters: SearchFilters = {}): Promise<ResolvedProduct[]> {
  const matched = products.filter((p) => matchesFilters(p, filters));
  const resolved = await Promise.all(matched.map((p) => resolveProduct(p, filters.marketplace)));

  const withOffers = filters.marketplace ? resolved.filter((p) => p.offers.length > 0) : resolved;

  return withOffers.sort((a, b) => {
    if (a.bestOffer && !b.bestOffer) return -1;
    if (!a.bestOffer && b.bestOffer) return 1;
    if (!a.bestOffer || !b.bestOffer) return 0;
    return comparablePrice(a.bestOffer) - comparablePrice(b.bestOffer);
  });
}

export async function getProductById(id: string): Promise<ResolvedProduct | null> {
  const product = products.find((p) => p.id === id);
  if (!product) return null;
  return resolveProduct(product);
}

export function getAvailableBrands(category?: Product["category"]): string[] {
  const filtered = category ? products.filter((p) => p.category === category) : products;
  return Array.from(new Set(filtered.map((p) => p.brand))).sort();
}

export function getAvailableSizes(category?: Product["category"]): string[] {
  const filtered = category ? products.filter((p) => p.category === category) : products;
  return Array.from(new Set(filtered.map((p) => p.size).filter((s): s is string => Boolean(s))));
}

/**
 * As N ofertas com maior % de desconto no catálogo manual inteiro
 * (independente de filtro/categoria) — vira o bloco "Maiores Ofertas".
 * Só olha ofertas manuais porque o desconto (originalPrice) é um dado
 * que você cadastra; a API do Mercado Livre não devolve preço "de".
 */
export function getTopDeals(limit = 6): Array<{ product: Product; offer: DisplayOffer }> {
  const deals = products.flatMap((product) =>
    product.manualOffers
      .map((offer) => toDisplayOffer(offer, product.packCount))
      .filter((offer) => offer.discountPercent !== null)
      .map((offer) => ({ product, offer })),
  );

  return deals
    .sort((a, b) => (b.offer.discountPercent ?? 0) - (a.offer.discountPercent ?? 0))
    .slice(0, limit);
}
