// Normalisasi URL gambar biar siap dipakai sebagai <img src>.
// Link share Google Drive (drive.google.com/file/d/.../view) sering diblokir
// Google saat dirender lewat <img> di browser (anti-hotlink/cookie), padahal
// file-nya publik. Solusi andal: CDN gambar resmi Google lh3.googleusercontent.com
// yang memang didesain untuk ditampilkan lintas-situs.
export function imageUrlTampil(u?: string): string {
  if (!u) return "";
  const m = u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1200`;
  const m2 = u.match(/[?&]id=([^&#]+)/);
  if (/drive\.google\.com|drive\.usercontent\.google\.com/.test(u) && m2)
    return `https://lh3.googleusercontent.com/d/${m2[1]}=w1200`;
  return u;
}
