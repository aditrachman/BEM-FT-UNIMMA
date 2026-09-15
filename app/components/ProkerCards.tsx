"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { imageUrlTampil } from "@/lib/imageUrl";

type Post = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  categoryTitle: string;
};


function formatTanggal(d: Date): string {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProkerCards() {
// null = masih memuat; [] = memang belum ada proker tayang
const [posts, setPosts] = useState<Post[] | null>(() => (db ? null : []));
const [expanded, setExpanded] = useState<string | null>(null);

useEffect(() => {
  if (!db) return;
  // ponytail: collection kecil → ambil semua, sort + filter "draft" client-side.
  getDocs(collection(db, "proker"))
    .then((snap) => {
      setPosts(
        snap.docs
          .filter((d) => d.data().status !== "draft")
          .map((d) => {
            const x = d.data();
            return {
              ts: x.tanggal?.seconds ?? -1,
              post: {
                id: d.id,
                title: x.judul ?? "",
                description: x.deskripsi ?? "",
                imageUrl: x.gambar ?? "",
                date: x.tanggal?.toDate ? formatTanggal(x.tanggal.toDate()) : "",
                categoryTitle: x.kategori ?? "",
              } as Post,
            };
          })
          .sort((a, b) => b.ts - a.ts)
          .slice(0, 3)
          .map((r) => r.post),
      );
    })
    .catch((e) => {
      console.warn("gagal ambil proker dari Firestore:", e);
      setPosts([]);
    });
}, []);

  if (posts === null) return null; // masih memuat

  if (posts.length === 0)
    return (
      <div className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl px-6">
          <p className="asp-intro" style={{ textAlign: "center", margin: 0 }}>
            Program kerja periode ini sedang disusun. Pantau terus halaman ini dan media sosial kami untuk pembaruan.
          </p>
        </div>
      </div>
    );

  return (
    <div className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between"
            >
              <div className="relative w-full">
                <img
                  alt=""
                  src={imageUrlTampil(post.imageUrl)}
                  className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2"
                />
                <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10" />
              </div>
              <div className="flex max-w-xl grow flex-col justify-between">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  {post.date && (
                    <time className="text-gray-500">{post.date}</time>
                  )}
                  {post.categoryTitle && (
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                      {post.categoryTitle}
                    </span>
                  )}
                </div>
                <div className="group relative grow">
                  <h3 className="mt-3 text-lg/6 font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <div className="mt-5">
                    <p className={`text-sm/6 text-gray-600 ${expanded === post.id ? "" : "line-clamp-3"}`}>
                      {post.description}
                    </p>
                    {post.description.length > 150 && (
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                        className="mt-2 text-sm font-medium text-blue-600 underline hover:text-blue-700"
                      >
                        {expanded === post.id ? "Tutup" : "Baca selengkapnya"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
