# Mamãe economiza

Motor de busca e comparação de preços para produtos de bebê (começando por
fraldas) entre **Amazon**, **Mercado Livre** e **Shopee**, com links de
afiliado. A ideia: quem procura o melhor preço encontra, e a comissão da
venda vai para você.

## Como funciona

- **Mercado Livre**: preços ao vivo via API pública de busca
  (`src/lib/providers/mercadolivre.ts`). O link de afiliado é montado na
  hora, anexando os parâmetros `matt_word`/`matt_tool` à URL do produto
  (`src/lib/affiliate.ts`) — não existe API de afiliados do ML, então essa é
  a forma suportada de rastrear.
- **Amazon e Shopee**: catálogo manual em `src/data/products.ts`. Não há
  como automatizar a busca sem violar os termos de uso dessas plataformas
  (scraping) ou sem acesso aprovado à API oficial (a Amazon PA-API só libera
  acesso depois de vendas qualificadas). Por isso você cadastra os produtos
  à mão, com o preço e o link de afiliado prontos, e revisa periodicamente.
- **Busca**: `src/lib/search.ts` combina catálogo manual + Mercado Livre ao
  vivo, filtra por marca/tamanho/texto e ordena pelo menor preço.

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
   Amazon: pode colar a URL limpa do produto, o `tag` é adicionado sozinho).
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
  lojas fora do Mercado Livre/Amazon/Shopee. Daria pra criar
  `src/lib/providers/lomadee.ts` seguindo o mesmo padrão do provider do
  Mercado Livre.
- **Atualização automática de preços**: hoje Amazon/Shopee são manuais.
  Se o volume crescer, considerar: (a) acesso à Amazon PA-API depois das
  primeiras vendas qualificadas, ou (b) migrar o catálogo de
  `products.ts` para uma planilha (Google Sheets) ou banco de dados simples
  para facilitar a atualização sem precisar mexer em código.
- **SEO**: como o tráfego orgânico do Google é o principal canal de
  aquisição desse tipo de site, vale investir em conteúdo (ex: "qual fralda
  cabe melhor no bebê", comparativos por marca) e em `metadata`/`sitemap.xml`
  por página de produto.
- **Divulgação obrigatória**: o rodapé (`src/components/AffiliateDisclosure.tsx`)
  já traz o aviso de que o site usa links de afiliado — isso é exigido pelo
  programa da Amazon e é boa prática de transparência com o consumidor.
  Não remova.
