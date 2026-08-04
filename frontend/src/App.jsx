import ParticleBackground from "./components/ParticleBackground";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Gallery from "./components/Gallery";
import VoteSection from "./components/VoteSection";
import Footer from "./components/Footer";
import { useTheme } from "./hooks/useTheme";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  useReveal([theme]);

  return (
    <>
      <ParticleBackground theme={theme} />
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Gallery />
        <VoteSection />
      </main>
      <Footer />
    </>
  );
}
