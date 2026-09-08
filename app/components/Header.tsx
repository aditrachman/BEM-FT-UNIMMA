"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WA_LINK } from "@/lib/konfig";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.classList.toggle("menu-open", next);
  };

  // Jangan sembunyikan navbar selama menu mobile terbuka
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) document.body.classList.remove("nav-hide");
  }, [isOpen]);

  // Sembunyikan saat scroll turun, munculkan saat scroll naik sedikit
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (isOpenRef.current) return;
      if (y > 140 && delta > 6) {
        document.body.classList.add("nav-hide");
      } else if (delta < -6 || y < 140) {
        document.body.classList.remove("nav-hide");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
<header className="header-module-scss-module__N7vucW__wrapper" >
      <div className="header-module-scss-module__N7vucW__inner">
        <div className="header-module-scss-module__N7vucW__logo"><Link href="/"><img src="/logo.png" alt="Logo BEM FT" /><span className="logo-text">BEM FT</span></Link></div>
        <div className="header-module-scss-module__N7vucW__mobile">
          <div className="header-module-scss-module__N7vucW__trigger"><button aria-label="Menu Trigger" onClick={toggleMenu}><span className="header-module-scss-module__N7vucW__hamburger" aria-hidden="true"><span></span><span></span><span></span></span></button></div>
        </div>
        <div className="header-module-scss-module__N7vucW__nav">
          <div className="header-module-scss-module__N7vucW__dropdown">
            <div className="header-module-scss-module__N7vucW__menu">
              <ul>
                <li><a href="#tentang" onClick={toggleMenu}>Tentang</a></li>
                <li><a href="#alasan" onClick={toggleMenu}>Alasan</a></li>
                <li><a href="#proker" onClick={toggleMenu}>Program Kerja</a></li>
                <li><a href="#rekrutmen" onClick={toggleMenu}>Rekrutmen</a></li>
                <li><a href="#aspirasi" onClick={toggleMenu}>Aspirasi</a></li>
              </ul>
            </div>
            <div className="header-module-scss-module__N7vucW__btn">
              <div className="button-module-scss-module__REpPyW__wrapper primary"><a className="primary" href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={toggleMenu}><span><em>Kontak</em><em>Kontak</em></span></a></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
