"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ABS_GRACE_MIN } from "@/lib/konfig";
import { fmtJam, csvUnduh, type Sesi, type AbsenRecord } from "@/lib/absen";

type Anggota = { email: string; nama: string };

const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  telat: "Telat",
  ijin: "Ijin",
  alpha: "Alpha",
};

export function AbsensiPanel() {
  const [sesi, setSesi] = useState<Sesi[]>([]);
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [absAll, setAbsAll] = useState<AbsenRecord[]>([]);
  const [pilih, setPilih] = useState("");
  const [errs, setErrs] = useState("");

  const [sJudul, setSJudul] = useState("");
  const [sWaktu, setSWaktu] = useState("");
  useEffect(
    () =>
      onSnapshot(collection(db!, "sesi"), (s) =>
        setSesi(
          s.docs
            .map((x) => ({
              id: x.id,
              judul: (x.data().judul as string) ?? "(tanpa judul)",
              mulai: (x.data().mulai as Sesi["mulai"]) ?? null,
              status: (x.data().status as Sesi["status"]) ?? "buka",
            }))
            .sort((a, b) => (b.mulai?.seconds ?? 0) - (a.mulai?.seconds ?? 0)),
        ),
      ),
    [],
  );
  useEffect(
    () =>
      onSnapshot(collection(db!, "anggota"), (s) =>
        setAnggota(
          s.docs
            .map((x) => ({
              email: x.id,
              nama: (x.data().nama as string) ?? x.id,
            }))
            .sort((a, b) => a.nama.localeCompare(b.nama)),
        ),
      ),
    [],
  );
  useEffect(
    () =>
      onSnapshot(collection(db!, "absensi"), (s) =>
        setAbsAll(
          s.docs.map(
            (x) => ({ id: x.id, ...(x.data() as object) }) as AbsenRecord,
          ),
        ),
      ),
    [],
  );
  const absSesi = useMemo(
    () => absAll.filter((r) => r.sesiId === pilih),
    [absAll, pilih],
  );

  const sesiById = useMemo(
    () => Object.fromEntries(sesi.map((s) => [s.id, s])),
    [sesi],
  );

  function spDariAlpha(n: number): string {
    if (n >= 5) return "SP 3";
    if (n === 4) return "SP 2";
    if (n === 3) return "SP 1";
    return "—";
  }

  const perAnggota = useMemo(() => {
    const map = new Map<
      string,
      { nama: string; hadir: number; telat: number; ijin: number; alpha: number; sp: string }
    >();
    for (const a of anggota)
      map.set(a.email, { nama: a.nama, hadir: 0, telat: 0, ijin: 0, alpha: 0, sp: "—" });

    // hitung dari record eksplisit
    const hadirPerEmail = new Map<string, Set<string>>();
    for (const r of absAll) {
      const baris =
        map.get(r.email) ??
        { nama: r.nama || r.email, hadir: 0, telat: 0, ijin: 0, alpha: 0, sp: "—" };
      if (r.status === "hadir") baris.hadir++;
      else if (r.status === "telat") baris.telat++;
      else if (r.status === "ijin") baris.ijin++;
      else if (r.status === "alpha") baris.alpha++;
      map.set(r.email, baris);
      if (!hadirPerEmail.has(r.email)) hadirPerEmail.set(r.email, new Set());
      hadirPerEmail.get(r.email)!.add(r.sesiId);
    }

    // auto-alpha: sesi tutup tanpa record = alpha
    const tutupIds = sesi.filter((s) => s.status === "tutup").map((s) => s.id);
    for (const [email, baris] of map) {
      const punya = hadirPerEmail.get(email) ?? new Set<string>();
      let auto = 0;
      for (const id of tutupIds) if (!punya.has(id)) auto++;
      baris.alpha += auto;
      baris.sp = spDariAlpha(baris.alpha);
    }

    return [...map.entries()].sort(
      (a, b) =>
        b[1].alpha - a[1].alpha || // SP paling tinggi di atas biar kepantau
        b[1].hadir + b[1].telat - (a[1].hadir + a[1].telat) ||
        a[1].nama.localeCompare(b[1].nama),
    );
  }, [anggota, absAll, sesi]);

  async function tambahSesiManual(e: FormEvent) {
    e.preventDefault();
    if (!sJudul.trim() || !sWaktu) return;
    try {
      await addDoc(collection(db!, "sesi"), {
        judul: sJudul.trim(),
        mulai: Timestamp.fromDate(new Date(sWaktu)),
        status: "buka",
      });
      setSJudul("");
      setSWaktu("");
    } catch {
      setErrs("Gagal tambah sesi.");
    }
  }

  async function toggleSesi(s: Sesi) {
    try {
      await updateDoc(doc(db!, "sesi", s.id), {
        status: s.status === "buka" ? "tutup" : "buka",
      });
    } catch {
      setErrs("Gagal ubah status sesi.");
    }
  }

  async function hapusSesi(s: Sesi) {
    if (
      !confirm(
        `Hapus sesi "${s.judul}"? Data absennya tetap tersimpan di arsip.`,
      )
    )
      return;
    await deleteDoc(doc(db!, "sesi", s.id));
  }

  async function setAbsen(
    sesiId: string,
    a: Anggota,
    status: AbsenRecord["status"],
  ) {
    const id = `${sesiId}_${a.email}`;
    const sudah = absSesi.find((r) => r.id === id);
    try {
      await setDoc(
        doc(db!, "absensi", id),
        {
          sesiId,
          email: a.email,
          nama: a.nama,
          status,
          masukJam: sudah?.masukJam ?? null,
        },
        { merge: true },
      );
    } catch {
      setErrs("Gagal mengubah status absen.");
    }
  }

  function exportSesi() {
    if (!pilih) return setErrs("Pilih dulu sesinya.");
    const s = sesiById[pilih];
    const rows: (string | number)[][] = [["nama", "email", "status", "masuk"]];
    for (const a of anggota) {
      const r = absSesi.find((x) => x.email === a.email);
      rows.push([
        a.nama,
        a.email,
        r ? STATUS_LABEL[r.status] ?? r.status : "BELUM ABSEN",
        r?.masukJam ? fmtJam(r.masukJam) : "—",
      ]);
    }
    csvUnduh(`absen-${(s?.judul ?? "sesi").replace(/\s+/g, "-")}.csv`, rows);
  }

  function exportRekap() {
    const rows: (string | number)[][] = [["nama", "email", "hadir", "telat", "ijin", "alpha", "sp"]];
    for (const [email, x] of perAnggota) {
      rows.push([x.nama, email, x.hadir, x.telat, x.ijin, x.alpha, x.sp]);
    }
    csvUnduh("rekap-kehadiran.csv", rows);
  }

  const absSesiMap = useMemo(
    () => Object.fromEntries(absSesi.map((r) => [r.email, r])),
    [absSesi],
  );

  const sesiBuka = useMemo(() => sesi.filter((s) => s.status === "buka"), [sesi]);
  const sesiTutup = useMemo(() => sesi.filter((s) => s.status === "tutup"), [sesi]);

  return (
    <>
      {/* ---------- DAFTAR SESI AKTIF ---------- */}
      <form onSubmit={tambahSesiManual} className="adm-card">
        <h2 className="adm-cardtitle">Sesi Absen</h2>
        <p className="adm-cardsubtitle">
          Sesi berstatus <b>buka</b> bisa di-check-in anggota dari /absen.
          Toleransi telat ±{ABS_GRACE_MIN} menit. Tutup dulu sesi yang sudah
          kelar supaya rekap terkunci.
        </p>
        <div className="adm-grid">
          <label>
            Judul sesi sekali jalan
            <input
              className="adm-in"
              value={sJudul}
              placeholder="Kerja Bakti"
              onChange={(e) => setSJudul(e.target.value)}
            />
          </label>
          <label>
            Mulai
            <input
              className="adm-in"
              type="datetime-local"
              value={sWaktu}
              onChange={(e) => setSWaktu(e.target.value)}
            />
          </label>
        </div>
        <div className="adm-row">
          <button className="adm-btn" type="submit">
            + Sesi manual
          </button>
        </div>
      </form>

      <div className="adm-list" style={{ marginBottom: 28 }}>
        {sesiBuka.slice(0, 30).map((s) => {
          const aktif = pilih === s.id;
          return (
            <div key={s.id} className={`adm-item${aktif ? " on" : ""}`}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong>{s.judul}</strong>
                  <span className="adm-badge aktif">buka</span>
                  {aktif && <span className="adm-badge" style={{ background: "var(--color-blue-3)", color: "#fff" }}>rekap</span>}
                </div>
                <small>{fmtJam(s.mulai)}</small>
              </div>
              <div className="adm-row adm-item-actions">
                <button className="adm-btn small ghost" onClick={() => toggleSesi(s)}>
                  Tutup
                </button>
                <button
                  className={`adm-btn small ${aktif ? "" : "ghost"}`}
                  onClick={() => setPilih(aktif ? "" : s.id)}
                >
                  {aktif ? "Tutup" : "Rekap"}
                </button>
                <button
                  className="adm-btn small danger"
                  onClick={() => hapusSesi(s)}
                  aria-label="Hapus sesi"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
        {!sesiBuka.length && (
          <div
            style={{
              background: "var(--color-grey-5)",
              border: "1px dashed var(--color-light)",
              borderRadius: 16,
              padding: "20px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--color-blue-1)", fontSize: 14 }}>Belum ada sesi aktif</div>
            <div style={{ fontSize: 12, color: "var(--color-grey-3)", marginTop: 4 }}>Buat sesi baru di atas — riwayat sesi tutup ada di bawah.</div>
          </div>
        )}
      </div>

      {/* ---------- REKAP SATU SESI ---------- */}
      {pilih && (
        <div className="adm-card">
          <div className="adm-row adm-between">
            <h2 className="adm-cardtitle">
              Rekap — {sesiById[pilih]?.judul ?? "-"}
            </h2>
            <button className="adm-btn small" onClick={exportSesi}>
              Export CSV
            </button>
          </div>
          <div className="adm-rekap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Masuk</th>
                  <th>Ubah</th>
                </tr>
              </thead>
              <tbody>
                {anggota.map((a) => {
                  const r = absSesiMap[a.email];
                  return (
                    <tr key={a.email} className={r ? "" : "belum"}>
                      <td>
                        {a.nama}
                        {r && !r.masukJam ? (
                          <em className="adm-note"> (manual)</em>
                        ) : null}
                      </td>
                      <td>
                        <span
                          className={`adm-badge ${
                            r?.status === "hadir"
                              ? "aktif"
                              : r?.status === "telat"
                                ? "telat"
                                : r
                                  ? "draft"
                                  : ""
                          }`}
                        >
                          {r ? STATUS_LABEL[r.status] ?? r.status : "belum"}
                        </span>
                      </td>
                      <td>{r?.masukJam ? fmtJam(r.masukJam) : "—"}</td>
                      <td>
                        <select
                          className={`adm-in adm-in-sm adm-select--${r?.status ?? "empty"}`}
                          value={r?.status ?? ""}
                          onChange={(e) => {
                            const v = e.target.value as AbsenRecord["status"];
                            if (v) setAbsen(pilih, a, v);
                          }}
                        >
                          <option value="" disabled>
                            Ubah…
                          </option>
                          {Object.entries(STATUS_LABEL).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!anggota.length && (
              <p className="adm-note">Tambahkan anggota dulu di tab Anggota.</p>
            )}
          </div>
        </div>
      )}

      {/* ---------- REKAP PER ANGGOTA ---------- */}
      <div className="adm-card">
        <div className="adm-row adm-between">
          <h2 className="adm-cardtitle">Rekap Kehadiran (semua sesi)</h2>
          <button className="adm-btn small" onClick={exportRekap}>
            Export CSV
          </button>
        </div>
        <p className="adm-cardsubtitle">
          Alpha dihitung otomatis untuk sesi <b>tutup</b> tanpa absen · SP 1 di 3× alpha, SP 2 di 4×, SP 3 di ≥5×
        </p>
        <div className="adm-rekap">
          <table>
            <thead>
              <tr>
                <th>Anggota</th>
                <th>Hadir</th>
                <th>Telat</th>
                <th>Ijin</th>
                <th>Alpha</th>
                <th>SP</th>
              </tr>
            </thead>
            <tbody>
              {perAnggota.map(([email, x]) => (
                <tr key={email} className={x.sp !== "—" ? "row-sp" : ""}>
                  <td>
                    <div>{x.nama}</div>
                    <small
                      style={{
                        color: "var(--color-grey-3)",
                        fontWeight: 400,
                        fontSize: 11,
                      }}
                    >
                      {email}
                    </small>
                  </td>
                  <td>{x.hadir}</td>
                  <td>{x.telat}</td>
                  <td>{x.ijin}</td>
                  <td>
                    <span className={`adm-badge ${x.alpha >= 3 ? "draft" : ""}`} style={x.alpha >= 3 ? { background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" } : undefined}>
                      {x.alpha}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`adm-badge ${x.sp === "—" ? "draft" : x.sp === "SP 1" ? "aktif" : x.sp === "SP 2" ? "telat" : "draft"}`}
                      style={
                        x.sp === "SP 3"
                          ? { background: "#991b1b", color: "#fff" }
                          : x.sp === "SP 2"
                            ? { background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" }
                            : x.sp === "SP 1"
                              ? { background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }
                              : undefined
                      }
                    >
                      {x.sp}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!perAnggota.length && (
            <p className="adm-note">Belum ada anggota.</p>
          )}
        </div>
        {errs && <p className="adm-err">{errs}</p>}
      </div>

      {/* ---------- RIWAYAT RAPAT — SESI DITUTUP ---------- */}
      <div className="adm-card">
        <h2 className="adm-cardtitle">Riwayat Rapat — Sesi Ditutup</h2>
        <p className="adm-cardsubtitle">Arsip sesi yang sudah ditutup. Tetap bisa lihat rekap atau buka lagi jika perlu.</p>
        <div className="adm-list" style={{ marginTop: 16 }}>
          {sesiTutup.slice(0, 50).map((s) => {
            const aktif = pilih === s.id;
            return (
              <div key={s.id} className={`adm-item${aktif ? " on" : ""}`} style={{ opacity: aktif ? 1 : 0.92 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong>{s.judul}</strong>
                    <span className="adm-badge draft">tutup</span>
                    {aktif && <span className="adm-badge" style={{ background: "var(--color-blue-3)", color: "#fff" }}>rekap</span>}
                  </div>
                  <small>{fmtJam(s.mulai)}</small>
                </div>
                <div className="adm-row adm-item-actions">
                  <button className="adm-btn small ghost" onClick={() => toggleSesi(s)}>
                    Buka lagi
                  </button>
                  <button
                    className={`adm-btn small ${aktif ? "" : "ghost"}`}
                    onClick={() => setPilih(aktif ? "" : s.id)}
                  >
                    {aktif ? "Tutup" : "Rekap"}
                  </button>
                  <button
                    className="adm-btn small danger"
                    onClick={() => hapusSesi(s)}
                    aria-label="Hapus sesi"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
          {!sesiTutup.length && <p className="adm-note">Belum ada riwayat — sesi yang ditutup akan muncul di sini.</p>}
        </div>
      </div>
    </>
  );
}
