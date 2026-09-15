import Image from "next/image";
import Link from "next/link";

const placeholderNews = [
  {
    title: "Workshop Web Development Berhasil Digelar",
    slug: "workshop-web-dev",
    excerpt: "Workshop web development yang diadakan oleh BEM FT UNIMMA berhasil menarik partisipasi lebih dari 50 mahasiswa.",
    date: "15 Januari 2025",
  },
  {
    title: "Bakti Sosial di Desa Borobudur",
    slug: "baksos-borobudur",
    excerpt: "Kegiatan bakti sosial bersama masyarakat sekitar kawasan Candi Borobudur berjalan lancar dan sukses.",
    date: "10 Januari 2025",
  },
  {
    title: "Pemenang Lomba Desain Logo BEM FT",
    slug: "lomba-desain-logo",
    excerpt: "Hasil perlombaan desain logo BEM FT UNIMMA telah ditentukan, selamat kepada para pemenang!",
    date: "5 Januari 2025",
  },
];

export default function NewsSection() {
  return (
    <section id="berita" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-label-sm text-primary font-medium uppercase tracking-wider">
          Berita
        </span>
        <h2 className="text-headline-lg text-on-surface mt-3">
          Berita Terbaru
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderNews.map((news, i) => (
          <Link
            key={i}
            href={`/berita/${news.slug}`}
            className="bg-surface-bright rounded-card shadow-card overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[16/10] bg-on-surface/5 relative overflow-hidden">
              <Image
                src={`/images/news-${i + 1}.jpg`}
                alt={news.title}
                width={600}
                height={375}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <time className="text-label-sm text-on-surface/50">{news.date}</time>
              <h3 className="text-title-lg text-on-surface mt-1 mb-2 group-hover:text-primary transition-colors">
                {news.title}
              </h3>
              <p className="text-body-md text-on-surface/70 line-clamp-2">
                {news.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
