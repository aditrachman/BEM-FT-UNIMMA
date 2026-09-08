import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-default",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bem-ft-unimma.vercel.app"),
  title: "BEM FT UNIMMA",
  description:
    "Website resmi BEM Fakultas Teknik UNIMMA — informasi kegiatan, program kerja, dan aspirasi mahasiswa Fakultas Teknik.",
  alternates: { canonical: "https://bem-ft-unimma.vercel.app" },
  openGraph: {
    title: "BEM FT UNIMMA",
    description:
      "Website resmi BEM Fakultas Teknik UNIMMA — informasi kegiatan, program kerja, dan aspirasi mahasiswa Fakultas Teknik.",
    url: "https://bem-ft-unimma.vercel.app",
    siteName: "BEM FT UNIMMA",
    locale: "id_ID",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Logo BEM FT UNIMMA",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BEM FT UNIMMA",
    description:
      "Website resmi BEM Fakultas Teknik UNIMMA — informasi kegiatan, program kerja, dan aspirasi mahasiswa Fakultas Teknik.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" style={{ "--app-height": "738px" } as React.CSSProperties}>
      <head>
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preload" href="/icons/nav-arrow.svg" as="image" />
        <link rel="preload" as="image" href="/images/hero.jpeg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BEM FT UNIMMA",
              alternateName: "Badan Eksekutif Mahasiswa Fakultas Teknik UNIMMA",
              url: "https://bem-ft-unimma.vercel.app",
              logo: {
                "@type": "ImageObject",
                url: "https://bem-ft-unimma.vercel.app/logo.png",
                width: 512,
                height: 512,
              },
              sameAs: [
                "https://www.instagram.com/bemft.unimma/",
                "https://www.tiktok.com/@bemft.unimma",
                "https://www.youtube.com/@bemftunimma7905",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BEM FT UNIMMA",
              url: "https://bem-ft-unimma.vercel.app",
              inLanguage: "id-ID",
            }),
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} page-loaded cta-open`}>{children}</body>
    </html>
  );
}
