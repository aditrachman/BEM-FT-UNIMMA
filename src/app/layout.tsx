import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BEM FT UNIMMA — Badan Eksekutif Mahasiswa Fakultas Teknik",
  description:
    "Badan Eksekutif Mahasiswa Fakultas Teknik Universitas Muhammadiyah Magelang. Wadah aspirasi dan pengembangan mahasiswa FT UNIMMA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
