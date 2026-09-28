"use client";

import { useEffect, useLayoutEffect, useState } from "react";
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

// Drop the fixed placeholder height only once Firestore has answered
// (list, empty or error). Called from a layout effect so the attribute lands
// in the SAME paint as the content — no intermediate collapse to 0.
function markReady() {
  document
    .querySelector(".sec-ph-info")
    ?.setAttribute("data-ready", "true");
}

export default function InfoTerbaruList() {
  const [items, setItems] = useState<Info[] | null>(() => (db ? null : []));

  useLayoutEffect(() => {
    if (items !== null) markReady();
  }, [items]);

  useEffect(() => {
    if (!db) return;
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

  if (items === null) return <div className="sec-ph-inner" aria-hidden />;
  if (!items.length) return null; // belum ada info → konten section sembunyi rapi

  return (
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
              referrerPolicy="no-referrer"
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
  );
}
