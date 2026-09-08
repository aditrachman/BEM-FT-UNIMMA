"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { imageUrlTampil } from "@/lib/imageUrl";
import { PERIODE_AKTIF } from "@/lib/konfig";

type Pengurus = {
  id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  foto_url: string;
  urutan: number;
  periode: string;
};

const emptyForm: Pengurus = {
  id: "",
  nama: "",
  jabatan: "",
  departemen: "",
  foto_url: "",
  urutan: 1,
  periode: PERIODE_AKTIF,
};

async function uploadFoto(file: File): Promise<string> {
  const token = await auth!.currentUser!.getIdToken();
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/upload-foto-pengurus", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ?? `Upload gagal (${r.status})`);
  return j.url as string;
}

export function PengurusPanel() {
  const [rows, setRows] = useState<Pengurus[]>([]);
  const [periodeFilter, setPeriodeFilter] = useState(PERIODE_AKTIF);
  const [f, setF] = useState<Pengurus>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [filePrev, setFilePrev] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function pilihFile(fl: File | null) {
    if (filePrev) URL.revokeObjectURL(filePrev);
    setFile(fl);
    setFilePrev(fl ? URL.createObjectURL(fl) : "");
  }

  useEffect(
    () =>
      onSnapshot(collection(db!, "pengurus"), (s) =>
        setRows(
          s.docs.map((x) => ({
            id: x.id,
            nama: (x.data().nama as string) ?? "",
            jabatan: (x.data().jabatan as string) ?? "",
            departemen: (x.data().departemen as string) ?? "",
            foto_url: (x.data().foto_url as string) ?? "",
            urutan: Number(x.data().urutan ?? 99),
            periode: (x.data().periode as string) ?? PERIODE_AKTIF,
          })),
        ),
      ),
    [],
  );

  const set = (k: keyof Pengurus, v: string | number) =>
    setF((p) => ({ ...p, [k]: v }));

  // periode yang pernah dipakai (buat filter)
  const semuaPeriode = Array.from(new Set(rows.map((r) => r.periode))).sort().reverse();
  const opsiPeriode = semuaPeriode.includes(periodeFilter)
    ? semuaPeriode
    : [periodeFilter, ...semuaPeriode];

  const departemenUnik = Array.from(new Set(rows.map((r) => r.departemen).filter(Boolean)));
  const tampil = rows.filter((r) => r.periode === periodeFilter);
  const grouped = tampil.reduce<Record<string, Pengurus[]>>((acc, r) => {
    (acc[r.departemen || "Umum"] ||= []).push(r);
    return acc;
  }, {});

  function edit(r: Pengurus) {
    setF({ ...r });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      let foto_url = f.foto_url;
      if (file) foto_url = await uploadFoto(file);
      const payload = {
        nama: f.nama.trim(),
        jabatan: f.jabatan.trim(),
        departemen: f.departemen.trim(),
        foto_url,
        urutan: Number(f.urutan) || 99,
        periode: f.periode.trim() || PERIODE_AKTIF,
      };
      if (f.id) await updateDoc(doc(db!, "pengurus", f.id), payload);
      else await addDoc(collection(db!, "pengurus"), payload);
      setF(emptyForm);
      pilihFile(null);
    } catch (e2) {
      setErr(
        e2 instanceof Error
          ? `Gagal simpan — ${e2.message}`
          : "Gagal simpan — periksa rules Firestore.",
      );
      console.warn(e2);
    } finally {
      setBusy(false);
    }
  }

  async function hapus(r: Pengurus) {
    if (!confirm(`Hapus ${r.nama}?`)) return;
    try {
      await deleteDoc(doc(db!, "pengurus", r.id));
    } catch {
      setErr("Gagal hapus — kemungkinan rules belum di-Publish ulang.");
    }
  }

  return (
    <>
      <div className="adm-card">
        <div>
          <h2 className="adm-cardtitle">
            {f.id ? "Edit pengurus" : "Tambah pengurus baru"}
          </h2>
          <p className="adm-cardsubtitle">
            Periode aktif: <strong>{PERIODE_AKTIF}</strong> — data periode lama
            tetap tersimpan sebagai arsip.
          </p>
        </div>
        <div className="adm-grid">
          <label>
            Nama
            <input
              className="adm-in"
              required
              value={f.nama}
              onChange={(e) => set("nama", e.target.value)}
            />
          </label>
          <label>
            Jabatan
            <input
              className="adm-in"
              required
              placeholder="mis. Ketua BEM"
              value={f.jabatan}
              onChange={(e) => set("jabatan", e.target.value)}
            />
          </label>
          <label>
            Departemen
            <input
              className="adm-in"
              list="daftar-departemen"
              required
              placeholder="mis. Pimpinan / Departemen Humas"
              value={f.departemen}
              onChange={(e) => set("departemen", e.target.value)}
            />
            <datalist id="daftar-departemen">
              {departemenUnik.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </label>
          <div className="adm-grid2">
            <label>
              Urutan
              <input
                className="adm-in"
                type="number"
                min={1}
                value={f.urutan}
                onChange={(e) => set("urutan", Number(e.target.value))}
              />
            </label>
            <label>
              Periode
              <input
                className="adm-in"
                required
                value={f.periode}
                onChange={(e) => set("periode", e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="adm-grid">
          <label>
            Foto (upload)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => pilihFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label>
            atau URL foto
            <input
              className="adm-in"
              placeholder="https://… (bisa link Google Drive)"
              value={f.foto_url}
              onChange={(e) => set("foto_url", e.target.value)}
            />
          </label>
        </div>
        {file && <p className="adm-note">Akan upload: {file.name}</p>}
        {(file || f.foto_url) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="adm-prev adm-prev-sm"
            src={file ? filePrev : imageUrlTampil(f.foto_url)}
            alt="preview foto"
          />
        )}
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-row">
          <button className="adm-btn" disabled={busy}>
            {busy ? "Menyimpan…" : f.id ? "Update" : "Simpan pengurus"}
          </button>
          {f.id && (
            <button
              type="button"
              className="adm-btn ghost"
              onClick={() => {
                setF(emptyForm);
                pilihFile(null);
              }}
            >
              Batal edit
            </button>
          )}
        </div>
      </div>

      <div className="adm-row adm-filter">
        <span className="adm-note">Tampilkan periode:</span>
        <select
          className="adm-in"
          style={{ width: "auto" }}
          value={periodeFilter}
          onChange={(e) => setPeriodeFilter(e.target.value)}
        >
          {opsiPeriode.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {!tampil.length ? (
        <p className="adm-note">
          Belum ada pengurus periode ini — data sedang disusun.
        </p>
      ) : (
        Object.entries(grouped).map(([dep, list]) => (
          <div key={dep} className="adm-dept">
            <h3 className="adm-dept-title">{dep}</h3>
            {list
              .slice()
              .sort((a, b) => a.urutan - b.urutan)
              .map((r) => (
                <div key={r.id} className="adm-item adm-item-person">
                  {r.foto_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="adm-avatar"
                      src={imageUrlTampil(r.foto_url)}
                      alt={r.nama}
                    />
                  )}
                  <div>
                    <strong>{r.nama}</strong>
                    <small>{r.jabatan}</small>
                  </div>
                  <div className="adm-row">
                    <button className="adm-btn small ghost" onClick={() => edit(r)}>
                      Edit
                    </button>
                    <button
                      className="adm-btn small danger"
                      onClick={() => hapus(r)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))
      )}
    </>
  );
}
