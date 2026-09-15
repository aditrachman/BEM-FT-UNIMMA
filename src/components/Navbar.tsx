"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Tentang", href: "#tentang" },
  { label: "Program Kerja", href: "#program-kerja" },
  { label: "Struktur", href: "#struktur" },
  { label: "Berita", href: "#berita" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-bright/80 backdrop-blur-md border-b border-on-surface/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-label-md font-bold text-on-surface tracking-tight">
              BEM FT UNIMMA
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-label-md text-on-surface/70 hover:text-on-surface transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#kontak"
              className="text-label-md bg-primary text-white px-5 py-2.5 rounded-button hover:opacity-90 transition-opacity"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-on-surface"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-label-md text-on-surface/70 hover:text-on-surface py-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#kontak"
              onClick={() => setIsOpen(false)}
              className="block text-label-md bg-primary text-white px-5 py-2.5 rounded-button text-center hover:opacity-90 transition-opacity"
            >
              Hubungi Kami
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
