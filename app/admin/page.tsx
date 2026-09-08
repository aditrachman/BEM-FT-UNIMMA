"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { KoleksiPanel } from "./KoleksiPanel";
import { AnggotaPanel } from "./AnggotaPanel";
import { AbsensiPanel } from "./AbsensiPanel";
import { PengurusPanel } from "./PengurusPanel";
import { VisiMisiPanel } from "./VisiMisiPanel";

type MenuTab = "proker" | "info" | "pengurus" | "visimisi" | "anggota" | "absensi";

export default function AdminPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [tab, setTab] = useState<MenuTab>("proker");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!auth || !db)
    return (
      <div className="adm-wrap">
        <p className="adm-note">
          Firebase belum dikonfigurasi — isi <code>.env.local</code> lalu
          restart dev server.
        </p>
      </div>
    );
  if (user === undefined) return null;
  if (!user) return <Login />;

  return (
    <div className="adm-wrap">
      <div className="adm-top">
        <div className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="adm-logo" src="/logo.png" alt="" />
          <h1 className="adm-h1">Admin BEM FT</h1>
        </div>
        <div className="adm-row">
          <Link className="adm-link" href="/">
            &larr; Lihat situs
          </Link>
          <span className="adm-mail">{user.email}</span>
          <button
            className="adm-btn small ghost"
            onClick={() => signOut(auth!)}
          >
            Keluar
          </button>
        </div>
      </div>

      <div className="adm-tabs">
        <button
          type="button"
          className={"adm-tab" + (tab === "proker" ? " on" : "")}
          onClick={() => setTab("proker")}
        >
          Program Kerja
        </button>
        <button
          type="button"
          className={"adm-tab" + (tab === "info" ? " on" : "")}
          onClick={() => setTab("info")}
        >
          Info Terbaru
        </button>
        <button
          type="button"
          className={"adm-tab" + (tab === "pengurus" ? " on" : "")}
          onClick={() => setTab("pengurus")}
        >
          Pengurus
        </button>
        <button
          type="button"
          className={"adm-tab" + (tab === "visimisi" ? " on" : "")}
          onClick={() => setTab("visimisi")}
        >
          Visi &amp; Misi
        </button>
        <button
          type="button"
          className={"adm-tab" + (tab === "anggota" ? " on" : "")}
          onClick={() => setTab("anggota")}
        >
          Anggota
        </button>
        <button
          type="button"
          className={"adm-tab" + (tab === "absensi" ? " on" : "")}
          onClick={() => setTab("absensi")}
        >
          Absensi
        </button>
      </div>

      {tab === "proker" || tab === "info" ? (
        <KoleksiPanel key={tab} koleksi={tab} />
      ) : tab === "pengurus" ? (
        <PengurusPanel />
      ) : tab === "anggota" ? (
        <AnggotaPanel />
      ) : tab === "absensi" ? (
        <AbsensiPanel />
      ) : (
        <VisiMisiPanel />
      )}
    </div>
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
            Masuk untuk mengelola konten website BEM FT.
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
