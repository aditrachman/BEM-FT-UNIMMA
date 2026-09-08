"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

const toLocal = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

/* ---------------- shell: login gate ---------------- */

export default function AdminPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [koleksi, setKoleksi] = useState<Koleksi>("proker");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!auth || !db || !storage)
    return (
      <div className="adm-wrap">
        <p className="adm-note">
          Firebase belum dikonfigurasi — isi <code>.env.local</code> lalu
          restart dev server.
        </p>
      </div>
    );
  if (user === undefined) return null;
  return user ? (
    <Panel email={user.email ?? "?"} koleksi={koleksi} ganti={setKoleksi} />
  ) : (
    <Login />
  );
}

/* ---------------- login ---------------- */

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth!, email, pw);
    } catch {
      setErr(
        "Gagal login — pastikan email/password benar dan akun sudah dibuat di menu Authentication.",
      );
    }
  }

  return (
    <div className="adm-wrap adm--center">
      <form onSubmit={submit} className="adm-card adm-auth">
        <div className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="adm-logo" src="/logo.png" alt="" />
          <span className="adm-note">BEM FT UNIMMA</span>
        </div>
        <div>
          <h1 className="adm-h1">Admin Program Kerja</h1>
          <p className="adm-cardsubtitle">
            Masuk untuk kelola proker yang tampil di website.
          </p>
        </div>
        <label>
          Email
          <input
            className="adm-in"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            className="adm-in"
            type="password"
            required
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </label>
        {err && <p className="adm-err">{err}</p>}
        <button className="adm-btn full" type="submit">
          Masuk
        </button>
      </form>
    </div>
  );
}

/* ---------------- panel CRUD ---------------- */

type Koleksi = "proker" | "info";
type Row = { id: string; d: Record<string, unknown> };
const emptyForm = {
  id: "",
  judul: "",
  kategori: "",
  status: "aktif",
  tanggal: "",
  gambar: "",
  deskripsi: "",
};

