"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ABS_GRACE_MIN } from "@/lib/konfig";
import {
  statusKehadiran,
  fmtJam,
  type Sesi,
  type AbsenRecord,
} from "@/lib/absen";

export default function AbsenPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [namaSaya, setNamaSaya] = useState("");
  const [sesi, setSesi] = useState<Sesi[]>([]);
  const [rekaman, setRekaman] = useState<Record<string, AbsenRecord | null>>({});
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [mode, setMode] = useState<"login" | "daftar">("login");
  const [email, setEmail] = useState("");
  const [sand, setSand] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  // profil anggota (nama) utk record absensi
  useEffect(() => {
    const em = user?.email;
    if (!db || !em) return;
    getDoc(doc(db, "anggota", em.toLowerCase()))
      .then((d) => {
        if (d.exists()) setNamaSaya((d.data().nama as string) ?? "");
      })
      .catch(() => undefined);
  }, [user]);

  // sesi yang sedang buka
  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, "sesi"), (s) => {
      const buka = s.docs
        .map((x) => ({
          id: x.id,
          judul: (x.data().judul as string) ?? "(tanpa judul)",
          mulai: (x.data().mulai as Sesi["mulai"]) ?? null,
          status: (x.data().status as Sesi["status"]) ?? "tutup",
        }))
        .filter((x) => x.status === "buka")
        .sort((a, b) => (a.mulai?.seconds ?? 0) - (b.mulai?.seconds ?? 0));
      setSesi(buka);
      // ambil record saya utk tiap sesi (get diperbolehkan rules)
      if (user?.email) {
        const id = user.email.toLowerCase();
        buka.forEach((sx) => {
          getDoc(doc(db!, "absensi", `${sx.id}_${id}`))
            .then((d) =>
              setRekaman((p) => ({
                ...p,
                [sx.id]: d.exists()
                  ? ({ id: d.id, ...(d.data() as object) } as AbsenRecord)
                  : null,
              })),
            )
            .catch(() => undefined);
        });
      }
    });
  }, [user]);

  async function authSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (!db) return setErr("Firebase belum dikonfigurasi.");
    setBusy(true);
    const em = email.trim().toLowerCase();
    try {
      if (mode === "daftar") {
        const cek = await getDoc(doc(db, "anggota", em));
        if (!cek.exists() || cek.data().aktif !== true)
          throw new Error("EMAIL-TIDAK-TERDAFTAR");
        await createUserWithEmailAndPassword(auth!, em, sand);
        setInfo("Berhasil daftar! Silakan check-in di bawah.");
      } else {
        await signInWithEmailAndPassword(auth!, em, sand);
      }
      setSand("");
    } catch (e2) {
      const m = (e2 as { code?: string; message?: string }).code ?? "";
      setErr(
        m === "EMAIL-TIDAK-TERDAFTAR"
          ? "Email kamu belum terdaftar sebagai anggota — hubungi admin."
          : m.includes("already")
            ? "Akun sudah ada — silakan Masuk."
            : m.includes("password") || m.includes("user-not-found")
              ? "Email/password salah."
              : "Gagal — coba lagi atau hubungi admin.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function checkIn(s: Sesi) {
    if (!db || !user) return;
    setErr("");
    try {
      const em = user.email!.toLowerCase();
      const st = statusKehadiran(s.mulai, new Date());
      await setDoc(doc(db, "absensi", `${s.id}_${em}`), {
        sesiId: s.id,
        email: em,
        nama: namaSaya,
        status: st,
        masukJam: serverTimestamp(),
      });
      setRekaman((p) => ({
        ...p,
        [s.id]: {
          id: `${s.id}_${em}`,
          sesiId: s.id,
          email: em,
          nama: namaSaya,
          status: st,
          masukJam: null,
          keluarJam: null,
        },
      }));
    } catch {
      setErr("Check-in gagal — sesi mungkin sudah ditutup.");
    }
  }

  if (!auth || !db)
    return (
      <div className="abs-page">
        <p className="adm-note">Firebase belum dikonfigurasi.</p>
      </div>
    );
  if (user === undefined) return null;

  if (!user) {
    return (
      <div className="abs-page">
        <div className="abs-hero">
          <Link href="/" className="abs-hero-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="BEM FT" />
            <span>BEM FT UNIMMA</span>
          </Link>
          <h1>Absensi Anggota</h1>
          <p>Khusus anggota BEM FT — masuk untuk absen sesi yang sedang buka. Belum punya akun? Daftar sekali, terverifikasi anggota.</p>
        </div>
        <div className="abs-kartu abs-kartu--login">
          <form onSubmit={authSubmit} className="adm-col">
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
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={sand}
                onChange={(e) => setSand(e.target.value)}
              />
            </label>
            {err && <p className="adm-err">{err}</p>}
            {info && <p className="adm-note">{info}</p>}
            <button className="adm-btn full" disabled={busy}>
              {busy ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar (sekali saja)"}
            </button>
            <p className="adm-note" style={{ textAlign: "center", margin: 0 }}>
              {mode === "login" ? (
                <>
                  Pertama kali?{" "}
                  <button
                    type="button"
                    className="abs-link"
                    onClick={() => { setMode("daftar"); setErr(""); }}
                  >
                    Daftar akun
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    className="abs-link"
                    onClick={() => { setMode("login"); setErr(""); }}
                  >
                    Masuk
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="abs-page">
      <div className="abs-hero abs-hero--compact">
        <div className="abs-hero-row">
          <Link className="abs-link" href="/">← Web utama</Link>
          <button className="abs-link" type="button" onClick={() => signOut(auth!)}>
            Keluar
          </button>
        </div>
        <div className="abs-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" />
          <div>
            <h1>Absensi</h1>
            <p>{namaSaya ? `${namaSaya} · ${user.email}` : user.email}</p>
          </div>
        </div>
      </div>

      {err && <p className="adm-err">{err}</p>}

      {sesi.length === 0 ? (
        <div className="abs-kartu abs-kartu--empty">
          <div className="abs-empty-icon">🗓️</div>
          <h3>Tidak ada sesi buka</h3>
          <p>Nantikan pengumuman rapat / proker berikutnya — sesi yang dibuka admin akan muncul di sini.</p>
        </div>
      ) : (
        sesi.map((s) => {
          const r = rekaman[s.id];
          const sudahMasuk = !!r;
          const isTelat = r?.status === "telat";
          return (
            <div key={s.id} className={`abs-kartu abs-sesi-card ${sudahMasuk ? (isTelat ? "is-telat" : "is-hadir") : ""}`}>
              <div className="abs-sesi-head">
                <div className="abs-sesi-title">
                  <span className="abs-sesi-icon" aria-hidden>{sudahMasuk ? (isTelat ? "⏰" : "✓") : "📋"}</span>
                  <h2>{s.judul}</h2>
                </div>
                <span className="abs-badge" data-st={r?.status ?? ""}>
                  {r ? (isTelat ? "Telat" : "Hadir") : "Belum absen"}
                </span>
              </div>
              <p className="abs-meta">
                Mulai {fmtJam(s.mulai)} · toleransi ±{ABS_GRACE_MIN} menit
                {r?.masukJam ? "" : r ? " · baru tersimpan" : ""}
              </p>
              <div className="abs-jam">
                <span>Masuk: <strong>{fmtJam(r?.masukJam ?? undefined)}</strong></span>
              </div>
              {!sudahMasuk ? (
                <button className="adm-btn full abs-cta" onClick={() => checkIn(s)}>
                  <span>Check-in sekarang</span>
                  <span aria-hidden>→</span>
                </button>
              ) : (
                <div className="abs-done">
                  <span className="abs-done-icon">{isTelat ? "⏰" : "✓"}</span>
                  <span>{isTelat ? "Sudah absen — tercatat telat" : "Sudah absen — kehadiran tercatat"}</span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
