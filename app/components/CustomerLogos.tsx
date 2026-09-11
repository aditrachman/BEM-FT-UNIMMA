export default function CustomerLogos() {
  const logos = [
    { src: "/LogoUNIMMA.png", alt: "Logo UNIMMA" },
    { src: "/Logofakultas.png", alt: "Logo Fakultas Teknik UNIMMA", plain: true },
    { src: "/logo.png", alt: "Logo BEM FT UNIMMA" },
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
            // eslint-disable-next-line @next/next/no-img-element
            <img key={l.src} src={l.src} alt={l.alt} className={"keluarga__logo" + ("plain" in l && l.plain ? " keluarga__logo--plain" : "")} />
          ))}
        </div>
      </div>
    </section>
  );
}
