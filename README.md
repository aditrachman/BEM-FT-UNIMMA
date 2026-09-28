# 🏛️ Website Resmi BEM FT UNIMMA

Situs profil dan manajemen **Badan Eksekutif Mahasiswa Fakultas Teknik, Universitas Muhammadiyah Magelang**. Dibangun dengan Next.js App Router, dilengkapi panel admin berbasis Firebase untuk mengelola pengurus, absensi, dan aspirasi mahasiswa.

**Live:** [bemft.unimma.ac.id](https://bemft.unimma.ac.id) · **Repo:** [aditrachman/BEM-FT-UNIMMA](https://github.com/aditrachman/BEM-FT-UNIMMA)

---

## ✨ Fitur

- **Landing page** — hero, profil BEM, program kerja, rekrutmen, form aspirasi mahasiswa
- **Tentang Kami** — struktur organisasi (org chart pohon) pengurus periode 2026/2027
- **Absensi online** (`/absen`) — presensi kegiatan kaderisasi dengan rekap otomatis (auto-alpha, grace period) dan riwayat per anggota
- **Panel admin** (`/admin`) — khusus akun terdaftar, 6 tab:
  - Koleksi (proker & info)
  - Anggota
  - Pengurus (+ upload foto via Vercel Blob)
  - Visi & Misi per periode
  - Absensi
  - Aspirasi (review & ubah status masukan mahasiswa)
- **SEO** — sitemap, robots, metadata + JSON-LD
- **Responsive** — desktop, tablet, mobile

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Backend | Firebase — Auth + Firestore |
| Storage | [Vercel Blob](https://vercel.com/storage) (foto pengurus) |
| Deploy | Vercel |

## 📄 Routes

| Route | Tipe | Keterangan |
|---|---|---|
| `/` | Static | Landing page |
| `/tentang-kami` | Static | Profil & org chart pengurus |
| `/absen` | Static | Presensi kegiatan |
| `/admin` | Static | Panel admin (client-side auth) |
| `/api/upload-foto-pengurus` | Dynamic | Upload foto ke Vercel Blob |
| `/sitemap.xml`, `/robots.txt` | Static | SEO |

## 🚀 Getting Started

**Prasyarat:** Node.js 20+ dan npm.

```bash
# 1. Clone
git clone https://github.com/aditrachman/BEM-FT-UNIMMA.git
cd BEM-FT-UNIMMA

# 2. Install dependencies
npm install

# 3. Salin environment variable (lihat tabel di bawah)
cp .env.local.example .env.local   # lalu isi manual

# 4. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Perintah lain

```bash
npm run build   # production build
npm run lint    # ESLint
npx tsc --noEmit # type check
```

## 🔐 Environment Variables

File `.env.local` (tidak di-commit, sudah ada di `.gitignore`):

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ″ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ″ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ″ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ″ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ″ |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob untuk upload foto |

> Ambil nilai Firebase dari **Firebase Console → Project settings → Your apps**. Token Blob dari **Vercel Dashboard → Storage**.

### Akses admin

Login pakai email/password Firebase. Hak admin ditentukan dari dokumen Firestore:

```
admins/<email>   →   role: admin (akun <email>-nya harus ada di koleksi ini)
```

Tanpa dokumen tersebut, akun tetap bisa login tapi dialihkan ke `/absen` sebagai staff.

## 📁 Struktur Folder

```
bem-ft-nextjs/
├── app/                    # App Router (sumber aktif)
│   ├── components/         # Komponen landing page
│   ├── admin/              # Panel admin + sub-panel per tab
│   ├── absen/              # Halaman presensi
│   ├── tentang-kami/       # Halaman org chart
│   └── api/upload-foto-pengurus/
├── lib/                    # Firebase client, konfigurasi, helper absensi
├── public/                 # Aset statis
└── .env.local              # Environment (lokal saja)
```

## 📦 Deploy

Termudah lewat [Vercel](https://vercel.com/new): import repo, tambahkan environment variables di dashboard, deploy. Build otomatis `next build`.

---

Dibuat untuk BEM FT UNIMMA © 2026.
