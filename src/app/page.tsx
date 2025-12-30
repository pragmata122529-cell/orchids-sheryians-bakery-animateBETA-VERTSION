import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Specialties } from "@/components/Specialties";
import { AboutSection } from "@/components/AboutSection";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { MarqueeSection } from "@/components/MarqueeSection";
import { CursorFollower } from "@/components/CursorFollower";
import { Preloader } from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <CursorFollower />
      <main className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <Hero />
        
        <MarqueeSection 
          items={["Fresh Baked Daily", "100% Natural Ingredients", "Artisan Chocolate", "Homemade Recipes", "Premium Quality"]}
          speed={40}
        />
        
        <AboutSection />
        
        <Specialties />
        
        <MarqueeSection 
          items={["Order Online", "Same Day Delivery", "Custom Cakes", "Gift Boxes", "Catering Services"]}
          speed={30}
          direction="right"
          variant="outline"
        />
        
        <section id="menu" className="py-24 container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-sm uppercase tracking-widest text-primary font-semibold">
              Explore Our Collection
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight">
              Our Sweet <span className="gradient-text italic">Menu</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handcrafted with love and the finest ingredients. Pick your favorite treat and let us make your day a bit sweeter.
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-caramel mx-auto mt-4" />
          </div>
          <ProductGrid />
        </section>
        
        <Reviews />
        <Footer />
      </main>
    </>
  );
}
