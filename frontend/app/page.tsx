import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section id="home">
        <HeroSection />
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how">
        <HowItWorksSection />
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact">
        <ContactSection />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer/>

    </main>
  );
}
