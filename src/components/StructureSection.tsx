import Image from "next/image";

const placeholderStructure = [
  { name: "Ketua BEM", position: "Ketua Umum", division: "Pengurus Harian" },
  { name: "Wakil Ketua", position: "Wakil Ketua Umum", division: "Pengurus Harian" },
  { name: "Sekretaris", position: "Sekretaris Umum", division: "Pengurus Harian" },
  { name: "Bendahara", position: "Bendahara Umum", division: "Pengurus Harian" },
];

export default function StructureSection() {
  return (
    <section id="struktur" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-surface-bright/50">
      <div className="text-center mb-12">
        <span className="text-label-sm text-primary font-medium uppercase tracking-wider">
          Struktur
        </span>
        <h2 className="text-headline-lg text-on-surface mt-3">
          Struktur Organisasi
        </h2>
        <p className="text-body-lg text-on-surface/60 mt-2">Periode 2024/2025</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {placeholderStructure.map((person, i) => (
          <div key={i} className="text-center group">
            <div className="relative w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden bg-on-surface/10">
              <Image
                src={`/images/structure-${i + 1}.jpg`}
                alt={person.name}
                width={112}
                height={112}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 className="text-label-md text-on-surface">{person.name}</h4>
            <p className="text-label-sm text-on-surface/60">{person.position}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
