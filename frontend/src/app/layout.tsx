import type { Metadata } from "next";
import {
  Inter,
  Inconsolata,
  Quicksand,
  Bodoni_Moda,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handcrafted Hats",
  description: "Degree project - A e-commerce website by Elsa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.className} ${inconsolata.variable} ${quicksand.variable} ${bodoni.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
