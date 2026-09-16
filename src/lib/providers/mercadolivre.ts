import { buildMercadoLivreAffiliateUrl } from "@/lib/affiliate";
import type { Offer } from "@/lib/types";

const SITE_ID = "MLB"; // Brasil
const SEARCH_ENDPOINT = `https://api.mercadolibre.com/sites/${SITE_ID}/search`;

interface MLSearchItem {
  title: string;
  price: number;
  currency_id: string;
  permalink: string;
  thumbnail?: string;
  available_quantity: number;
  reviews?: { rating_average?: number; total?: number };
}

interface MLSearchResponse {
  results: MLSearchItem[];
}

/**
 * Busca ofertas ao vivo no Mercado Livre para um termo de busca.
 *
 * A API pública de busca não exige autenticação, mas não tem SLA
 * garantido (pode devolver 403 para alguns IPs/volumes). Por isso o
 * catálogo nunca deve depender só dela: em caso de erro, devolvemos
 * lista vazia e o produto continua aparecendo com as ofertas manuais.
 */
export async function searchMercadoLivre(query: string, limit = 4): Promise<Offer[]> {
  const url = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Revalida a cada hora: preços mudam, mas não precisamos de tempo real.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[mercadolivre] busca falhou (${res.status}) para "${query}"`);
      return [];
    }

    const data = (await res.json()) as MLSearchResponse;

    return data.results
      .filter((item) => item.currency_id === "BRL")
      .map((item) => ({
        marketplace: "mercadolivre" as const,
        title: item.title,
        price: item.price,
        currency: "BRL" as const,
        url: buildMercadoLivreAffiliateUrl(item.permalink),
        imageUrl: item.thumbnail,
        rating: item.reviews?.rating_average,
        reviewsCount: item.reviews?.total,
        available: item.available_quantity > 0,
        updatedAt: new Date().toISOString(),
        isManualPrice: false,
      }));
  } catch (error) {
    console.warn(`[mercadolivre] erro de rede buscando "${query}":`, error);
    return [];
  }
}
