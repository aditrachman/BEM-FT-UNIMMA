import type { Metadata } from "next";
import Content from "./Content";

export const metadata: Metadata = {
  title: "Tentang Kami — BEM FT UNIMMA",
  description:
    "Visi, misi, dan struktur kepengurusan BEM Fakultas Teknik UNIMMA.",
  alternates: { canonical: "https://bem-ft-unimma.vercel.app/tentang-kami" },
  openGraph: {
    title: "Tentang Kami — BEM FT UNIMMA",
    description:
      "Visi, misi, dan struktur kepengurusan BEM Fakultas Teknik UNIMMA.",
    url: "https://bem-ft-unimma.vercel.app/tentang-kami",
    type: "website",
  },
};

export default function TentangKami() {
  return <Content />;
}
