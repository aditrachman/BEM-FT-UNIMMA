import Link from "next/link";

const footerLinks = [
  { label: "Tentang", href: "#tentang" },
  { label: "Program Kerja", href: "#program-kerja" },
  { label: "Struktur", href: "#struktur" },
  { label: "Berita", href: "#berita" },
];

export default function Footer() {
  return (
    <footer id="kontak" className="bg-on-surface text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-label-md font-bold mb-3">BEM FT UNIMMA</h3>
            <p className="text-body-md text-white/70 leading-relaxed">
              Badan Eksekutif Mahasiswa Fakultas Teknik Universitas Muhammadiyah
              Magelang. Wadah aspirasi dan pengembangan mahasiswa.
            </p>
          </div>

          {/* Tautan */}
          <div>
            <h3 className="text-label-md font-bold mb-3">Tautan</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-md text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-label-md font-bold mb-3">Kontak</h3>
            <ul className="space-y-2 text-body-md text-white/70">
              <li>bemft@unimma.ac.id</li>
              <li>@bemftunimma</li>
              <li>Jl. Tlogo Bagor No.1, Kel. Rejosari, Kec. Tidar, Magelang</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-label-sm text-white/50">
            © {new Date().getFullYear()} BEM FT UNIMMA. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
