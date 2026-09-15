import Image from "next/image";
import Link from "next/link";

function CloudSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96.869 49.214"
      width="120"
      height="61"
      className={className}
    >
      <path
        d="m46.646 11.989c-1.037-5.107-9.81-12.593-15.065-11.193-6.581 1.817-9.612 7.693-4.909 12.122-4.161-2.816-14.543-5.239-20.17 4.572-3.4936 7.309 6.399 11.882 9.425 11.341-5.791-0.696-20.058 11.214-13.705 17.281 7.827 6.166 25.756-0.502 26.543-5.653-1.746 7.532 18.174 8.978 18.667-1.49-1.422 4.908 12.792 10.132 19.549 8.133 8.469-2.066 7.451-9.042 6.449-11.169 6.514 0.745 16.714 2.591 21.232-4.104 3.148-6.326 1.277-13.393-2.777-15.615-4.417-2.102-9.244-1.993-14.873 1.567 4.467-2.907 1.712-12.282-2.765-14.342-5.102-2.339-11.232-2.796-16.737-1.658-4.536 0.726-11.716 4.552-10.864 10.208z"
        fill="none"
        stroke="#7DD3F0"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <span className="inline-block bg-primary-container text-primary text-label-sm font-medium px-4 py-1.5 rounded-badge mb-6">
          Badan Eksekutif Mahasiswa
        </span>

        {/* Headline with clouds */}
        <div className="relative w-full max-w-4xl">
          {/* Cloud left */}
          <CloudSvg className="hidden md:block absolute -left-16 top-1/2 -translate-y-1/2" />

          {/* Headline */}
          <h1 className="text-display">
            <span className="block text-on-surface">Fakultas Teknik</span>
            <span className="block text-primary">UNIMMA</span>
          </h1>

          {/* Cloud right */}
          <CloudSvg className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 scale-x-[-1]" />
        </div>

        {/* Subheadline */}
        <p className="text-body-lg text-on-surface/70 mt-6 max-w-md">
          Wadah aspirasi, kolaborasi, dan pengembangan diri mahasiswa Fakultas
          Teknik Universitas Muhammadiyah Magelang.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="#program-kerja"
            className="text-label-md bg-primary text-white px-6 py-3 rounded-button hover:opacity-90 transition-opacity"
          >
            Lihat Program Kerja
          </Link>
          <Link
            href="#tentang"
            className="text-label-md border-2 border-on-surface/20 text-on-surface px-6 py-3 rounded-button hover:border-on-surface/40 transition-colors"
          >
            Tentang Kami
          </Link>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative mt-12 max-w-5xl mx-auto">
        {/* Washi tape wrapper — matches Adora tapes-module positioning */}
        <div
          className="absolute z-10 flex justify-between pointer-events-none"
          style={{
            top: 0,
            left: "-5%",
            width: "110%",
            transform: "translateY(-40%)",
          }}
        >
          {/* Tape left */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="136"
            height="139"
            viewBox="0 0 136 139"
            style={{ width: "10%", height: "auto", transformOrigin: "100% 0" }}
          >
            <g fillOpacity="0.7" fillRule="nonzero" stroke="none">
              <g
                fill="#a2ea13"
                stroke="#7bc13a"
                strokeWidth="4"
                transform="translate(2.12 2.75)"
              >
                <path d="M9.001 87.662C29.514 70.568 75.481 25.255 97.171 3.7c9.836-9.774 6.845 2.641 9.5 5s5.815.17 9 3-2.185 6.17 1.001 9 3.638.437 7 2c2.69 1.25 1.094 5 1 8-.175 5.542 13.761-1.779 3.184 8.761-13.297 13.252-64.748 62.351-91.684 88.74-16.01 15.683-2-5-11.5-5s2.474-12.306-8.763-12.306-3.82-7.512-5.237-10.195-22.184 4.056-1.67-13.038Z" />
              </g>
            </g>
          </svg>

          {/* Tape right — mirrored, at right edge of photo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="136"
            height="139"
            viewBox="0 0 136 139"
            style={{
              width: "10%",
              height: "auto",
              transform: "scaleX(-1)",
              transformOrigin: "100% 0",
            }}
          >
            <g fillOpacity="0.7" fillRule="nonzero" stroke="none">
              <g
                fill="#a2ea13"
                stroke="#7bc13a"
                strokeWidth="4"
                transform="translate(2.12 2.75)"
              >
                <path d="M9.001 87.662C29.514 70.568 75.481 25.255 97.171 3.7c9.836-9.774 6.845 2.641 9.5 5s5.815.17 9 3-2.185 6.17 1.001 9 3.638.437 7 2c2.69 1.25 1.094 5 1 8-.175 5.542 13.761-1.779 3.184 8.761-13.297 13.252-64.748 62.351-91.684 88.74-16.01 15.683-2-5-11.5-5s2.474-12.306-8.763-12.306-3.82-7.512-5.237-10.195-22.184 4.056-1.67-13.038Z" />
              </g>
            </g>
          </svg>
        </div>

        {/* Placeholder image */}
        <div className="w-full aspect-[16/10] bg-on-surface/10 rounded-xl overflow-hidden">
          <Image
            src="/images/hero-placeholder.jpg"
            alt="Kegiatan BEM FT UNIMMA"
            width={1200}
            height={750}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
