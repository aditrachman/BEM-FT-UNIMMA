"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { imageUrlTampil } from "@/lib/imageUrl";

type Info = {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  tanggal: string;
  kategori: string;
};

function formatTanggal(d: Date) {
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InfoTerbaru() {
  const [items, setItems] = useState<Info[] | null>(null);

  useEffect(() => {
    if (!db) {
      setItems([]);
      return;
    }
    getDocs(collection(db, "info"))
      .then((snap) => {
        setItems(
          snap.docs
            .filter((d) => d.data().status !== "draft")
            .map((d) => {
              const x = d.data();
              return {
                ts: x.tanggal?.seconds ?? -1,
                it: {
                  id: d.id,
                  judul: x.judul ?? "",
                  deskripsi: x.deskripsi ?? "",
                  gambar: x.gambar ?? "",
                  kategori: x.kategori ?? "",
                  tanggal: x.tanggal?.toDate
                    ? formatTanggal(x.tanggal.toDate())
                    : "",
                } as Info & { ts: number },
              };
            })
            .sort(
              (a: { ts: number }, b: { ts: number }) => b.ts - a.ts,
            )
            .slice(0, 4)
            .map(
              (r: { it: Info }) => r.it,
            ),
        );
      })
      .catch((e) => {
        console.warn("gagal ambil info:", e);
        setItems([]);
      });
  }, []);

  if (items === null) return null;
  if (!items.length) return null; // belum ada info → section sembunyi rapi

  return (
    <section className="heading-module-scss-module__ZBj6zq__wrapper" data-display="inline" id="info">
      <div className="container">
        <div className="tagline-module-scss-module__R8CpfG__wrapper color-sea-2">
          <div className="tagline-module-scss-module__R8CpfG__inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path fill="#353241" d="M10 0H8v18h2z" />
              <path fill="#353241" d="M3.34 1.929 1.927 3.343l12.728 12.728 1.415-1.414z" />
              <path fill="#353241" d="M18 8H0v2h18z" />
              <path fill="#353241" d="M14.654 1.929 1.926 14.657l1.415 1.414L16.069 3.343z" />
            </svg>
            <span>INFO</span>
          </div>
        </div>
        <div className="heading-module-scss-module__ZBj6zq__inner">
          <div className="heading-module-scss-module__ZBj6zq__heading">
            <h2 className="color-blue-1">Info{" "}<strong>Terbaru<span className="underline"><svg className="underline-squiggle stroke-sea-3" xmlns="http://www.w3.org/2000/svg" width="158" height="18" fill="none" viewBox="0 0 158 18" preserveAspectRatio="none"><path stroke="#353241" strokeWidth="25" d="M1 15c4.603-1.68 15.483-6.046 22.178-10.077C31.548-.115 34.895 15 41.172 15S53.307.389 63.35 3.412c9.743 2.933 8.632 17.127 26.208 6.547C107.133-.621 115.352 25.164 156 3.412" /></svg></span></strong></h2>
          </div>
        </div>
        <div className="info-card">
          {items.map((i) => (
            <div key={i.id} className="info-row">
              {i.gambar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="info-thumb"
                  src={imageUrlTampil(i.gambar)}
                  alt={i.judul}
                  loading="lazy"
                />
              )}
              <time className="info-date">{i.tanggal}</time>
              <div className="info-body">
                <h3>{i.judul}</h3>
                <p>{i.deskripsi}</p>
                {i.kategori && <span className="info-kat">{i.kategori}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
