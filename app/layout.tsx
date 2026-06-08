import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";

import "./globals.css";
import Header from "./_components/Header";
import SessionProviderWrapper from "./_components/SessionProviderWrapper";
import Footer from "./_components/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  // title: "Create Next App",
  title: {
    template: "%s Nginapin",
    default: "Sewa Kosan & Kontrakan di Bogor | Nginapin",
  },

  description:
    "Book hotels, villas, and resorts across Indonesia. Compare prices and find the best deals for your stay easily with Nginapin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased w-full`}>
        {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full `}
      > */}
        <SessionProviderWrapper>
          <Header />
          <main className="pt-4">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
