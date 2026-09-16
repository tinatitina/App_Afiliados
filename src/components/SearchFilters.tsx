import { MARKETPLACE_LABEL } from "@/lib/marketplace";
import type { Marketplace, SearchFilters as SearchFiltersType } from "@/lib/types";

const MARKETPLACES: Marketplace[] = ["amazon", "mercadolivre", "shopee"];

export function SearchFilters({
  brands,
  sizes,
  current,
}: {
  brands: string[];
  sizes: string[];
  current: SearchFiltersType;
}) {
  return (
    <form className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-1 min-w-[200px] flex-col gap-1">
        <label htmlFor="q" className="text-xs font-medium text-zinc-500">
          Buscar
        </label>
        <input
          id="q"
          name="q"
          type="text"
          placeholder="Ex: Pampers, Huggies, tamanho M..."
          defaultValue={current.query ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="brand" className="text-xs font-medium text-zinc-500">
          Marca
        </label>
        <select
          id="brand"
          name="brand"
          defaultValue={current.brand ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Todas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="size" className="text-xs font-medium text-zinc-500">
          Tamanho
        </label>
        <select
          id="size"
          name="size"
          defaultValue={current.size ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Todos</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="marketplace" className="text-xs font-medium text-zinc-500">
          Plataforma
        </label>
        <select
          id="marketplace"
          name="marketplace"
          defaultValue={current.marketplace ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Todas</option>
          {MARKETPLACES.map((mp) => (
            <option key={mp} value={mp}>
              {MARKETPLACE_LABEL[mp]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Buscar
      </button>
    </form>
  );
}
