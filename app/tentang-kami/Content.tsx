"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { imageUrlTampil } from "@/lib/imageUrl";
import { PERIODE_AKTIF, PERIODE_DOC_ID } from "@/lib/konfig";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

type Pengurus = {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  foto_url: string;
  urutan: number;
};

const squiggle = (
  <svg className="underline-squiggle stroke-blue-3" xmlns="http://www.w3.org/2000/svg" width="158" height="18" fill="none" viewBox="0 0 158 18" preserveAspectRatio="none">
    <path stroke="#353241" strokeWidth="25" d="M1 15c4.603-1.68 15.483-6.046 22.178-10.077C31.548-.115 34.895 15 41.172 15S53.307.389 63.35 3.412c9.743 2.933 8.632 17.127 26.208 6.547C107.133-.621 115.352 25.164 156 3.412" />
  </svg>
);

function Inisial({ nama }: { nama: string }) {
  return (
    <span className="tt-inisial">
      {nama
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}

function PersonFoto({ nama, url }: { nama: string; url: string }) {
  const [gagal, setGagal] = useState(false);
  if (!url || gagal) return <Inisial nama={nama} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrlTampil(url)}
      alt={nama}
      loading="lazy"
      onError={() => setGagal(true)}
    />
  );
}

export default function TentangKamiContent() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState<string[]>([]);
  const [adaKonten, setAdaKonten] = useState(false);
  const [pengurus, setPengurus] = useState<Pengurus[] | null>(null);

  useEffect(() => {
    if (!db) return;
    let hidup = true;
    (async () => {
      try {
        const vDoc = await getDoc(doc(db!, "visi_misi", PERIODE_DOC_ID));
        if (vDoc.exists()) {
          setVisi((vDoc.data().visi as string) ?? "");
          setMisi((vDoc.data().misi as string[]) ?? []);
          setAdaKonten(true);
        }
      } catch (e) {
        console.warn("gagal ambil visi misi:", e);
      }
      try {
        const pSnap = await getDocs(collection(db!, "pengurus"));
        setPengurus(
          pSnap.docs
            .filter((x) => (x.data().periode as string) === PERIODE_AKTIF)
            .map((x) => ({
              id: x.id,
              nama: (x.data().nama as string) ?? "",
              jabatan: (x.data().jabatan as string) ?? "",
              departemen: (x.data().departemen as string) ?? "",
              foto_url: (x.data().foto_url as string) ?? "",
              urutan: Number(x.data().urutan ?? 99),
            })),
        );
      } catch (e) {
        console.warn("gagal ambil pengurus:", e);
        setPengurus([]);
      }
    })();
    return () => {
      hidup = false;
    };
  }, []);

  const grouped: Record<string, Pengurus[]> = {};
  for (const p of pengurus ?? []) (grouped[p.departemen || "Umum"] ||= []).push(p);
  for (const k of Object.keys(grouped)) grouped[k].sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <Header />
      <div id="app">
        <main className="main">
          <div className="page" style={{ paddingTop: 40 }}>
            <section className="heading-module-scss-module__ZBj6zq__wrapper" data-display="inline">
              <div className="container">
                <div className="tagline-module-scss-module__R8CpfG__wrapper color-blue-3">
                  <div className="tagline-module-scss-module__R8CpfG__inner">
                    <span>TENTANG KAMI</span>
                  </div>
                </div>
                <div className="heading-module-scss-module__ZBj6zq__inner">
                  <div className="heading-module-scss-module__ZBj6zq__heading">
                    <h1 className="tt-h1">
                      Mengenal{" "}
                      <strong>
                        BEM FT<span className="underline">{squiggle}</span>
                      </strong>{" "}
                      lebih dekat
                    </h1>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- VISI & MISI ---------- */}
            <section id="visi-misi" className="tt-section">
              <div className="container">
                <div className="tt-card">
                  <h2 className="tt-title">Visi</h2>
                  {adaKonten && visi ? (
                    <p className="tt-visi-text">{visi}</p>
                  ) : (
                    <p className="tt-empty">
                      Visi periode ini sedang disusun — nantikan pembaruan dari
                      kami ya.
                    </p>
                  )}
                  <h2 className="tt-title">Misi</h2>
                  {misi.length ? (
                    <ol className="tt-list">
                      {misi.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="tt-empty">
                      Misi periode ini sedang disusun — nantikan pembaruan dari
                      kami ya.
                    </p>
                  )}
                  <span className="tt-periode">Periode {PERIODE_AKTIF}</span>
                </div>
              </div>
            </section>

            {/* ---------- STRUKTUR KEPENGURUSAN ---------- */}
            <section id="struktur" className="tt-section">
              <div className="container">
                <div className="tagline-module-scss-module__R8CpfG__wrapper color-sea-2">
                  <div className="tagline-module-scss-module__R8CpfG__inner">
                    <span>STRUKTUR KEPENGURUSAN</span>
                  </div>
                </div>
                <div className="heading-module-scss-module__ZBj6zq__inner">
                  <div className="heading-module-scss-module__ZBj6zq__heading">
                    <h2 className="color-blue-1">
                      Pengurus{" "}
                      <strong>
                        BEM FT<span className="underline">{squiggle}</span>
                      </strong>
                    </h2>
                  </div>
                </div>
                <p className="tt-periode-label">Periode {PERIODE_AKTIF}</p>

                {pengurus === null ? null : pengurus.length === 0 ? (
                  <p className="tt-empty" style={{ textAlign: "center" }}>
                    Data kepengurusan sedang disusun. Pantau terus media sosial
                    kami untuk pembaruan.
                  </p>
                ) : (
                  Object.entries(grouped).map(([dep, list]) => (
                    <div key={dep} className="tt-dept">
                      <h3 className="tt-dept-title">{dep}</h3>
                      <div className="tt-grid">
                        {list.map((p) => (
                          <div key={p.id} className="tt-person">
                            <div className="tt-foto">
                              <PersonFoto nama={p.nama} url={p.foto_url} />
                            </div>
                            <strong className="tt-nama">{p.nama}</strong>
                            <span className="tt-jabatan">{p.jabatan}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
