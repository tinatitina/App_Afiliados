import type { Marketplace } from "@/lib/types";

export const MARKETPLACE_LABEL: Record<Marketplace, string> = {
  amazon: "Amazon",
  mercadolivre: "Mercado Livre",
  shopee: "Shopee",
};

export const MARKETPLACE_COLOR: Record<Marketplace, string> = {
  amazon: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  mercadolivre: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200",
  shopee: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
};

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}
