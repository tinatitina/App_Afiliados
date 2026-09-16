import { MARKETPLACE_LABEL, formatBRL } from "@/lib/marketplace";
import type { Product, DisplayOffer } from "@/lib/types";

export function TopDealsStrip({ deals }: { deals: Array<{ product: Product; offer: DisplayOffer }> }) {
  if (deals.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">🔥 Maiores ofertas</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {deals.map(({ product, offer }) => (
          <a
            key={`${product.id}-${offer.marketplace}`}
            href={offer.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="flex w-56 shrink-0 flex-col gap-1 rounded-xl border border-rose-200 bg-rose-50 p-3 transition hover:border-rose-400 dark:border-rose-900 dark:bg-rose-950/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">{MARKETPLACE_LABEL[offer.marketplace]}</span>
              <span className="rounded bg-rose-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                -{offer.discountPercent}%
              </span>
            </div>
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50" title={product.name}>
              {product.brand} {product.name}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-zinc-400 line-through">{formatBRL(offer.originalPrice!)}</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{formatBRL(offer.price)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
