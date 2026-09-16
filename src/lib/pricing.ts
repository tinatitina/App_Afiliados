/** Preço por unidade (ex: por fralda). Retorna null quando não dá pra calcular. */
export function computeUnitPrice(price: number, packCount?: number): number | null {
  if (!packCount || packCount <= 0) return null;
  return price / packCount;
}

/** % de desconto vs. preço original. Retorna null quando não há desconto. */
export function computeDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

const STALE_AFTER_DAYS = 2;

/** Preço manual "vencido": não é conferido há mais que a cadência recomendada (2 dias). */
export function isStalePrice(updatedAt: string, days = STALE_AFTER_DAYS): boolean {
  const ageMs = Date.now() - new Date(updatedAt).getTime();
  return ageMs > days * 24 * 60 * 60 * 1000;
}
