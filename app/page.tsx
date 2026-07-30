import { Hero } from "@/components/home/hero";
import { Impact } from "@/components/home/impact";
import { FeaturedWork } from "@/components/home/featured-work";
import { KidsUniverse } from "@/components/home/kids-universe";
import { About } from "@/components/home/about";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      {/* Navbar renders its own fixed <header> and, on mobile, a fullscreen
          menu overlay — both need to sit outside <main> so the "make the
          rest of the page inert while the menu is open" behavior in
          Navbar doesn't accidentally disable the menu's own controls. */}
      <Navbar />
      <main>
        <Hero />
        <Impact />
        <FeaturedWork />
        <KidsUniverse />
        <About />
        <Footer />
      </main>
    </>
  );
}
