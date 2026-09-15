// Konfigurasi kecil yang dipakai beberapa tempat sekaligus.
export const PERIODE_AKTIF = "2026/2027";

// Firestore TIDAK mengizinkan karakter "/" pada ID dokumen.
// ID visi_misi dipakai versi tanpa garis miring; tampilan tetap pakai PERIODE_AKTIF.
export const PERIODE_DOC_ID = PERIODE_AKTIF.replaceAll("/", "-"); // "2026-2027"

export function docIdPeriode(periode: string): string {
  return periode.replaceAll("/", "-");
}

// WhatsApp Humas BEM (kontak resmi untuk kerja sama/pertanyaan)
export const WA_HUMAS = "6285325106798";
export const WA_LINK = `https://wa.me/${WA_HUMAS}?text=${encodeURIComponent(
  "Halo Kak Dika (Humas BEM FT UNIMMA), saya ingin bertanya / berdiskusi mengenai kerja sama dengan BEM FT UNIMMA.",
)}`;

// Absensi internal: toleransi telat (menit setelah jam mulai)
export const ABS_GRACE_MIN = 5;
