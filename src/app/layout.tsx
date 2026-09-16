import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fralda Barata — compare preços e economize",
  description:
    "Compare preços de fraldas e produtos de bebê entre Amazon, Mercado Livre e Shopee e encontre a melhor oferta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        <div className="flex flex-1 flex-col">{children}</div>
        <AffiliateDisclosure />
      </body>
    </html>
  );
}
