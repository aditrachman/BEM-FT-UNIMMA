import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import StructureSection from "@/components/StructureSection";
import StatsSection from "@/components/StatsSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <ProgramsSection />
        <StructureSection />
        <StatsSection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
