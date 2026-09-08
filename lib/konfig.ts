// Konfigurasi kecil yang dipakai beberapa tempat sekaligus.
export const PERIODE_AKTIF = "2026/2027";

// Firestore TIDAK mengizinkan karakter "/" pada ID dokumen.
// ID visi_misi dipakai versi tanpa garis miring; tampilan tetap pakai PERIODE_AKTIF.
export const PERIODE_DOC_ID = PERIODE_AKTIF.replaceAll("/", "-"); // "2026-2027"

export function docIdPeriode(periode: string): string {
  return periode.replaceAll("/", "-");
}
