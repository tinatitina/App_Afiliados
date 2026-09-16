import Link from "next/link";
import { Calculator } from "@/components/Calculator";

export default function CalculadoraPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Calculadora de preço por unidade</h1>
        <p className="text-zinc-500">
          Não achou o produto no nosso catálogo? Coloque o preço e a quantidade de cada embalagem e
          compare o preço por unidade — o que realmente importa pra saber qual é mais barato.
        </p>
        <Link href="/" className="text-sm font-medium text-zinc-700 underline dark:text-zinc-300">
          ← Voltar para a busca
        </Link>
      </header>

      <Calculator />
    </main>
  );
}
