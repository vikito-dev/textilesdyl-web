import { createFileRoute } from "@tanstack/react-router";
import { StoreProvider } from "@/lib/store";
import { AlertBar } from "@/components/site/AlertBar";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Collections } from "@/components/site/Collections";
import { Catalog } from "@/components/site/Catalog";
import { Story } from "@/components/site/Story";
import { Testimonials } from "@/components/site/Testimonials";
import { Faqs } from "@/components/site/Faqs";
import { Footer } from "@/components/site/Footer";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEXTILES DYL — Tejido artesanal, alma futurista" },
      { name: "description", content: "Prendas tejidas a mano para mujeres que visten poesía. Catálogo premium de chompas, ponchos, vestidos y accesorios." },
      { property: "og:title", content: "TEXTILES DYL" },
      { property: "og:description", content: "Tejido artesanal, alma futurista. Colección premium para mujeres." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <StoreProvider>
      <AlertBar />
      <Header />
      <main>
        <Hero />
        <Collections />
        <Catalog />
        <Story />
        <Testimonials />
        <Faqs />
      </main>
      <Footer />
      <ThemeToggle />
    </StoreProvider>
  );
}
