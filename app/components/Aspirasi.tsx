"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Aspirasi() {
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [pesan, setPesan] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");

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
    <section className="heading-module-scss-module__ZBj6zq__wrapper" data-display="inline" id="aspirasi">
      <div className="container">
        <div className="tagline-module-scss-module__R8CpfG__wrapper color-sea-2">
          <div className="tagline-module-scss-module__R8CpfG__inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path fill="#353241" d="M10 0H8v18h2z" />
              <path fill="#353241" d="M3.34 1.929 1.927 3.343l12.728 12.728 1.415-1.414z" />
              <path fill="#353241" d="M18 8H0v2h18z" />
              <path fill="#353241" d="M14.654 1.929 1.926 14.657l1.415 1.414L16.069 3.343z" />
            </svg>
            <span>ASPIRASI</span>
          </div>
        </div>
        <div className="heading-module-scss-module__ZBj6zq__inner">
          <div className="heading-module-scss-module__ZBj6zq__heading">
            <h2 className="color-blue-1">
              Sampaikan{" "}
              <strong>
                Aspirasimu
                <span className="underline">
                  <svg className="underline-squiggle stroke-sea-2" xmlns="http://www.w3.org/2000/svg" width="158" height="18" fill="none" viewBox="0 0 158 18" preserveAspectRatio="none">
                    <path stroke="#353241" strokeWidth="25" d="M1 15c4.603-1.68 15.483-6.046 22.178-10.077C31.548-.115 34.895 15 41.172 15S53.307.389 63.35 3.412c9.743 2.933 8.632 17.127 26.208 6.547C107.133-.621 115.352 25.164 156 3.412" />
                  </svg>
                </span>
              </strong>
            </h2>
          </div>
        </div>

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
                Masukan, kritik, atau ide buat kampus — boleh anonim, nama
                gak wajib.
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
      </div>
    </section>
  );
}
