import Image from "next/image";

const placeholderPrograms = [
  {
    title: "Workshop Teknologi",
    description: "Pelatihan dan workshop tentang teknologi terkini untuk mahasiswa FT.",
    icon: "💻",
  },
  {
    title: "Bakti Sosial",
    description: "Kegiatan bakti sosial dan pengabdian masyarakat oleh mahasiswa FT.",
    icon: "🤝",
  },
  {
    title: "Lomba Teknik",
    description: "Kompetisi dan lomba bidang teknik untuk mengasah kemampuan mahasiswa.",
    icon: "🏆",
  },
];

export default function ProgramsSection() {
  return (
    <section id="program-kerja" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-label-sm text-primary font-medium uppercase tracking-wider">
          Program Kerja
        </span>
        <h2 className="text-headline-lg text-on-surface mt-3">
          Program Kerja Unggulan
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderPrograms.map((program, i) => (
          <div
            key={i}
            className="bg-surface-bright rounded-card shadow-card overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] bg-on-surface/5 relative overflow-hidden">
              <Image
                src={`/images/program-${i + 1}.jpg`}
                alt={program.title}
                width={600}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="text-2xl mb-2">{program.icon}</div>
              <h3 className="text-title-lg text-on-surface mb-2">
                {program.title}
              </h3>
              <p className="text-body-md text-on-surface/70">
                {program.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
