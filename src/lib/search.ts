import { products } from "@/data/products";
import { searchMercadoLivre } from "@/lib/providers/mercadolivre";
import type { Offer, Product, ResolvedProduct, SearchFilters } from "@/lib/types";

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

function pickBestOffer(offers: Offer[]): Offer | null {
  const available = offers.filter((o) => o.available);
  const pool = available.length > 0 ? available : offers;
  if (pool.length === 0) return null;
  return pool.reduce((best, current) => (current.price < best.price ? current : best));
}

async function resolveProduct(product: Product): Promise<ResolvedProduct> {
  const liveOffers = product.mercadoLivreQuery
    ? await searchMercadoLivre(product.mercadoLivreQuery, 3)
    : [];

  const offers = [...product.manualOffers, ...liveOffers];

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
 */
export async function searchProducts(filters: SearchFilters = {}): Promise<ResolvedProduct[]> {
  const matched = products.filter((p) => matchesFilters(p, filters));
  const resolved = await Promise.all(matched.map(resolveProduct));

  // Produtos sem nenhuma oferta disponível vão para o final.
  return resolved.sort((a, b) => {
    if (a.bestOffer && !b.bestOffer) return -1;
    if (!a.bestOffer && b.bestOffer) return 1;
    if (!a.bestOffer || !b.bestOffer) return 0;
    return a.bestOffer.price - b.bestOffer.price;
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
