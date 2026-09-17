import type { Product } from "@/lib/types";
import productsData from "./products.json";

/**
 * CATÁLOGO DE EXEMPLO — troque `products.json` pelos seus dados reais antes
 * de divulgar o site. Este arquivo (`products.ts`) só tipa e reexporta o
 * JSON — quem edita o catálogo (manualmente ou via automação) mexe em
 * `products.json`, nunca aqui.
 *
 * Formato de cada produto e de cada oferta: ver `src/lib/types.ts`
 * (`Product` e `Offer`) ou o README, seção "Formato do catálogo".
 *
 * Os preços e URLs do JSON de exemplo são fictícios (não é scraping nem
 * dado real de nenhum marketplace). Eles existem só para você ver a busca
 * funcionando.
 *
 * As três plataformas são cadastradas à mão. O Mercado Livre também é
 * manual: desde abril de 2025 a API pública de busca deles passou a exigir
 * um access token vinculado a uma conta de usuário (não dá mais pra
 * consultar preço sem login autorizado). Fazer isso direito exige OAuth
 * completo + um lugar pra guardar o token que se renova sozinho — ver
 * "Próximos passos" no README se um dia quiser automatizar isso.
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
 * 3. Quando isso crescer, vale migrar de um arquivo .json pra um banco de
 *    dados — ver sugestão no README.
 */
export const CATALOG_IS_SAMPLE_DATA = true;

export const products: Product[] = productsData as Product[];
