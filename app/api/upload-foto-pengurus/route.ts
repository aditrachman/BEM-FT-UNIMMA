import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const MAX_BYTES = 5_000_000; // 5 MB

// Verifikasi ID token Firebase via REST (tanpa admin SDK / service account).
async function verifikasiToken(idToken: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (r.status !== 200) return null;
    const j = await r.json();
    const u = j.users?.[0];
    if (!u) return null;
    // Catatan: tidak wajib emailVerified — akun admin dibuat via Console,
    // status verified-nya bisa false. Izin sebenarnya dicek di cekAdmin()
    // (dokumen admins/<email>), bukan lewat flag verifikasi email.
    return u.email as string;
  } catch {
    return null;
  }
}

// Cek apakah email = admin: Firestore REST pakai token yang sama.
// (butuh rule: match /admins/{email} { allow read: if ... email == doc id })
async function cekAdmin(email: string, idToken: string): Promise<boolean> {
  try {
    const r = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins/${encodeURIComponent(email)}?key=${API_KEY}`,
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    return r.status === 200;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const authz = req.headers.get("authorization");
  const idToken = authz?.replace(/^Bearer\s+/i, "");
  if (!idToken)
    return NextResponse.json({ error: "Tidak ada kredensial." }, { status: 401 });

  const email = await verifikasiToken(idToken);
  if (!email)
    return NextResponse.json({ error: "Token tidak valid." }, { status: 401 });

  const admin = await cekAdmin(email, idToken);
  if (!admin)
    return NextResponse.json(
      { error: "Anda bukan admin terdaftar." },
      { status: 403 },
    );

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN belum tersedia di environment ini." },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "Field 'file' kosong." }, { status: 400 });
  if (!file.type.startsWith("image/"))
    return NextResponse.json({ error: "Hanya file gambar." }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json(
      { error: "Ukuran maksimal 5 MB." },
      { status: 413 },
    );

  const namaAman = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
  const blob = await put(`pengurus/${Date.now()}-${namaAman}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: blob.url });
}
