"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Post = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  categoryTitle: string;
};

// Data sample — dipakai s/d Firestore diisi proker asli
const samplePosts: Post[] = [
  {
    id: "1",
    title: "Boost your conversion rate",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "Mar 16, 2020",
    categoryTitle: "Marketing",
  },
  {
    id: "2",
    title: "How to use search engine optimization to drive sales",
    description:
      "Optio cum necessitatibus dolor voluptatum provident commodi et. Qui aperiam fugiat nemo cumque.",
    imageUrl:
      "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "Mar 10, 2020",
    categoryTitle: "Sales",
  },
  {
    id: "3",
    title: "Improve your customer experience",
    description:
      "Cupiditate maiores ullam eveniet adipisci in doloribus nulla minus. Voluptas iusto libero adipisci rem et corporis. Nostrud sint anim sunt aliqua.",
    imageUrl:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "Feb 12, 2020",
    categoryTitle: "Business",
  },
];

function formatTanggal(d: Date): string {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProkerCards() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  useEffect(() => {
    if (!db) return;
    // ponytail: collection kecil → ambil semua, sort + filter "draft" client-side.
    // kalau belum ada / semua draft → tetap tampilkan sample biar gak kosong.
    getDocs(collection(db, "proker"))
      .then((snap) => {
        const publik = snap.docs
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
          .map((r) => r.post);
        if (publik.length) setPosts(publik);
      })
      .catch((e) => console.warn("gagal ambil proker dari Firestore:", e));
  }, []);

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
                  src={post.imageUrl}
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
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                    {post.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
