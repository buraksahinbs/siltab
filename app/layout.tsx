import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { firma } from "@/content/site";
import "./globals.css";

// Yazı tipleri: yalnızca kullanılan kesimler. Önceden yüklenen yalnızca latin alt kümesi;
// Türkçe harfler (ş, ğ, İ) latin-ext dosyasından gerektiğinde gelir. Bu, ilk boyamadan önce
// indirilen baytı yaklaşık 275 KB'tan 120 KB'a indirir.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const cormorantItalik = Cormorant_Garamond({
  variable: "--font-cormorant-italik",
  subsets: ["latin"],
  weight: ["300"],
  style: ["italic"],
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const aciklama =
  "Siltab Group: 2001'den bu yana İstanbul'da ayakkabı tabanı ve ayakkabı üretimi. Pierre Cardin Erkek Ayakkabı Türkiye alt lisansörü. Koleksiyon, markalar ve bayi ağı.";

export const metadata: Metadata = {
  metadataBase: new URL(firma.siteUrl),
  title: "Siltab Group | Ayakkabı üretimi ve lisanslı markalar",
  description: aciklama,
  applicationName: "Siltab Group",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Siltab Group",
    title: "Siltab Group | Ayakkabı üretimi ve lisanslı markalar",
    description: aciklama,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Siltab Group" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siltab Group",
    description: aciklama,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0e1512",
  colorScheme: "light dark",
};

// Boyamadan önce: JS var (tema geçişi) ve hareket tercihi.
const onBetik = `(function(){var d=document.documentElement;d.classList.add('tema-js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('hareket');})();`;

const kurulus = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: firma.ad,
  url: firma.siteUrl,
  logo: `${firma.siteUrl}/logo.png`,
  foundingDate: "2001",
  email: firma.eposta,
  telephone: firma.telefon,
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Ziya Gökalp Mah. Süleyman Demirel Bulvarı, Cumhuriyet Cad. No: 42 Sinpaş İş Modern Tic. Merkezi, 1. Etap EM Blok Çatıkatı İç Kapı No: E-58",
    addressLocality: "Başakşehir",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  sameAs: firma.sosyal.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-tema="koyu" className={`${cormorant.variable} ${cormorantItalik.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: onBetik }} />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(kurulus).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
