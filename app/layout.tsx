import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "candy_cake_by_moxina",
  description: "Авторские десерты — каталог и контакты",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body className={`${body.className} min-h-screen antialiased text-chocolate`}>
        {children}
      </body>
    </html>
  );
}
