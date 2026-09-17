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
 * garantido: costuma devolver 403 para tráfego sem cara de navegador
 * (sem User-Agent, vindo de IP de datacenter/cloud — o que inclui
 * serverless da Vercel). Por isso mandamos um User-Agent de navegador.
 * Mesmo assim, o catálogo nunca deve depender só dela: em caso de erro,
 * devolvemos lista vazia e o produto continua aparecendo com as ofertas
 * manuais.
 *
 * `url` aqui é o permalink cru do produto — o tag de afiliado é aplicado
 * depois, de forma centralizada, por `resolveAffiliateUrl` em
 * `src/lib/search.ts`. Nenhum provider deve montar link de afiliado sozinho.
 */
export async function searchMercadoLivre(query: string, limit = 4): Promise<Offer[]> {
  const url = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      // Revalida a cada hora: preços mudam, mas não precisamos de tempo real.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[mercadolivre] busca falhou (${res.status}) para "${query}": ${body.slice(0, 300)}`,
      );
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
        url: item.permalink,
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
