import Image from "next/image";

export default function CustomerLogos() {
  const logos = [
    { src: "/images/logos/dpm.png", alt: "Logo DPM" },
    { src: "/images/logos/himanifo.png", alt: "Logo Himanifo" },
    { src: "/images/logos/hmti.png", alt: "Logo HMTI" },
    { src: "/images/logos/hmtm.png", alt: "Logo HMTM" },
    { src: "/images/logos/hmto.png", alt: "Logo HMTO" },
  ];
  return (
    <section className="keluarga">
      <div className="container">
        <h2 className="keluarga__label">Kami Keluarga Fakultas Teknik UNIMMA</h2>
        <p className="keluarga__sub">
          Dari lintas jurusan dan angkatan, kita tumbuh, berkarya, dan bergerak
          bersama sebagai satu keluarga besar — menuju Fakultas Teknik yang lebih baik.
        </p>
        <div className="keluarga__logos">
          {logos.map((l) => (
            <Image
              key={l.src}
              src={l.src}
              alt={l.alt}
              width={1000}
              height={1000}
              sizes="(max-width: 768px) 88px, 118px"
              className="keluarga__logo"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
