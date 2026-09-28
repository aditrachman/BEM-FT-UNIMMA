import HashScroll from "./components/HashScroll";
import { LazyProkerCards } from "./components/LazySections";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Tentang from "./components/Tentang";
import Bergerak from "./components/Bergerak";
import CustomerLogos from "./components/CustomerLogos";
import AlasanHeading from "./components/AlasanHeading";
import AlasanCards from "./components/AlasanCards";
import InfoTerbaru from "./components/InfoTerbaru";
import ProkerHeading from "./components/ProkerHeading";
import RekrutmenHeading from "./components/RekrutmenHeading";
import RekrutmenCards from "./components/RekrutmenCards";
import Aspirasi from "./components/Aspirasi";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div id="app">
      <HashScroll />
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
              }).replace(/</g, "\\u003c"),
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
          <div className="sec-ph sec-ph-proker">
            <LazyProkerCards />
          </div>
          <RekrutmenHeading />
          <RekrutmenCards />
          <Aspirasi />
        </div>
      </main>
      <Footer />
    </div>
  );
}
