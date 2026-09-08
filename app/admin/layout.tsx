import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Proker — BEM FT UNIMMA",
  robots: "noindex",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
