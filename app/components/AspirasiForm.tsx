"use client";

import { useLayoutEffect, useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AspirasiForm() {
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [pesan, setPesan] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");

  // No Firestore read here: the form IS the content, so the fixed placeholder
  // height is released as soon as it renders (layout effect → before paint).
  useLayoutEffect(() => {
    document
      .querySelector(".sec-ph-asp")
      ?.setAttribute("data-ready", "true");
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!db) return setStatus("err");
    if (pesan.trim().length < 5) return setStatus("err");
    setStatus("busy");
    try {
      await addDoc(collection(db, "aspirasi"), {
        nama: nama.trim(),
        prodi: prodi.trim(),
        pesan: pesan.trim(),
        status: "baru",
        createdAt: serverTimestamp(),
      });
      setStatus("ok");
    } catch (err) {
      console.warn("kirim aspirasi gagal:", err);
      setStatus("err");
    }
  }

  function kirimLagi() {
    setNama("");
    setProdi("");
    setPesan("");
    setStatus("idle");
  }

  return (
    <div className="asp-card">
      {status === "ok" ? (
        <div className="asp-success">
          <div className="asp-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.5l5 5 10-11" />
            </svg>
          </div>
          <h3>Aspirasi terkirim!</h3>
          <p>
            Makasih udah peduli sama Fakultas Teknik 🌱 Pengurus BEM FT bakal
            baca tiap masukan, satu per satu.
          </p>
          <button className="asp-ghost" onClick={kirimLagi}>
            Kirim aspirasi lain
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="asp-intro">
            Sampaikan masukan, kritik, atau ide untuk kampus — dapat disampaikan
            secara anonim, nama tidak wajib diisi.
          </p>
          <div className="asp-grid">
            <label>
              Nama <em>(opsional)</em>
              <input
                className="adm-in"
                maxLength={100}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </label>
            <label>
              Prodi / Angkatan <em>(opsional)</em>
              <input
                className="adm-in"
                maxLength={100}
                placeholder="mis. Informatika 2024"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
              />
            </label>
          </div>
          <label className="asp-full">
            Aspirasi kamu
            <textarea
              className="adm-in"
              required
              minLength={5}
              maxLength={1000}
              rows={5}
              placeholder="Ceritain aja — fasilitas, akademik, kegiatan, apa pun."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
            />
            <span className="asp-count">{pesan.length}/1000</span>
          </label>
          {status === "err" && (
            <p className="adm-err">
              Gagal mengirim — pastikan pesan minimal 5 karakter.
            </p>
          )}
          <div className="button-module-scss-module__REpPyW__wrapper primary asp-submit">
            <button type="submit" disabled={status === "busy"}>
              <span>
                <em>{status === "busy" ? "Mengirim…" : "Kirim Aspirasi"}</em>
                <em>{status === "busy" ? "Mengirim…" : "Kirim Aspirasi"}</em>
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
