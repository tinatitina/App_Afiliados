import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SampleDataBanner } from "@/components/SampleDataBanner";
import { SearchFilters } from "@/components/SearchFilters";
import { TopDealsStrip } from "@/components/TopDealsStrip";
import { CATALOG_IS_SAMPLE_DATA } from "@/data/products";
import type { Marketplace } from "@/lib/types";
import { getAvailableBrands, getAvailableSizes, getTopDeals, searchProducts } from "@/lib/search";

interface HomeProps {
  searchParams: Promise<{ q?: string; brand?: string; size?: string; marketplace?: Marketplace }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const filters = {
    category: "fraldas" as const,
    query: params.q,
    brand: params.brand,
    size: params.size,
    marketplace: params.marketplace,
  };

  const [results, brands, sizes, topDeals] = await Promise.all([
    searchProducts(filters),
    Promise.resolve(getAvailableBrands("fraldas")),
    Promise.resolve(getAvailableSizes("fraldas")),
    Promise.resolve(getTopDeals()),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Mamãe economiza</h1>
        <p className="text-zinc-500">
          Compare o preço por unidade de fraldas entre Amazon, Mercado Livre e Shopee em um só lugar.
        </p>
        <Link href="/calculadora" className="text-sm font-medium text-zinc-700 underline dark:text-zinc-300">
          Não achou o produto? Calcule o preço por unidade você mesmo →
        </Link>
      </header>

      {CATALOG_IS_SAMPLE_DATA && <SampleDataBanner />}

      <TopDealsStrip deals={topDeals} />

      <SearchFilters brands={brands} sizes={sizes} current={filters} />

      <section className="flex flex-col gap-4">
        {results.length === 0 ? (
          <p className="text-center text-zinc-500">Nenhum produto encontrado com esses filtros.</p>
        ) : (
          results.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </section>
    </main>
  );
}
