import { Timestamp } from "firebase/firestore";
import { ABS_GRACE_MIN } from "./konfig";

export type Sesi = {
  id: string;
  judul: string;
  mulai: Timestamp | null;
  status: "buka" | "tutup";
};

export type AbsenRecord = {
  id: string;
  sesiId: string;
  email: string;
  nama: string;
  status: "hadir" | "telat" | "ijin" | "alpha";
  masukJam: Timestamp | null;
  keluarJam: Timestamp | null;
};

/** hadir kalau check-in <= jam mulai + grace; selain itu telat */
export function statusKehadiran(
  mulai: Timestamp | null,
  sekarang: Date,
): "hadir" | "telat" {
  if (!mulai) return "hadir";
  const batas = mulai.toDate().getTime() + ABS_GRACE_MIN * 60_000;
  return sekarang.getTime() > batas ? "telat" : "hadir";
}

export function fmtJam(t: Timestamp | null | undefined): string {
  if (!t) return "—";
  const d = t.toDate();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")} · ${d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

/** unduh CSV (Excel-friendly: separator koma + BOM UTF-8) */
export function csvUnduh(namaFile: string, baris: (string | number)[][]) {
  const isi = baris
    .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + isi], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = namaFile;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
