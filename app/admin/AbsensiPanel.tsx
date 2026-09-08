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

type Jadwal = { id: string; judul: string; jam: string; durasi: number };
type Anggota = { email: string; nama: string };

const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  telat: "Telat",
  ijin: "Ijin",
  alpha: "Alpha",
};

function jamKeTimestamp(jam: string, base = new Date()): Timestamp | null {
  const [h, m] = jam.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return Timestamp.fromDate(d);
}

export function AbsensiPanel() {
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [sesi, setSesi] = useState<Sesi[]>([]);
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [absAll, setAbsAll] = useState<AbsenRecord[]>([]);
  const [pilih, setPilih] = useState("");
  const [errs, setErrs] = useState("");

  const [jJudul, setJJudul] = useState("");
  const [jJam, setJJam] = useState("19:00");
  const [jDurasi, setJDurasi] = useState(120);
  const [sJudul, setSJudul] = useState("");
  const [sWaktu, setSWaktu] = useState("");

  useEffect(
    () =>
      onSnapshot(collection(db!, "jadwal"), (s) =>
        setJadwal(
          s.docs.map((x) => ({
            id: x.id,
            judul: (x.data().judul as string) ?? "",
            jam: (x.data().jam as string) ?? "19:00",
            durasi: Number(x.data().durasi ?? 120),
          })),
        ),
      ),
    [],
  );
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
  const totalSesi = sesi.length;

  const perAnggota = useMemo(() => {
    const map = new Map<
      string,
      { nama: string; hadir: number; telat: number; ijin: number; alpha: number }
    >();
    for (const a of anggota)
      map.set(a.email, { nama: a.nama, hadir: 0, telat: 0, ijin: 0, alpha: 0 });
    for (const r of absAll) {
      const baris =
        map.get(r.email) ??
        { nama: r.nama || r.email, hadir: 0, telat: 0, ijin: 0, alpha: 0 };
      if (r.status === "hadir") baris.hadir++;
      else if (r.status === "telat") baris.telat++;
      else if (r.status === "ijin") baris.ijin++;
      else if (r.status === "alpha") baris.alpha++;
      map.set(r.email, baris);
    }
    return [...map.entries()].sort(
      (a, b) =>
        b[1].hadir +
        b[1].telat -
        (a[1].hadir + a[1].telat) ||
        a[1].nama.localeCompare(b[1].nama),
    );
  }, [anggota, absAll]);

  async function tambahJadwal(e: FormEvent) {
    e.preventDefault();
    if (!jJudul.trim()) return;
    try {
      await addDoc(collection(db!, "jadwal"), {
        judul: jJudul.trim(),
        jam: jJam,
        durasi: Number(jDurasi) || 120,
      });
      setJJudul("");
    } catch {
      setErrs("Gagal tambah jadwal — cek rules.");
    }
  }

  async function bukaSesiJadwal(j: Jadwal) {
    setErrs("");
    const mulai = jamKeTimestamp(j.jam);
    if (!mulai) return setErrs("Format jam jadwal tidak valid.");
    try {
      await addDoc(collection(db!, "sesi"), {
        judul: j.judul,
        jadwalId: j.id,
        durasiMenit: Number(j.durasi) || 120,
        mulai,
        status: "buka",
      });
    } catch {
      setErrs("Gagal membuka sesi.");
    }
  }

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
    const rows: (string | number)[][] = [
      ["nama", "email", "status", "masuk", "keluar"],
    ];
    for (const a of anggota) {
      const r = absSesi.find((x) => x.email === a.email);
      rows.push([
        a.nama,
        a.email,
        r ? STATUS_LABEL[r.status] ?? r.status : "BELUM ABSEN",
        r?.masukJam ? fmtJam(r.masukJam) : "—",
        r?.keluarJam ? fmtJam(r.keluarJam) : "—",
      ]);
    }
    csvUnduh(`absen-${(s?.judul ?? "sesi").replace(/\s+/g, "-")}.csv`, rows);
  }

  function exportRekap() {
    const rows: (string | number)[][] = [
      ["nama", "email", "hadir", "telat", "ijin", "alpha", "persentase"],
    ];
    for (const [email, x] of perAnggota) {
      const pct = totalSesi
        ? Math.round(((x.hadir + x.telat) / totalSesi) * 100)
        : 0;
      rows.push([x.nama, email, x.hadir, x.telat, x.ijin, x.alpha, `${pct}%`]);
    }
    csvUnduh("rekap-kehadiran.csv", rows);
  }

  const absSesiMap = useMemo(
    () => Object.fromEntries(absSesi.map((r) => [r.email, r])),
    [absSesi],
  );

  return (
    <>
      {/* ---------- JADWAL RUTIN ---------- */}
      <form onSubmit={tambahJadwal} className="adm-card">
        <h2 className="adm-cardtitle">Jadwal Rutin</h2>
        <p className="adm-cardsubtitle">
          Sekali isi, tinggal klik “Buka sesi hari ini” tiap minggu — tanpa
          diketik ulang.
        </p>
        <div className="adm-grid3">
          <label>
            Judul
            <input
              className="adm-in"
              required
              placeholder="Rapat Pleno"
              value={jJudul}
              onChange={(e) => setJJudul(e.target.value)}
            />
          </label>
          <label>
            Jam mulai
            <input
              className="adm-in"
              type="time"
              value={jJam}
              onChange={(e) => setJJam(e.target.value)}
            />
          </label>
          <label>
            Durasi (menit)
            <input
              className="adm-in"
              type="number"
              min={15}
              value={jDurasi}
              onChange={(e) => setJDurasi(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="adm-row">
          <button className="adm-btn" type="submit">
            + Jadwal
          </button>
        </div>
      </form>

      <div className="adm-list">
        {jadwal.map((j) => (
          <div key={j.id} className="adm-item">
            <div>
              <strong>{j.judul}</strong>
              <small>
                {j.jam} WIB · {j.durasi} menit
              </small>
            </div>
            <div className="adm-row">
              <button className="adm-btn small" onClick={() => bukaSesiJadwal(j)}>
                Buka sesi hari ini
              </button>
              <button
                className="adm-btn small danger"
                onClick={() => deleteDoc(doc(db!, "jadwal", j.id))}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {!jadwal.length && <p className="adm-note">Belum ada jadwal rutin.</p>}
      </div>

      {/* ---------- DAFTAR SESI ---------- */}
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

      <div className="adm-list">
        {sesi.slice(0, 30).map((s) => (
          <div key={s.id} className="adm-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{s.judul}</strong>{" "}
              {pilih === s.id && <span className="adm-badge aktif">dibuka</span>}
              <small>{fmtJam(s.mulai)}</small>
            </div>
            <div className="adm-row">
              <span
                className={`adm-badge ${s.status === "buka" ? "aktif" : "draft"}`}
              >
                {s.status === "buka" ? "buka" : "tutup"}
              </span>
              <button
                className="adm-btn small ghost"
                onClick={() => toggleSesi(s)}
              >
                {s.status === "buka" ? "Tutup" : "Buka"}
              </button>
              <button
                className="adm-btn small ghost"
                onClick={() => setPilih(pilih === s.id ? "" : s.id)}
              >
                {pilih === s.id ? "Tutup rekap" : "Rekap"}
              </button>
              <button
                className="adm-btn small danger"
                onClick={() => hapusSesi(s)}
              >
                Hapus ✕
              </button>
            </div>
          </div>
        ))}
        {!sesi.length && <p className="adm-note">Belum ada sesi.</p>}
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
                  <th>Keluar</th>
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
                      <td>{r?.keluarJam ? fmtJam(r.keluarJam) : "—"}</td>
                      <td>
                        <select
                          className="adm-in adm-in-sm"
                          value={r?.status ?? ""}
                          onChange={(e) => {
                            const v = e.target.value as AbsenRecord["status"];
                            if (v) setAbsen(pilih, a, v);
                          }}
                        >
                          <option value="" disabled>
                            —
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
          Persentase = (hadir + telat) / total sesi ({totalSesi} sesi)
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
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              {perAnggota.map(([email, x]) => {
                const pct = totalSesi
                  ? Math.round(((x.hadir + x.telat) / totalSesi) * 100)
                  : 0;
                return (
                  <tr key={email}>
                    <td>{x.nama}</td>
                    <td>{x.hadir}</td>
                    <td>{x.telat}</td>
                    <td>{x.ijin}</td>
                    <td>{x.alpha}</td>
                    <td>
                      <span className="adm-prog">
                        <span style={{ width: `${pct}%` }} />
                      </span>{" "}
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!perAnggota.length && (
            <p className="adm-note">Belum ada anggota.</p>
          )}
        </div>
        {errs && <p className="adm-err">{errs}</p>}
      </div>
    </>
  );
}
