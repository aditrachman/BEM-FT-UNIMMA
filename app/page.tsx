"use client";

import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Tentang from "./components/Tentang";
import Bergerak from "./components/Bergerak";
import CustomerLogos from "./components/CustomerLogos";
import AlasanHeading from "./components/AlasanHeading";
import AlasanCards from "./components/AlasanCards";
import InfoTerbaru from "./components/InfoTerbaru";
import ProkerHeading from "./components/ProkerHeading";
import ProkerCards from "./components/ProkerCards";
import RekrutmenHeading from "./components/RekrutmenHeading";
import RekrutmenCards from "./components/RekrutmenCards";
import Aspirasi from "./components/Aspirasi";
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    // scroll to hash when landing page loads or when hash changes (same-page clicks)
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60);
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash, false);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div id="app">
      <Header />
      <main className="main">
        <div className="page">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Beranda",
                    item: "#",
                  },
                ],
              }),
            }}
          />
          <Hero />
          <Tentang />
          <Bergerak />
          <CustomerLogos />
          <AlasanHeading />
          <AlasanCards />
          <InfoTerbaru />
          <ProkerHeading />
          <ProkerCards />
          <RekrutmenHeading />
          <RekrutmenCards />
          <Aspirasi />
        </div>
      </main>
      <Footer />
    </div>
  );
}
