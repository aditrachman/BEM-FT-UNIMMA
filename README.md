<div align="center">
  <img src="public/logo.png" alt="Logo BEM FT UNIMMA" width="110" />
  <h1>BEM FT UNIMMA</h1>
  <p><strong>Website resmi Badan Eksekutif Mahasiswa Fakultas Teknik — Universitas Muhammadiyah Magelang</strong></p>
</div>

---

Landing page + mini-CMS: profil BEM, program kerja yang datanya live dari Firestore, dan form aspirasi mahasiswa. Dibangun dengan arsitektur 100% free-tier (Vercel + Firebase).

## ✨ Fitur

- **Landing page** — Hero, Tentang, Kenapa Gabung, Program Kerja, Rekrutmen, section Keluarga (logo institusi), Footer
- **CMS Program Kerja** — proker terbaru di landing dirender langsung dari Firestore; pengurus cukup isi dokumen via `/admin`
- **Panel Admin `/admin`** — login email/password, CRUD proker real-time (live list via `onSnapshot`), status `draft` tidak tampil ke publik
- **Form Aspirasi** — mahasiswa kirim masukan (boleh anonim); data write-only: pengirim tidak bisa membaca daftar aspirasi orang lain, dan field divalidasi di security rules
- **Responsive & accessible** — mobile menu, focus ring, touch-friendly, no-JS graceful untuk konten utama

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (utilities-only, tanpa preflight) + CSS design system situs |
| Data & Auth | Firebase Firestore + Firebase Authentication |
| Hosting | Vercel (frontend) · Firebase (backend, free tier) |

## 🚀 Menjalankan Lokal

```bash
npm install
# buat file .env.local lalu isi 6 variabel di bawah dengan config project Firebase-mu
# (Console → Project Settings → Your apps → SDK setup and configuration → Config)
npm run dev                        # http://localhost:3000
```

Konfigurasi `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 🔥 Setup Firebase (sekali)

1. Buat project di [console.firebase.google.com](https://console.firebase.google.com) → buat **Web app** → salin config ke `.env.local`
2. Aktifkan **Firestore Database** (region `asia-southeast1`)
3. **Authentication** → aktifkan *Email/Password* → buat akun admin
4. **Firestore → Data** → collection `admins` → **Add document → Choose ID manually** → ID = email login admin (satu dokumen = satu pengurus)
5. **Firestore → Rules** → tempel isi [`firestore.rules`](./firestore.rules) → **Publish**

## 🔐 Model Keamanan

- `proker/*` — publik boleh baca; tulis (create/update/delete) khusus email yang terdaftar di collection `admins`
- `aspirasi/*` — publik hanya boleh `create` dengan payload tervalidasi (pesan 5–1000 char, `status` dipaksa `"baru"`); baca/ubah hanya admin
- `admins/*` — tidak ada rule eksplisit ⇒ default deny; hanya bisa dikelola dari Firebase Console
- Sign-up publik tidak dipakai di aplikasi — akun admin dibuat manual via Console

## 🗂️ Struktur

```
app/
├── admin/page.tsx        # panel CMS proker (login → CRUD)
├── components/           # Header, Hero, Tentang, Bergerak, CustomerLogos,
│                         # Alasan*, Proker*, Rekrutmen*, Aspirasi, Footer
├── globals.css           # design system situs + override Tailwind
├── layout.tsx            # root: font, metadata
└── page.tsx              # landing
lib/firebase.ts           # init Firestore/Auth/Storage dari env (singletons)
firestore.rules           # security rules produksi
```

## 📦 Deploy

1. Import repo ke [Vercel](https://vercel.com) 
2. Tambahkan 6 env var `NEXT_PUBLIC_FIREBASE_*` di Project Settings → Environment Variables
3. Update `metadataBase` di `app/layout.tsx` dengan domain final
4. Deploy ✅

---

<div align="center">
  <sub>Dibuat dengan 🩷 oleh pengurus BEM FT UNIMMA — Muhammad Aditya Rachman</sub>
</div>
