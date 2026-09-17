import type { Product } from "@/lib/types";

/**
 * CATÁLOGO DE EXEMPLO — troque pelos seus dados reais antes de divulgar o site.
 *
 * Os preços e URLs abaixo são fictícios (não é scraping nem dado real de
 * nenhum marketplace). Eles existem só para você ver a busca funcionando.
 *
 * As três plataformas são cadastradas à mão aqui. O Mercado Livre também
 * virou catálogo manual: desde abril de 2025 a API pública de busca deles
 * passou a exigir um access token vinculado a uma conta de usuário (não dá
 * mais pra consultar preço sem login autorizado). Fazer isso direito exige
 * OAuth completo + um lugar pra guardar o token que se renova sozinho —
 * ver "Próximos passos" no README se um dia quiser automatizar isso.
 *
 * Antes de lançar:
 *
 * 1. Gere seus links reais de afiliado:
 *    - Amazon: SiteStripe na página do produto (amazon.com.br) → copie a URL
 *      com `?tag=SEUTAG-20`, ou deixe a AMAZON_ASSOCIATE_TAG configurada no
 *      .env e cole a URL "limpa" do produto aqui, que o tag é adicionado sozinho.
 *    - Mercado Livre: cole a URL "limpa" do produto (produto.mercadolivre.com.br/...);
 *      o matt_word/matt_tool da ML_AFFILIATE_MATT_WORD/TOOL é adicionado sozinho,
 *      igual à Amazon.
 *    - Shopee: gere o link dentro do app/portal do Shopee Afiliados
 *      (não dá pra automatizar por parâmetro de URL) e cole a URL completa.
 * 2. Atualize `price` e `updatedAt` sempre que conferir o preço — o
 *    recomendado é a cada 2 dias, nas três plataformas. O site mostra
 *    "atualizado em" e, se passar de 2 dias, um badge "Verificar preço".
 *    Preencha `originalPrice` só quando o produto estiver mesmo em
 *    promoção (vira o badge de desconto e entra no bloco "Maiores Ofertas").
 * 3. Quando isso crescer, vale migrar de um arquivo .ts para uma planilha
 *    ou banco de dados — ver sugestão no README.
 */
export const CATALOG_IS_SAMPLE_DATA = true;

export const products: Product[] = [
  {
    id: "pampers-confort-sec-g",
    category: "fraldas",
    brand: "Pampers",
    name: "Pampers Confort Sec",
    size: "G",
    packCount: 46,
    manualOffers: [
      {
        marketplace: "amazon",
        title: "Pampers Confort Sec, Fralda, Tamanho G, 46 unidades",
        price: 64.9,
        originalPrice: 79.9,
        currency: "BRL",
        url: "https://www.amazon.com.br/dp/EXEMPLO-ASIN-1",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "mercadolivre",
        title: "Fralda Pampers Confort Sec G 46un",
        price: 62.9,
        currency: "BRL",
        url: "https://produto.mercadolivre.com.br/exemplo-1",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "shopee",
        title: "Fralda Pampers Confort Sec G 46un",
        price: 61.5,
        currency: "BRL",
        url: "https://shopee.com.br/product/exemplo-1",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
    ],
  },
  {
    id: "huggies-turma-da-monica-m",
    category: "fraldas",
    brand: "Huggies",
    name: "Huggies Turma da Mônica",
    size: "M",
    packCount: 56,
    manualOffers: [
      {
        marketplace: "amazon",
        title: "Huggies Turma da Mônica, Fralda, Tamanho M, 56 unidades",
        price: 58.9,
        currency: "BRL",
        url: "https://www.amazon.com.br/dp/EXEMPLO-ASIN-2",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "mercadolivre",
        title: "Fralda Huggies Turma da Mônica M 56un",
        price: 57.9,
        currency: "BRL",
        url: "https://produto.mercadolivre.com.br/exemplo-2",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "shopee",
        title: "Fralda Huggies Turma da Mônica M 56un",
        price: 55.9,
        originalPrice: 69.9,
        currency: "BRL",
        url: "https://shopee.com.br/product/exemplo-2",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
    ],
  },
  {
    id: "mamypoko-pants-xg",
    category: "fraldas",
    brand: "MamyPoko",
    name: "MamyPoko Pants Extra Secos",
    size: "XG",
    packCount: 34,
    manualOffers: [
      {
        marketplace: "amazon",
        title: "MamyPoko Pants Extra Secos, Fralda Calça, Tamanho XG, 34 unidades",
        price: 69.9,
        currency: "BRL",
        url: "https://www.amazon.com.br/dp/EXEMPLO-ASIN-3",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "mercadolivre",
        title: "Fralda Calça MamyPoko Pants Extra Secos XG 34un",
        price: 67.9,
        currency: "BRL",
        url: "https://produto.mercadolivre.com.br/exemplo-3",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
    ],
  },
  {
    id: "babysec-sec-protege-rn",
    category: "fraldas",
    brand: "BabySec",
    name: "BabySec Sec & Protege",
    size: "RN",
    packCount: 40,
    manualOffers: [
      {
        marketplace: "mercadolivre",
        title: "Fralda BabySec Sec & Protege RN 40un",
        price: 41.9,
        currency: "BRL",
        url: "https://produto.mercadolivre.com.br/exemplo-4",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "shopee",
        title: "Fralda BabySec Sec & Protege RN 40un",
        price: 39.9,
        currency: "BRL",
        url: "https://shopee.com.br/product/exemplo-3",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
    ],
  },
  {
    id: "pompom-premium-p",
    category: "fraldas",
    brand: "Pom Pom",
    name: "Pom Pom Premium",
    size: "P",
    packCount: 48,
    manualOffers: [
      {
        marketplace: "amazon",
        title: "Pom Pom Premium, Fralda, Tamanho P, 48 unidades",
        price: 49.9,
        currency: "BRL",
        url: "https://www.amazon.com.br/dp/EXEMPLO-ASIN-4",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "mercadolivre",
        title: "Fralda Pom Pom Premium P 48un",
        price: 48.5,
        currency: "BRL",
        url: "https://produto.mercadolivre.com.br/exemplo-5",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
      {
        marketplace: "shopee",
        title: "Fralda Pom Pom Premium P 48un",
        price: 47.9,
        currency: "BRL",
        url: "https://shopee.com.br/product/exemplo-4",
        available: true,
        updatedAt: "2026-09-01",
        isManualPrice: true,
      },
    ],
  },
];
