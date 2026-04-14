import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Mix Informática",
  description: "Loja de informática e eletrônicos com PCs, monitores, nobreaks, DVR e mais."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
