import { ProductCard } from "@/components/ProductCard";
import { SampleDataBanner } from "@/components/SampleDataBanner";
import { SearchFilters } from "@/components/SearchFilters";
import { CATALOG_IS_SAMPLE_DATA } from "@/data/products";
import { getAvailableBrands, getAvailableSizes, searchProducts } from "@/lib/search";

interface HomeProps {
  searchParams: Promise<{ q?: string; brand?: string; size?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const filters = {
    category: "fraldas" as const,
    query: params.q,
    brand: params.brand,
    size: params.size,
  };

  const [results, brands, sizes] = await Promise.all([
    searchProducts(filters),
    Promise.resolve(getAvailableBrands("fraldas")),
    Promise.resolve(getAvailableSizes("fraldas")),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Fralda Barata</h1>
        <p className="text-zinc-500">
          Compare preços de fraldas entre Amazon, Mercado Livre e Shopee em um só lugar.
        </p>
      </header>

      {CATALOG_IS_SAMPLE_DATA && <SampleDataBanner />}

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
