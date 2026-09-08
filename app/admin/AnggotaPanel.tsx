"use client";

import { useEffect, useState, type FormEvent } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Anggota = {
  email: string;
  nama: string;
  jabatan: string;
  departemen: string;
  aktif: boolean;
};

const empty = { email: "", nama: "", jabatan: "", departemen: "", aktif: true };

export function AnggotaPanel() {
  const [rows, setRows] = useState<Anggota[]>([]);
  const [f, setF] = useState({ ...empty });
  const [editId, setEditId] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  useEffect(
    () =>
      onSnapshot(collection(db!, "anggota"), (s) =>
        setRows(
          s.docs
            .map((x) => ({
              email: x.id,
              nama: (x.data().nama as string) ?? "",
              jabatan: (x.data().jabatan as string) ?? "",
              departemen: (x.data().departemen as string) ?? "",
              aktif: x.data().aktif !== false,
            }))
            .sort((a, b) => a.nama.localeCompare(b.nama)),
        ),
      ),
    [],
  );

  async function simpan(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setInfo("");
    const em = (editId || f.email).trim().toLowerCase();
    if (!em || !f.nama.trim()) return setErr("Email & nama wajib diisi.");
    try {
      await setDoc(doc(db!, "anggota", em), {
        email: em,
        nama: f.nama.trim(),
        jabatan: f.jabatan.trim(),
        departemen: f.departemen.trim(),
        aktif: f.aktif,
      });
      setF({ ...empty });
      setEditId("");
      setInfo("Tersimpan ✓");
    } catch {
      setErr("Gagal simpan — cek rules Firestore.");
    }
  }

  async function hapus(email: string) {
    if (!confirm(`Hapus anggota ${email}?`)) return;
    try {
      await deleteDoc(doc(db!, "anggota", email));
    } catch {
      setErr("Gagal hapus — cek rules.");
    }
  }

  /**导入 massal: 1 baris = email,nama,jabatan,departemen (2 kolom terakhir opsional) */
  async function impor(text: string) {
    const baris = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let ok = 0;
    for (const l of baris) {
      const [em = "", nama = "", jabatan = "", departemen = ""] = l
        .split(/[,;\t]/)
        .map((c) => c.trim());
      const email = em.toLowerCase();
      if (!email.includes("@") || !nama) continue;
      try {
        await setDoc(doc(db!, "anggota", email), {
          email,
          nama,
          jabatan,
          departemen,
          aktif: true,
        });
        ok++;
      } catch {
        /* lewati yang gagal */
      }
    }
    setInfo(`${ok} anggota tersimpan dari impor ✓`);
  }

  return (
    <>
      <div className="adm-card">
        <div>
          <h2 className="adm-cardtitle">{editId ? "Edit anggota" : "Tambah anggota"}</h2>
          <p className="adm-cardsubtitle">
            Anggota adalah 50 orang internal yang boleh absen &amp; lihat sesi.
          </p>
        </div>
        <form onSubmit={simpan} className="adm-col">
          <div className="adm-grid">
            <label>
              Email
              <input
                className="adm-in"
                required
                disabled={!!editId}
                placeholder="nama@student.unimma.ac.id"
                value={editId || f.email}
                onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))}
              />
            </label>
            <label>
              Nama
              <input
                className="adm-in"
                required
                value={f.nama}
                onChange={(e) => setF((p) => ({ ...p, nama: e.target.value }))}
              />
            </label>
            <label>
              Jabatan
              <input
                className="adm-in"
                value={f.jabatan}
                onChange={(e) => setF((p) => ({ ...p, jabatan: e.target.value }))}
              />
            </label>
            <label>
              Departemen
              <input
                className="adm-in"
                value={f.departemen}
                onChange={(e) =>
                  setF((p) => ({ ...p, departemen: e.target.value }))
                }
              />
            </label>
          </div>
          <label className="adm-cek">
            <input
              type="checkbox"
              checked={f.aktif}
              onChange={(e) => setF((p) => ({ ...p, aktif: e.target.checked }))}
            />{" "}
            Aktif (boleh check-in)
          </label>
          {err && <p className="adm-err">{err}</p>}
          {info && <p className="adm-note">{info}</p>}
          <div className="adm-row">
            <button className="adm-btn">
              {editId ? "Update" : "Simpan anggota"}
            </button>
            {editId && (
              <button
                type="button"
                className="adm-btn ghost"
                onClick={() => {
                  setEditId("");
                  setF({ ...empty });
                }}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <details className="adm-card adm-import">
        <summary className="adm-cardtitle" style={{ cursor: "pointer" }}>
          Impor massal (50 anggota)
        </summary>
        <p className="adm-cardsubtitle" style={{ padding: "12px 0 0" }}>
          Satu baris = <code>email,nama,jabatan,departemen</code> (2 terakhir
          boleh kosong). Tempel dari Excel lalu simpan.
        </p>
        <div style={{ padding: "12px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea id="impor-anggota" className="adm-in" rows={8} placeholder="aldo@student.unimma.ac.id,Aldo Pratama,Staff Humas,Humas" />
          <div>
            <button
              className="adm-btn ghost"
              onClick={() => {
                const t = (document.getElementById("impor-anggota") as HTMLTextAreaElement)
                  ?.value;
                if (t) impor(t);
              }}
            >
              Proses impor
            </button>
          </div>
        </div>
      </details>

      <div className="adm-list">
        {rows.map((r) => (
          <div key={r.email} className="adm-item">
              <div>
                <strong>{r.nama || r.email}</strong>{" "}
                <span className={`adm-badge ${r.aktif ? "aktif" : "draft"}`}>{r.aktif ? "aktif" : "nonaktif"}</span>
                <small>
                  {[r.jabatan, r.departemen].filter(Boolean).join(" · ")}
                  {r.jabatan || r.departemen ? " · " : ""}
                  {r.email}
                </small>
              </div>
            <div className="adm-row">
              <button
                className="adm-btn small ghost"
                onClick={() => {
                  setEditId(r.email);
                  setF({ ...r });
                }}
              >
                Edit
              </button>
              <button
                className="adm-btn small danger"
                onClick={() => hapus(r.email)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {!rows.length && (
          <p className="adm-note">Belum ada anggota — tambah manual atau impor massal.</p>
        )}
      </div>
    </>
  );
}
