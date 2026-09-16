import { OfferRow } from "@/components/OfferRow";
import type { ResolvedProduct } from "@/lib/types";

export function ProductCard({ product }: { product: ResolvedProduct }) {
  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {product.brand} {product.name}
        </h2>
        <p className="text-sm text-zinc-500">
          {[product.size && `Tamanho ${product.size}`, product.packCount && `${product.packCount} unidades`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {sortedOffers.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {sortedOffers.map((offer, i) => (
            <OfferRow key={`${offer.marketplace}-${i}`} offer={offer} isBest={offer === product.bestOffer} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">Nenhuma oferta encontrada no momento.</p>
      )}
    </article>
  );
}
