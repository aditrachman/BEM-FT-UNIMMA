# BEM FT UNIMMA - Next.js Project TODO

## Status: Rewrite hampir kelar → lanjut Setup Firebase

---

## 0. Full Rewrite — Clean Code
- [x] **Setup project structure bersih**
  - [x] Buat folder `app/components/`
  - [x] List semua section yang perlu di-rewrite

- [x] **Rewrite JSX → Components** (nama aktual)
  - [x] `Header.tsx` — navbar + hamburger mobile berfungsi (client component, toggle `menu-open`), tombol Kontak full-width dalam dropdown putih
  - [x] `Hero.tsx` — clouds SVG + tagline + h1 + hero image (padding-top desktop 160px)
  - [x] `Tentang.tsx`
  - [x] `Bergerak.tsx`
  - [x] `AlasanHeading.tsx` + `AlasanCards.tsx`
  - [x] `ProkerHeading.tsx` + `ProkerCards.tsx` — **REDESIGN**: kartu ala blog (Tailwind), 3 post, tanpa blok author
  - [x] `RekrutmenHeading.tsx` + `RekrutmenCards.tsx`
  - [x] `CustomerLogos.tsx`
  - [x] `Footer.tsx`

- [x] **Tailwind diaktifkan** — `postcss.config.mjs` + `@import theme/utilities` (tanpa preflight, CSS lama aman)

- [ ] **Rewrite CSS — Clean Class Names** (BELUM — masih `.header-module-scss-module__N7vucW__*` dst)
  - [ ] Ganti semua prefix `*-module-scss-module__*` → nama bersih
  - [ ] `.header-*`, `.hero-*`, `.textblock-*`, `.imagetext-*`, `.heading-*`, `.tagline-*`, `.featurecards-*`, `.customerlogos-*`, `.footer-*`, `.button-*`, `.tapes-*`

- [x] **Convert SVG attributes ke JSX** — fillOpacity, strokeWidth, fillRule, clipPath, xlinkHref ✓

- [ ] **Fix `<script type="application/ld+json">`**
  - [ ] Sisa breadcrumb list masih `dangerouslySetInnerHTML` di `page.tsx` → pindah ke `layout.tsx` / metadata API

- [x] **Handle Customer Logos section**
  - [x] Direstor jadi section "Kami Keluarga Fakultas Teknik UNIMMA" + 3 logo (LogoUNIMMA, Logofakultas, logo.png) dalam kartu putih — CSS lama `customerlogos-*` jadi dead code, aman dihapus nanti
- [x] Favicon situs = logo.png (via `app/icon.png`)

- [ ] **Verify visual identik + final QA**
  - [ ] Cek semua section satu-satu (desktop, tablet, mobile)
  - [ ] Ganti data placeholder proker dengan konten BEM FT asli (judul/deskripsi/gambar Indonesia)

---

## 1. Hero Spacing Fix
- [x] Fix navbar (body class `page-loaded cta-open`)
- [x] Fix icon/image paths (`assets/images/` → `/images/`)
- [x] Adjust hero padding-top (final: 160px desktop, mobile via `--page-top`)

---

## 2. Setup Firebase
- [ ] Buat Firebase project
- [ ] Install Firebase SDK (`firebase` package)
- [ ] Setup Firebase config di project
- [ ] Setup Firestore database
- [ ] Setup Firebase Auth (opsional, buat admin)

---

## 3. CMS untuk Proker Terbaru Kami (via Firebase) ✅ LIVE
- [x] Firebase project `bemft-f4191` + Firestore + config di `.env.local`
- [x] **Firestore Collection: `proker`**
  - [x] Fields: `judul`, `deskripsi`, `gambar` (URL), `tanggal` (timestamp), `kategori` (opsional), `status` (bebas: aktif/rampung/dst — display semua)
  - [ ] Storage: Firebase Storage buat gambar (sementara masih URL eksternal)
- [x] ProkerCards fetch + sort client-side 3 terbaru, fallback ke sample kalau kosong
- [x] **Admin `/admin`** — login Firebase Auth (email/password), CRUD proker, hapus + confirm
- [x] **Strategi gambar = GRATIS, tanpa Firebase Storage** (GCS bisa berbayar, region SG gak masuk free tier):
      - Gambar di-commit ke `public/images/proker/` → ke-host Vercel gratis → isi URL `/images/proker/x.jpg` di admin
      - Atau tempel URL eksternal (media sosial / website fakultas)
      - Tombol upload Storage cuma bonus kalau kapan pun nekat enable (arsip rules: `storage.rules`)
- [ ] Setup console tersisa (semua produk free-tier keras):
      - [ ] Authentication → aktifkan Email/Password → Add user (akun admin)
      - [ ] Firestore → Data → collection `admins` → doc **ID = email login persis** (mis. `aditrachman23@gmail.com`), isinya 1 field dummy `x: true` → tambah pengurus tinggal bikin doc baru
      - [ ] Firestore → Rules → paste `firestore.rules` → **Publish** (wajib, ini yg nolak write)
      - [x] Status `draft` disembunyiin dari landing; `rampung` tetap tampil
- [ ] Nanti kalau pengurus minta self-upload beneran: Cloudinary free tier (unsigned upload, 25GB/bln) — bukan Firebase Storage

---

## 4. Form Aspirasi (via Firebase)
- [ ] **Firestore Collection: `aspirasi`**
  - [ ] Fields: `nama`, `prodi`, `pesan`, `tanggal`, `status`
- [ ] **Modal form di landing page**
  - [ ] 3-4 field sederhana
  - [ ] Submit → simpan ke Firestore
  - [ ] Success/error notification
- [ ] **Admin view (opsional)** — Firebase Console dulu

---

## 5. Sistem Absensi Internal — FASE 1 LIVE ✅ (khusus ~50 anggota)
- [x] Halaman tersembunyi `/absen` (tanpa link di web, robots disallow, login Firebase Auth)
- [x] Self-register: cek dulu email ada di list `anggota` → bikin akun
- [x] Check-in / check-out + deteksi telat otomatis (grace 5 mnt)
- [x] Jadwal rutin 1-klik "Buka sesi hari ini" + sesi manual + buka/tutup/arsip
- [x] Tab admin **Anggota** (CRUD + impor massal CSV-style) & **Absensi** (rekap per sesi, rekap per anggota, 2x Export CSV)
- [x] Rules: 1 record/sesi (doc id `<sesiId>_<email>`), cuma utk dirinya, cuma saat sesi buka & anggota aktif
- [ ] Sisa manual: Publish rules baru + isi list anggota (impor) — lihat chat panduan
- [ ] Fase 2 (opsional, nanti): ijin online, notifikasi WA, GPS/lokasi, dashboard bulanan

---

## 6. Deploy
- [ ] **Frontend:** Vercel
- [ ] **Firebase:** Gratis (Firestore, Auth, Storage)
- [ ] Setup environment variables
- [ ] Test production build

---

## Arsitektur Final
```
Frontend (Next.js + Tailwind)  → Vercel (gratis)
CMS Data                       → Firestore (gratis)
Auth                           → Firebase Auth (gratis)
Storage (gambar)               → Firebase Storage (gratis)
```

---

## Catatan
- Landing page tetap fokus branding & profil BEM
- **Prioritas: beresin sisa Task 0 (ganti nama class CSS + ld+json + QA) → Firebase → CMS Proker → Form Aspirasi → Absensi**
- Task 0 tidak wajib 100% sebelum Firebase — CMS proker bisa langsung numpang ke komponen blog-card yang baru
- Firebase free tier: 1GB Firestore, 5GB Storage, 50K reads/day — cukup
