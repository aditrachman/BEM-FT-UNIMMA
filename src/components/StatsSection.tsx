const stats = [
  { value: "50+", label: "Anggota Aktif" },
  { value: "10+", label: "Program Kerja" },
  { value: "6", label: "Divisi" },
  { value: "2020", label: "Tahun Berkiprah" },
];

export default function StatsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-headline-lg text-white font-bold">
                {stat.value}
              </div>
              <div className="text-label-md text-white/80 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
