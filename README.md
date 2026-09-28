# Website BEM FT UNIMMA

Website resmi Badan Eksekutif Mahasiswa Fakultas Teknik, Universitas Muhammadiyah Magelang. Isinya profil BEM, program kerja, struktur pengurus, sama sistem absensi kaderisasi yang bisa diakses pengurus lewat halaman admin.

Repo ini dipakai buat deployment di Vercel: <https://github.com/aditrachman/BEM-FT-UNIMMA>

## Isi website

- **Beranda** — hero, sekilas BEM, program kerja, info rekrutmen, form aspirasi buat mahasiswa
- **Tentang Kami** — struktur organisasi pengurus periode 2026/2027, digambar kayak pohon
- **Absensi** (`/absen`) — presensi kegiatan kaderisasi. Ada rekap otomatis: yang gak check-in dianggap alpha setelah lewat grace period 30 menit, plus riwayat presensi tiap anggota
- **Admin** (`/admin`) — panel pengelolaan data, terdiri dari beberapa tab: koleksi (proker & info), anggota, pengurus, visi-misi, absensi, sama aspirasi

Halaman admin dilindungi login Firebase. Email yang belum terdaftar di koleksi `admins` Firestore tetap bisa login, tapi cuma jadi staff dan cuma dikasih akses halaman absensi.

Untuk SEO juga udah disiapin sitemap, robots, sama JSON-LD.

## Teknologi

Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS 4, Firebase Auth + Firestore, dan Vercel Blob buat nyimpen foto pengurus. Deploy-nya di Vercel.

## Menjalankan secara lokal

Butuh Node.js 20 ke atas.

```bash
git clone https://github.com/aditrachman/BEM-FT-UNIMMA.git
cd BEM-FT-UNIMMA
npm install
```

Terus bikin file `.env.local` di root project (ada templatenya di `.env.local.example`, tinggal `cp .env.local.example .env.local`):

| Variabel | Sumber nilainya |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | sama |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | sama |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | sama |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | sama |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | sama |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → Storage |

Kalau Firebase belum dikonfigurasi, halaman admin bakal nampilin pesan buat ngisi `.env.local` dulu, jadi aman.

Habis itu:

```bash
npm run dev
```

Buka <http://localhost:3000>.

## Route

| Path | Keterangan |
|---|---|
| `/` | Beranda |
| `/tentang-kami` | Profil & struktur pengurus |
| `/absen` | Presensi kaderisasi |
| `/admin` | Panel admin |
| `/api/upload-foto-pengurus` | Endpoint upload foto ke Vercel Blob |

## Struktur folder

```
app/                  # App Router — semua route aktif di sini
  components/         # Komponen halaman beranda
  admin/              # Panel admin, satu file per tab
  absen/              # Halaman presensi
  tentang-kami/       # Halaman struktur pengurus
  api/                # Route handler upload
lib/                  # Client Firebase, konfigurasi, helper absensi
public/               # Aset statis (logo, gambar)
```

## Deploy

Impor repo ke Vercel, tambahin semua variabel environment di dashboard, beres — build-nya otomatis `next build`.

## Catatan buat pengembang

- Class CSS lama masih banyak yang namanya aneh (prefix `*-module-scss-module__*`), sisa dari hasil convert. Belum dirapikan.
- Ada beberapa warning ESLint soal `<img>` vs `next/image` — sengaja dibiarkan dulu karena migrasinya nyentuh banyak komponen.
