"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AspirasiData {
  id: string;
  nama: string;
  prodi: string;
  pesan: string;
  status: string;
  createdAt?: { toDate: () => Date } | null;
}

export function AspirasiPanel() {
  const [items, setItems] = useState<AspirasiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "aspirasi"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AspirasiData)
      );
      setLoading(false);
    });
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    if (!db) return;
    try {
      await updateDoc(doc(db, "aspirasi", id), { status: newStatus });
    } catch {
      alert("Gagal update status");
    }
  }

  async function hapus(id: string) {
    if (!db || !confirm("Hapus aspirasi ini?")) return;
    try {
      await deleteDoc(doc(db, "aspirasi", id));
    } catch {
      alert("Gagal menghapus");
    }
  }

  if (loading) return <p className="adm-note">Memuat aspirasi...</p>;

  return (
    <div className="adm-card">
      <div className="adm-row adm-between">
        <h2 className="adm-cardtitle">Daftar Aspirasi Mahasiswa</h2>
        <p className="adm-cardsubtitle">Semua masukan dan kritik yang masuk via website.</p>
      </div>

      <div className="adm-rekap" style={{ overflowX: "auto" }}>
        <table className="adm-table" style={{ tableLayout: "fixed", width: "100%", minWidth: "600px" }}>
          <colgroup><col style={{ width: "90px" }} /><col style={{ width: "130px" }} /><col /><col style={{ width: "130px" }} /><col style={{ width: "64px" }} /></colgroup>
          <thead>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap", padding: "12px 12px" }}>Waktu</th>
              <th style={{ width: "1%", whiteSpace: "nowrap", padding: "12px 12px" }}>Pengirim</th>
              <th style={{ width: "100%", textAlign: "left", padding: "12px 12px", minWidth: "0" }}>Pesan</th>
              <th style={{ width: "130px", whiteSpace: "nowrap", padding: "12px 12px" }}>Status</th>
              <th style={{ width: "64px", textAlign: "center", padding: "12px 12px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                  Belum ada aspirasi masuk.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id}>
                  <td style={{ width: "1%", whiteSpace: "nowrap", fontSize: "14px", color: "var(--color-grey-3)", padding: "12px 12px" }}>
                    {it.createdAt?.toDate ? it.createdAt.toDate().toLocaleString("id-ID", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", "") : "-"}
                  </td>
                  <td style={{ width: "1%", whiteSpace: "nowrap", padding: "12px 12px" }}>
                    <strong>{it.nama || "Anonim"}</strong>
                    <br />
                    <small style={{ color: "var(--color-grey-3)" }}>{it.prodi || "-"}</small>
                  </td>
                  <td style={{ width: "100%", textAlign: "left", padding: "12px 12px", minWidth: "0" }}>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.5" }}>{it.pesan}</div>
                  </td>
                  <td style={{ width: "130px", whiteSpace: "nowrap", padding: "12px 12px" }}>
                    <select
                      className="adm-in small"
                      value={it.status || "baru"}
                      onChange={(e) => updateStatus(it.id, e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", minWidth: "0", maxWidth: "100%", padding: "8px 28px 8px 12px" }}
                    >
                      <option value="baru">Baru</option>
                      <option value="proses">Diproses</option>
                      <option value="selesai">Selesai</option>
                      <option value="arsip">Arsip</option>
                    </select>
                  </td>
                  <td style={{ width: "64px", textAlign: "center", padding: "12px 12px" }}>
                    <button className="adm-btn small danger" onClick={() => hapus(it.id)} style={{ padding: "4px 10px" }}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
