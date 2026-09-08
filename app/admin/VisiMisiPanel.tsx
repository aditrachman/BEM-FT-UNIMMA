"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PERIODE_AKTIF } from "@/lib/konfig";

export function VisiMisiPanel() {
  const [periode, setPeriode] = useState(PERIODE_AKTIF);
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState<string[]>([""]);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // ambil dokumen visi_misi/<periode> yang sedang dibuka
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(
      doc(db, "visi_misi", periode || "_kosong"),
      (s) => {
        if (s.exists()) {
          const d = s.data();
          setVisi((d.visi as string) ?? "");
          setMisi((d.misi as string[] | undefined) ?? [""]);
        } else {
          setVisi("");
          setMisi([""]);
        }
      },
      () => undefined,
    );
    return unsub;
  }, [periode]);

  function setMisiRow(i: number, v: string) {
    setMisi((p) => p.map((x, idx) => (idx === i ? v : x)));
  }

  async function simpan() {
    if (!db) return;
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      const bersih = misi.map((m) => m.trim()).filter(Boolean);
      await setDoc(doc(db, "visi_misi", periode.trim() || PERIODE_AKTIF), {
        visi: visi.trim(),
        misi: bersih,
        periode: periode.trim() || PERIODE_AKTIF,
      });
      setInfo("Tersimpan ✓");
    } catch (e2) {
      setErr(
        "Gagal simpan — kemungkinan rules Firestore belum di-Publish ulang.",
      );
      console.warn(e2);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-card">
      <div>
        <h2 className="adm-cardtitle">Visi &amp; Misi per Periode</h2>
        <p className="adm-cardsubtitle">
          Simpan visi &amp; misi untuk periode tertentu — tampil di halaman
          /tentang-kami.
        </p>
      </div>
      <label style={{ maxWidth: 240 }}>
        Periode
        <input
          className="adm-in"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
        />
      </label>

      <label>
        Visi
        <textarea
          className="adm-in"
          rows={3}
          value={visi}
          onChange={(e) => setVisi(e.target.value)}
          placeholder="Tulis visi BEM FT periode ini…"
        />
      </label>

      <div className="adm-col" style={{ gap: 8 }}>
        <span className="adm-note" style={{ fontWeight: 600, color: "var(--color-grey-1)" }}>
          Misi (setiap baris = satu poin)
        </span>
        {misi.map((m, i) => (
          <div key={i} className="adm-row" style={{ width: "100%" }}>
            <input
              className="adm-in"
              value={m}
              placeholder={`Poin misi ${i + 1}`}
              onChange={(e) => setMisiRow(i, e.target.value)}
            />
            <button
              type="button"
              className="adm-btn small danger"
              disabled={misi.length === 1}
              onClick={() => setMisi((p) => p.filter((_, idx) => idx !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="adm-btn small ghost"
          onClick={() => setMisi((p) => [...p, ""])}
        >
          + Tambah poin misi
        </button>
      </div>

      {err && <p className="adm-err">{err}</p>}
      {info && <p className="adm-note">{info}</p>}
      <div className="adm-row">
        <button className="adm-btn" disabled={busy} onClick={simpan}>
          {busy ? "Menyimpan…" : "Simpan visi & misi"}
        </button>
      </div>
    </div>
  );
}
