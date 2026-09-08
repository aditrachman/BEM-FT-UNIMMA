// Normalisasi URL gambar biar siap dipakai sebagai <img src>.
// Link share Google Drive (drive.google.com/file/d/.../view) tidak bisa
// dirender langsung oleh <img> — harus lewat endpoint uc?export=view.
export function imageUrlTampil(u?: string): string {
  if (!u) return "";
  const m = u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  const m2 = u.match(/[?&]id=([^&#]+)/);
  if (u.includes("drive.google.com") && m2)
    return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
  return u;
}
