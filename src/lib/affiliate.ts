import type { Marketplace } from "@/lib/types";

/**
 * Módulo único de resolução de link de afiliado: toda oferta (manual ou
 * ao vivo) passa por `resolveAffiliateUrl` antes de chegar na tela. Isso
 * evita o que aconteceu na primeira versão — o tag da Amazon existia como
 * helper mas nunca era chamado, então nenhum link da Amazon rastreava
 * comissão. Centralizar a resolução por marketplace aqui, num único lugar,
 * é o que impede esse tipo de bug de silenciosamente voltar.
 *
 * - Mercado Livre: não existe API de afiliados. O programa
 *   (afiliados.mercadolivre.com.br) usa os parâmetros de rastreamento
 *   `matt_word` e `matt_tool`, que você obtém uma única vez no painel e
 *   pode anexar a qualquer URL de produto — por isso dá para automatizar.
 * - Amazon: o Associates SiteStripe gera links no formato
 *   `?tag=SEU_TAG-20`; anexar esse parâmetro manualmente a uma URL de
 *   produto amazon.com.br é a mesma técnica, permitida pelo programa.
 * - Shopee: o programa de afiliados não documenta um parâmetro de URL
 *   estável — os links são gerados um a um dentro do app/portal do
 *   Shopee Afiliados. Por isso as ofertas da Shopee ficam no catálogo
 *   manual com a URL de afiliado já pronta (colada do painel deles), e
 *   o resolver só a repassa sem alteração.
 */

function appendParams(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function buildMercadoLivreAffiliateUrl(productUrl: string): string {
  const word = process.env.ML_AFFILIATE_MATT_WORD;
  const tool = process.env.ML_AFFILIATE_MATT_TOOL;

  if (!word || !tool) {
    // Sem as credenciais configuradas, devolve a URL original (sem comissão)
    // em vez de quebrar a busca — assim o site funciona em desenvolvimento.
    return productUrl;
  }

  try {
    return appendParams(productUrl, { matt_word: word, matt_tool: tool });
  } catch {
    return productUrl;
  }
}

export function buildAmazonAffiliateUrl(productUrl: string): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG;
  if (!tag) return productUrl;

  try {
    return appendParams(productUrl, { tag });
  } catch {
    return productUrl;
  }
}

/**
 * Ponto único por onde toda URL de oferta deve passar antes de ser
 * exibida. Chame isto ao montar o `ResolvedProduct`, nunca dentro de um
 * provider individual — assim nenhuma plataforma nova esquece a comissão.
 */
export function resolveAffiliateUrl(marketplace: Marketplace, productUrl: string): string {
  switch (marketplace) {
    case "amazon":
      return buildAmazonAffiliateUrl(productUrl);
    case "mercadolivre":
      return buildMercadoLivreAffiliateUrl(productUrl);
    case "shopee":
      // Link já vem pronto do painel Shopee Afiliados (ver nota acima).
      return productUrl;
  }
}
