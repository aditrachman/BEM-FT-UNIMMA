export default function AboutSection() {
  return (
    <section id="tentang" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-label-sm text-primary font-medium uppercase tracking-wider">
          Tentang Kami
        </span>
        <h2 className="text-headline-lg text-on-surface mt-3">
          Visi & Misi
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Visi */}
        <div className="bg-secondary/10 rounded-card p-8 border border-secondary/20">
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h3 className="text-title-lg text-on-surface mb-3">Visi</h3>
          <p className="text-body-md text-on-surface/70 leading-relaxed">
            Menjadi organisasi mahasiswa yangVisioner, inspiratif, dan
            berkontribusi nyata dalam pengembangan potensi mahasiswa Fakultas
            Teknik UNIMMA.
          </p>
        </div>

        {/* Misi */}
        <div className="bg-tertiary/10 rounded-card p-8 border border-tertiary/20">
          <div className="w-12 h-12 bg-tertiary/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-title-lg text-on-surface mb-3">Misi</h3>
          <ul className="space-y-2">
            {[
              "Menjadi wadah aspirasi dan advokasi mahasiswa FT",
              "Mengembangkan potensi kepemimpinan dan organisasi",
              "Menyelenggarakan program kerja yang bermanfaat",
              "Mempererat silaturahmi antar mahasiswa FT",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-body-md text-on-surface/70"
              >
                <span className="text-tertiary mt-1 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
