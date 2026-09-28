// Konfigurasi kecil yang dipakai beberapa tempat sekaligus.
export const PERIODE_AKTIF = "2026/2027";

// Firestore TIDAK mengizinkan karakter "/" pada ID dokumen.
// ID visi_misi dipakai versi tanpa garis miring; tampilan tetap pakai PERIODE_AKTIF.
export const PERIODE_DOC_ID = PERIODE_AKTIF.replace("/", "-"); // "2026-2027"

export function docIdPeriode(periode: string): string {
  return periode.replaceAll("/", "-");
}

// WhatsApp HUMAS / Sekretariat BEM FT
export const WA_HUMAS = "6287843150898";
export const WA_LINK = `https://wa.me/${WA_HUMAS}?text=${encodeURIComponent(
  "Halo BEM FT UNIMMA, saya [Nama] dari [Instansi/Organisasi]. Saya ingin berdiskusi mengenai kerja sama terkait [Bentuk Kerja Sama]."
)}`;

// Absensi internal: toleransi telat (menit setelah jam mulai)
export const ABS_GRACE_MIN = 30;
