# Mamãe economiza

Motor de busca e comparação de preços para produtos de bebê (começando por
fraldas) entre **Amazon**, **Mercado Livre** e **Shopee**, com links de
afiliado. A ideia: quem procura o melhor preço encontra, e a comissão da
venda vai para você.

## Como funciona

- **Amazon, Mercado Livre e Shopee**: catálogo 100% manual em
  `src/data/products.ts`. Não há como automatizar a busca sem violar os
  termos de uso dessas plataformas (scraping), e cada API oficial tem uma
  barreira própria:
  - Amazon PA-API só libera acesso depois de vendas qualificadas.
  - Mercado Livre: a API pública de busca funcionou sem login até abril de
    2025; desde então exige um access token OAuth vinculado a uma conta de
    usuário (ver "Integração OAuth do Mercado Livre" abaixo pra quem quiser
    automatizar isso no futuro).
  - Shopee não tem API pública de busca de preços pra afiliados.

  Por isso você cadastra os produtos à mão nas três — preço,
  `originalPrice` quando houver promoção, e a URL do produto (Shopee: o
  link de afiliado já pronto do portal deles; Amazon e Mercado Livre: a URL
  "limpa" do produto, o tag é adicionado sozinho) — e revisa
  periodicamente. **Cadência recomendada: a cada 2 dias.** Se um preço
  manual passar disso sem ser conferido, o site mostra um badge "Verificar
  preço" — não escondemos preço velho, só sinalizamos.
- **Resolução de afiliado** (`src/lib/affiliate.ts`): um único ponto,
  `resolveAffiliateUrl(marketplace, url)`, decide como cada plataforma vira
  link de comissão (ML: anexa `matt_word`/`matt_tool`; Amazon: anexa `tag`;
  Shopee: repassa a URL como veio, já que o link é gerado manualmente no
  portal deles). Ele é chamado uma única vez, em `src/lib/search.ts`, para
  toda oferta. Isso existe porque a primeira versão tinha o helper da
  Amazon pronto mas nunca chamado, e nenhum link da Amazon rastreava
  comissão; centralizar evita essa classe de bug.
- **Preço por unidade** (`src/lib/pricing.ts`): a busca ordena e escolhe a
  "melhor oferta" pelo preço dividido pela quantidade de unidades do
  pacote (`packCount`), não pelo preço total — é isso que permite comparar
  de verdade um pacote de 30 com um de 56. Cadastre `packCount` em todo
  produto do catálogo.
- **Busca**: `src/lib/search.ts` filtra o catálogo por marca/tamanho/
  texto/plataforma e ordena por preço/unidade.
- **Maiores Ofertas**: `getTopDeals()` em `search.ts` pega as ofertas com
  `originalPrice` cadastrado e maior desconto, pro bloco de destaque no
  topo da home.
- **Calculadora** (`/calculadora`): pra produtos fora do catálogo, o
  visitante digita preço e quantidade de cada opção e compara o preço por
  unidade na hora — sem precisar que o produto esteja cadastrado.

## Antes de divulgar o site

O catálogo em `src/data/products.ts` vem com **dados de exemplo**
(preços e URLs fictícios) só para você ver a busca funcionando — o site
mostra um aviso de "modo demonstração" enquanto isso não for trocado.

1. **Crie/confirme suas contas de afiliado**:
   - Amazon Associates: [associados.amazon.com.br](https://associados.amazon.com.br)
   - Mercado Livre Afiliados: [afiliados.mercadolivre.com.br](https://afiliados.mercadolivre.com.br)
     → em "Gere seus links" pegue os valores de `matt_word` e `matt_tool`
   - Shopee Afiliados: programa próprio da Shopee (o link de cada produto é
     gerado direto no app/portal deles)
2. **Configure o `.env.local`** (copie de `.env.example`) com
   `ML_AFFILIATE_MATT_WORD`, `ML_AFFILIATE_MATT_TOOL` e `AMAZON_ASSOCIATE_TAG`.
3. **Substitua os produtos de exemplo** em `src/data/products.ts` por
   produtos reais: preço conferido, URL de afiliado (Shopee: já pronta;
   Amazon e Mercado Livre: pode colar a URL limpa do produto, o tag/
   matt_word é adicionado sozinho).
4. Depois de trocar os dados reais, apague/edite `CATALOG_IS_SAMPLE_DATA`
   em `src/data/products.ts` para `false`.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com suas credenciais de afiliado
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Mais simples via [Vercel](https://vercel.com/new) (plano gratuito atende bem
no início): conecte o repositório, configure as variáveis de ambiente do
`.env.example` no painel do projeto, e cada push faz deploy automático.

## Próximos passos sugeridos

- **Mais categorias**: o modelo (`src/lib/types.ts`) já suporta
  `lencos-umedecidos`, `pomada`, `formula-infantil` e `lanches-saudaveis` —
  basta cadastrar produtos dessas categorias em `products.ts` e criar os
  links de filtro na home.
- **Lomadee** (rede de afiliados do grupo Méliuz, +300 lojas brasileiras,
  API de ofertas própria): boa segunda fonte de dados/links, inclusive para
  lojas fora do Mercado Livre/Amazon/Shopee.
- **Integração OAuth do Mercado Livre** (preços ao vivo de novo): dá pra
  automatizar de novo, mas exige mais que uma chave de API:
  1. Criar uma aplicação em [developers.mercadolivre.com.br](https://developers.mercadolivre.com.br)
     → gera `client_id` e `client_secret`.
  2. Fazer o fluxo `authorization_code` uma vez: abrir a URL de autorização,
     logar com a conta de Mercado Livre, e trocar o `code` que ela devolve
     por um `access_token` + `refresh_token`
     (`POST https://api.mercadolibre.com/oauth/token`).
  3. O `access_token` expira em poucas horas — antes de cada busca (ou ao
     receber 401), renovar via `refresh_token` (que também é trocado por um
     novo a cada uso). Isso precisa ficar guardado em algo persistente
     entre requisições (ex: Vercel KV, Upstash Redis, ou uma tabela num
     banco simples) — variável de ambiente não serve porque o valor muda
     sozinho com o tempo.
  4. Só então as chamadas a `GET /sites/MLB/search` (ou ao endpoint de
     "Buscador de produtos" da documentação) voltam a funcionar, agora com
     `Authorization: Bearer <access_token>` no header.

  Ou seja: precisa de login uma vez + um serviço de armazenamento novo.
  Enquanto isso não valer a pena, Mercado Livre fica no catálogo manual
  junto com Amazon e Shopee.
- **Atualização automática de preços**: hoje as três plataformas são
  manuais. Se o volume crescer, considerar: (a) acesso à Amazon PA-API
  depois das primeiras vendas qualificadas, (b) a integração OAuth do
  Mercado Livre acima, ou (c) migrar o catálogo de `products.ts` para uma
  planilha (Google Sheets) ou banco de dados simples para facilitar a
  atualização sem precisar mexer em código.
- **SEO**: como o tráfego orgânico do Google é o principal canal de
  aquisição desse tipo de site, vale investir em conteúdo (ex: "qual fralda
  cabe melhor no bebê", comparativos por marca) e em `metadata`/`sitemap.xml`
  por página de produto.
- **Divulgação obrigatória**: o rodapé (`src/components/AffiliateDisclosure.tsx`)
  já traz o aviso de que o site usa links de afiliado — isso é exigido pelo
  programa da Amazon e é boa prática de transparência com o consumidor.
  Não remova.
