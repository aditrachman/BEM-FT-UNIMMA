"use client";

import dynamic from "next/dynamic";

// ssr:false — these sections are fetched/controlled on the client, so the
// server only emits the fixed-height placeholder (.sec-ph in globals.css)
// to keep layout shift at zero.
export const LazyInfoList = dynamic(() => import("./InfoTerbaruList"), {
  ssr: false,
  loading: () => <div className="sec-ph-inner" aria-hidden />,
});
export const LazyProkerCards = dynamic(() => import("./ProkerCards"), {
  ssr: false,
  loading: () => <div className="sec-ph-inner" aria-hidden />,
});
export const LazyAspirasiForm = dynamic(() => import("./AspirasiForm"), {
  ssr: false,
  loading: () => <div className="sec-ph-inner" aria-hidden />,
});
