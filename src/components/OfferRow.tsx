import { MARKETPLACE_COLOR, MARKETPLACE_LABEL, formatBRL, formatDate } from "@/lib/marketplace";
import type { Offer } from "@/lib/types";

export function OfferRow({ offer, isBest }: { offer: Offer; isBest: boolean }) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
        isBest
          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${MARKETPLACE_COLOR[offer.marketplace]}`}
          >
            {MARKETPLACE_LABEL[offer.marketplace]}
          </span>
          {isBest && (
            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              Melhor preço
            </span>
          )}
          {!offer.available && (
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Indisponível
            </span>
          )}
        </div>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400" title={offer.title}>
          {offer.title}
        </p>
        <p className="text-xs text-zinc-400">
          {offer.isManualPrice ? `Preço conferido em ${formatDate(offer.updatedAt)}` : "Preço ao vivo"}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {formatBRL(offer.price)}
        </span>
        <a
          href={offer.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="rounded-md bg-zinc-900 px-3 py-1 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Ver oferta
        </a>
      </div>
    </li>
  );
}
