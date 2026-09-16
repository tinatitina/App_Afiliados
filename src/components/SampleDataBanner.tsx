export function SampleDataBanner() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      <strong>Modo demonstração:</strong> os preços e links da Amazon e Shopee abaixo são fictícios
      (dados de exemplo em <code>src/data/products.ts</code>). O Mercado Livre já mostra preços reais
      via API. Substitua o catálogo manual antes de divulgar o site.
    </div>
  );
}