function Panel({
  email,
  koleksi,
  ganti,
}: {
  email: string;
  koleksi: Koleksi;
  ganti: (k: Koleksi) => void;
}) {
  const label = koleksi === "proker" ? "proker" : "info";
  const [rows, setRows] = useState<Row[]>([]);
  const [f, setF] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      onSnapshot(collection(db!, koleksi), (s) =>
        setRows(
          s.docs
            .map((x) => ({ id: x.id, d: x.data() as Record<string, unknown> }))
            .sort(
              (a, b) =>
                ((b.d.tanggal as { seconds?: number })?.seconds ?? -1) -
                ((a.d.tanggal as { seconds?: number })?.seconds ?? -1),
            ),
        ),
      ),
    [],
  );

  const set = (k: keyof typeof emptyForm, v: string) =>
    setF((p) => ({ ...p, [k]: v }));

  function edit(r: Row) {
    const t = (r.d.tanggal as { toDate?: () => Date } | null)?.toDate?.();
    setF({
      id: r.id,
      judul: (r.d.judul as string) ?? "",
      kategori: (r.d.kategori as string) ?? "",
      status: (r.d.status as string) ?? "aktif",
      tanggal: t ? toLocal(t) : "",
      gambar: (r.d.gambar as string) ?? "",
      deskripsi: (r.d.deskripsi as string) ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      let gambar = f.gambar;
      if (file) {
        const r = ref(
          storage!,
          `proker/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        );
        await uploadBytes(r, file);
        gambar = await getDownloadURL(r);
      }
      const payload = {
        judul: f.judul,
        deskripsi: f.deskripsi,
        kategori: f.kategori,
        status: f.status,
        gambar,
        tanggal: f.tanggal ? Timestamp.fromDate(new Date(f.tanggal)) : null,
      };
      if (f.id) await updateDoc(doc(db!, koleksi, f.id), payload);
      else await addDoc(collection(db!, koleksi), payload);
      setF(emptyForm);
      setFile(null);
    } catch (e2) {
      const fe = e2 as { code?: string; message?: string };
      const reason =
        fe.code === "permission-denied"
          ? "Ditolak aturan Firestore — publish ulang firestore.rules DAN pastikan ada dokumen admins/<ID persis email login Anda>."
          : fe.code === "unavailable"
            ? "Koneksi ke Firestore terputus (offline/emulator belum jalan)."
            : `${fe.code ?? "error"}: ${fe.message ?? "gagal menyimpan"}`;
      setErr(`Gagal simpan — ${reason}`);
      console.warn(e2);
    } finally {
      setBusy(false);
    }
  }

  async function hapus(r: Row) {
    if (!confirm(`Hapus ${label} "${(r.d.judul as string) ?? r.id}"?`)) return;
    try {
      await deleteDoc(doc(db!, koleksi, r.id));
    } catch {
      setErr("Gagal hapus — kemungkinan rules Firestore belum di-Publish ulang.");
    }
  }

  const ts = (f.tanggal ? new Date(f.tanggal) : null) as Date | null;

  return (
    <div className="adm-wrap">
      <div className="adm-top">
        <div className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="adm-logo" src="/logo.png" alt="" />
          <h1 className="adm-h1">Admin Program Kerja</h1>
        </div>
        <div className="adm-row">
          <Link className="adm-link" href="/">
            &larr; Lihat situs
          </Link>
          <span className="adm-mail">{email}</span>
          <button className="adm-btn small ghost" onClick={() => signOut(auth!)}>
            Keluar
          </button>
        </div>
      </div>

      <div className="adm-tabs">
        <button
          type="button"
          className={"adm-tab" + (koleksi === "proker" ? " on" : "")}
          onClick={() => ganti("proker")}
        >
          Program Kerja
        </button>
        <button
          type="button"
          className={"adm-tab" + (koleksi === "info" ? " on" : "")}
          onClick={() => ganti("info")}
        >
          Info Terbaru
        </button>
      </div>

      <form onSubmit={submit} className="adm-card">
        <div>
          <h2 className="adm-cardtitle">
            {f.id ? `Edit ${label}` : `Tambah ${label} baru`}
          </h2>
          <p className="adm-cardsubtitle">
            {f.id
              ? "Perbarui lalu klik Update."
              : "Isi judul & deskripsi, pilih status draft utk simpan tanpa tayang."}
          </p>
        </div>
        <div className="adm-grid">
          <label>
            Judul
            <input
              className="adm-in"
              required
              value={f.judul}
              onChange={(e) => set("judul", e.target.value)}
            />
          </label>
          <label>
            Kategori
            <input
              className="adm-in"
              value={f.kategori}
              placeholder="bph / bidang …"
              onChange={(e) => set("kategori", e.target.value)}
            />
          </label>
          <label>
            Status
            <select
              className="adm-in"
              value={f.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option>draft</option>
              <option>aktif</option>
              <option>{koleksi === "proker" ? "rampung" : "arsip"}</option>
            </select>
          </label>
          <label>
            Tanggal
            <input
              className="adm-in"
              type="datetime-local"
              value={f.tanggal}
              onChange={(e) => set("tanggal", e.target.value)}
            />
          </label>
        </div>
        <label>
          Deskripsi
          <textarea
            className="adm-in"
            rows={3}
            value={f.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
          />
        </label>
        <div className="adm-grid">
          <label>
            URL gambar
            <input
              className="adm-in"
              placeholder="https://… atau /images/proker/x.jpg"
              value={file ? "" : f.gambar}
              disabled={!!file}
              onChange={(e) => set("gambar", e.target.value)}
            />
          </label>
          <label>
            atau upload (opsional — nyalain Firebase Storage)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        {file && (
          <p className="adm-note">Akan upload: {file.name}</p>
        )}
        {!file && f.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="adm-prev" src={f.gambar} alt="preview gambar" />
        )}
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-row">
          <button className="adm-btn" disabled={busy}>
            {busy ? "Menyimpan…" : f.id ? "Update" : `Simpan ${label} baru`}
          </button>
          {f.id && (
            <button
              type="button"
              className="adm-btn ghost"
              onClick={() => {
                setF(emptyForm);
                setFile(null);
              }}
            >
              Batal edit
            </button>
          )}
          {ts && <span className="adm-note">tersimpan sbg timestamp</span>}
        </div>
      </form>

      <div className="adm-list">
        {rows.map((r) => {
          const rt = (r.d.tanggal as { toDate?: () => Date } | null)?.toDate?.();
          return (
            <div key={r.id} className="adm-item">
              <div>
                <strong>{(r.d.judul as string) || "(tanpa judul)"}</strong>
                <span
                  className={`adm-badge ${String(r.d.status ?? "draft").toLowerCase()}`}
                >
                  {(r.d.status as string) ?? "-"}
                </span>
                <small>
                  {((r.d.kategori as string) || "") +
                    (rt
                      ? " · " +
                        rt.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "")}
                </small>
              </div>
              <div className="adm-row">
                <button
                  className="adm-btn small ghost"
                  onClick={() => edit(r)}
                >
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
          );
        })}
        {!rows.length && <p className="adm-note">Belum ada proker.</p>}
      </div>
    </div>
  );
}
