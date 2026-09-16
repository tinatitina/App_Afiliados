"use client";

import { useRef, useState } from "react";
import { formatBRL } from "@/lib/marketplace";
import { computeUnitPrice } from "@/lib/pricing";

interface Row {
  id: number;
  label: string;
  price: string;
  quantity: string;
}

function makeRow(id: number, label: string): Row {
  return { id, label, price: "", quantity: "" };
}

export function Calculator() {
  const [rows, setRows] = useState<Row[]>([makeRow(1, "Opção A"), makeRow(2, "Opção B")]);
  const nextId = useRef(3);

  const results = rows.map((row) => {
    const price = parseFloat(row.price.replace(",", "."));
    const quantity = parseInt(row.quantity, 10);
    const unitPrice = Number.isFinite(price) && quantity > 0 ? computeUnitPrice(price, quantity) : null;
    return { ...row, unitPrice };
  });

  const cheapestUnitPrice = results.reduce<number | null>((min, r) => {
    if (r.unitPrice === null) return min;
    if (min === null || r.unitPrice < min) return r.unitPrice;
    return min;
  }, null);

  function updateRow(id: number, field: "label" | "price" | "quantity", value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      makeRow(nextId.current++, `Opção ${String.fromCharCode(65 + prev.length)}`),
    ]);
  }

  function removeRow(id: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  return (
    <div className="flex flex-col gap-4">
      {results.map((row) => {
        const isCheapest = row.unitPrice !== null && row.unitPrice === cheapestUnitPrice;
        return (
          <div
            key={row.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end ${
              isCheapest
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Nome (opcional)</label>
              <input
                type="text"
                value={row.label}
                onChange={(e) => updateRow(row.id, "label", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Preço total (R$)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ex: 64,90"
                value={row.price}
                onChange={(e) => updateRow(row.id, "price", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">Quantidade de unidades</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ex: 46"
                value={row.quantity}
                onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </div>
            <div className="flex flex-1 flex-col items-start gap-1 sm:items-end">
              <span className="text-xs font-medium text-zinc-500">Preço/unidade</span>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {row.unitPrice !== null ? formatBRL(row.unitPrice) : "—"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="self-start rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-rose-600 sm:self-center"
              aria-label="Remover"
            >
              Remover
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addRow}
        className="self-start rounded-md border border-dashed border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
      >
        + Adicionar opção
      </button>
    </div>
  );
}
