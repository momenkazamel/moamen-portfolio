import { Hero } from "@/components/home/hero";
import { Impact } from "@/components/home/impact";
import { FeaturedWork } from "@/components/home/featured-work";
import { KidsUniverse } from "@/components/home/kids-universe";
import { About } from "@/components/home/about";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Impact />
      <FeaturedWork />
      <KidsUniverse />
      <About />
      <Footer />
    </main>
  );
}
