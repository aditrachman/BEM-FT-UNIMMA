# BEM FT UNIMMA - Next.js Project TODO

## Status: Planning Phase

---

## 0. Full Rewrite — Clean Code (PRIORITAS UTAMA)
- [ ] **Setup project structure bersih**
  - [ ] Buat folder `app/components/`
  - [ ] List semua section yang perlu di-rewrite

- [ ] **Rewrite JSX → Components bersih**
  - [ ] `Header.tsx` — navbar (logo, menu, hamburger, button)
  - [ ] `Hero.tsx` — clouds SVG + tagline + h1 + hero image
  - [ ] `Tentang.tsx` — text block sederhana
  - [ ] `Bergerak.tsx` — image-text reverse
  - [ ] `Alasan.tsx` — tagline + heading "Kenapa Gabung BEM FT"
  - [ ] `FeatureCards.tsx` — reusable card grid (4 cards)
  - [ ] `Proker.tsx` — heading + 3 cards
  - [ ] `Rekrutmen.tsx` — heading + 2 cards
  - [ ] `Footer.tsx` — footer (logo, nav columns, copyright, social)
  - [ ] `Tagline.tsx` — reusable tagline component (icon SVG + text)

- [ ] **Rewrite CSS — Clean Class Names**
  - [ ] Ganti semua `.header-module-scss-module__N7vucW__*` → `.header-*`
  - [ ] Ganti semua `.pagehero-module-scss-module__rMNsHa__*` → `.hero-*`
  - [ ] Ganti semua `.textblock-module-scss-module__3bLjwW__*` → `.textblock-*`
  - [ ] Ganti semua `.imagetextblock-module-scss-module__1jYUnW__*` → `.imagetext-*`
  - [ ] Ganti semua `.heading-module-scss-module__ZBj6zq__*` → `.heading-*`
  - [ ] Ganti semua `.tagline-module-scss-module__R8CpfG__*` → `.tagline-*`
  - [ ] Ganti semua `.featurecards-module-scss-module__x7M58W__*` → `.featurecards-*`
  - [ ] Ganti semua `.customerlogos-module-scss-module__muNAfq__*` → `.customerlogos-*`
  - [ ] Ganti semua `.footer-module-scss-module__Wscpia__*` → `.footer-*`
  - [ ] Ganti semua `.button-module-scss-module__REpPyW__*` → `.button-*`
  - [ ] Ganti semua `.tapes-module-scss-module__Q32jNW__*` → `.tapes-*`

- [ ] **Convert SVG attributes ke JSX**
  - [ ] `fill-opacity` → `fillOpacity`
  - [ ] `stroke-width` → `strokeWidth`
  - [ ] `fill-rule` → `fillRule`
  - [ ] `clip-path` → `clipPath`
  - [ ] `xlink:href` → `xlinkHref`

- [ ] **Fix `<script type="application/ld+json">`**
  - [ ] Pindah ke `layout.tsx` atau pakai `next/script`

- [ ] **Handle Customer Logos section**
  - [ ] `display:none` — pertahankan atau hapus? (belum diputuskan)

- [ ] **Remove `dangerouslySetInnerHTML`**
  - [ ] `page.tsx` harus clean, import semua komponen

- [ ] **Verify visual identik**
  - [ ] Build success
  - [ ] Jalankan dev server
  - [ ] Cek semua section satu-satu
  - [ ] Cek responsive (mobile, tablet, desktop)

---

## 1. Hero Spacing Fix
- [x] Fix navbar (body class `page-loaded cta-open`)
- [x] Fix icon/image paths (`assets/images/` → `/images/`)
- [x] Adjust hero padding-top (currently 60px, still tuning)

---

## 2. Setup Firebase
- [ ] Buat Firebase project
- [ ] Install Firebase SDK (`firebase` package)
- [ ] Setup Firebase config di project
- [ ] Setup Firestore database
- [ ] Setup Firebase Auth (opsional, buat admin)

---

## 3. CMS untuk Proker Terbaru Kami (via Firebase)
- [ ] **Firestore Collection: `proker`**
  - [ ] Fields: `judul`, `deskripsi`, `gambar`, `tanggal`, `status`
  - [ ] Storage: Firebase Storage buat gambar
- [ ] **Fetch data proker dari Firestore**
  - [ ] Frontend fetch real-time atau static generation
  - [ ] Replace hardcoded proker cards dengan dynamic data
- [ ] **Admin Dashboard (opsional)**
  - [ ] Option A: Pakai Firebase Console langsung (gratis, simpel)
  - [ ] Option B: Build custom admin page (Next.js)
- [ ] Deploy & test

---

## 4. Form Aspirasi (via Firebase)
- [ ] **Firestore Collection: `aspirasi`**
  - [ ] Fields: `nama`, `prodi`, `pesan`, `tanggal`, `status`
- [ ] **Modal form di landing page**
  - [ ] 3-4 field sederhana
  - [ ] Submit → simpan ke Firestore
  - [ ] Success/error notification
- [ ] **Admin view (opsional)**
  - [ ] Lihat aspirasi masuk di Firebase Console atau custom page

---

## 5. Sistem Absensi (via Firebase)
- [ ] **Firestore Collections:**
  - [ ] `sessions` — sesi absensi (judul, waktu, status)
  - [ ] `absensi` — record absensi (userId, sessionId, timestamp, status)
- [ ] **Fitur:**
  - [ ] Check-in/check-out
  - [ ] Deteksi telat
  - [ ] Rekap per sesi
- [ ] **Dashboard admin**
  - [ ] Lihat rekap absensi
  - [ ] Export data
- [ ] **Auth mahasiswa** (Firebase Auth)

---

## 6. Deploy
- [ ] **Frontend:** Vercel
- [ ] **Firebase:** Gratis (Firestore, Auth, Storage)
- [ ] Setup environment variables
- [ ] Test production build

---

## Arsitektur Final
```
Frontend (Next.js)  → Vercel (gratis)
CMS Data            → Firestore (gratis)
Auth                → Firebase Auth (gratis)
Storage (gambar)    → Firebase Storage (gratis)
```

Satu platform Firebase buat semua~ ✨

---

## Catatan
- Landing page tetap fokus branding & profil BEM
- Jangan bebani landing page dengan fitur berat
- **Full Rewrite (Task 0) harus selesai dulu sebelum tambah fitur baru**
- Prioritas: Full Rewrite → Setup Firebase → CMS Proker → Form Aspirasi → Absensi
- Firebase free tier: 1GB Firestore, 5GB Storage, 50K reads/day — lebih dari cukup buat BEM FT
