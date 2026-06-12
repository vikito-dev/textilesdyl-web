import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type ProductColor = { name: string; hex: string; image?: string };

export type Product = {
  id: string; name: string; code: string; price: number; category: string;
  collection: string; description: string; images: string[]; colors: ProductColor[];
  featured?: boolean; limited?: boolean;
};

export type Brand = { name: string; tagline: string; logo: string; bannerFrom: string; bannerTo: string; };
export type Contact = { whatsapp: string; instagram: string; tiktok: string; facebook: string; };
export type AlertBar = { enabled: boolean; text: string; bg: string; fg: string };
export type Hero = { title: string; subtitle: string; ctaText: string; ctaLink: string; image: string; };
export type Faq = { id: string; q: string; a: string };
export type Testimonial = { id: string; name: string; text: string; rating: number; avatar: string };
export type Collection = { id: string; name: string; description: string; image: string };

// 🌟 NUEVO: Tipo de dato para la Historia
export type Story = {
  eyebrow: string;
  title: string;
  titleGold: string;
  p1: string;
  p2: string;
  tags: string;
  image: string;
};

type Store = {
  products: Product[]; brand: Brand; contact: Contact; alert: AlertBar; hero: Hero;
  faqs: Faq[]; testimonials: Testimonial[]; collections: Collection[]; 
  story: Story; // <-- Agregado
  theme: "light" | "dark"; ready: boolean;
  
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setBrand: (b: Brand) => void;
  setContact: (c: Contact) => void;
  setAlert: (a: AlertBar) => void;
  setHero: (h: Hero) => void;
  setStory: (s: Story) => void; // <-- Agregado
  addFaq: (f: Omit<Faq, "id">) => void;
  updateFaq: (id: string, f: Partial<Faq>) => void;
  deleteFaq: (id: string) => void;
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  addCollection: (c: Omit<Collection, "id">) => void;
  updateCollection: (id: string, c: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  toggleTheme: () => void;
};

const defaultBrand: Brand = { name: "TEXTILES DYL", tagline: "Cargando...", logo: "DYL", bannerFrom: "#1a0b2e", bannerTo: "#c4a052" };
const defaultContact: Contact = { whatsapp: "", instagram: "", tiktok: "", facebook: "" };
const defaultAlert: AlertBar = { enabled: false, text: "", bg: "#000", fg: "#fff" };
const defaultHero: Hero = { title: "Cargando...", subtitle: "", ctaText: "Entrar", ctaLink: "/", image: "" };
const defaultStory: Story = { eyebrow: "", title: "", titleGold: "", p1: "", p2: "", tags: "", image: "" };

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [brand, setBrandState] = useState<Brand>(defaultBrand);
  const [contact, setContactState] = useState<Contact>(defaultContact);
  const [alert, setAlertState] = useState<AlertBar>(defaultAlert);
  const [hero, setHeroState] = useState<Hero>(defaultHero);
  const [story, setStoryState] = useState<Story>(defaultStory);
  
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [resProd, resColl, resFaq, resTest, resConf] = await Promise.all([
          supabase.from("products").select("*").order("created_at", { ascending: false }),
          supabase.from("collections").select("*"),
          supabase.from("faqs").select("*"),
          supabase.from("testimonials").select("*"),
          supabase.from("store_config").select("*")
        ]);

        if (resProd.data) setProducts(resProd.data as Product[]);
        if (resColl.data) setCollections(resColl.data as Collection[]);
        if (resFaq.data) setFaqs(resFaq.data as Faq[]);
        if (resTest.data) setTestimonials(resTest.data as Testimonial[]);

        if (resConf.data) {
          resConf.data.forEach((row) => {
            if (row.id === "brand") setBrandState(row.data as Brand);
            if (row.id === "contact") setContactState(row.data as Contact);
            if (row.id === "alert") setAlertState(row.data as AlertBar);
            if (row.id === "hero") setHeroState(row.data as Hero);
            if (row.id === "story") setStoryState(row.data as Story);
          });
        }
      } catch (err) {
        console.error("Error cargando base de datos:", err);
      } finally {
        setReady(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("dyl-theme") as "light" | "dark";
      if (savedTheme) setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("dyl-theme", theme);
  }, [theme]);

  const value: Store = {
    products, brand, contact, alert, hero, faqs, testimonials, collections, story, theme, ready,

    addProduct: async (p) => {
      const { data } = await supabase.from("products").insert([p]).select().single();
      if (data) setProducts((x) => [data as Product, ...x]);
    },
    updateProduct: async (id, p) => {
      const { data } = await supabase.from("products").update(p).eq("id", id).select().single();
      if (data) setProducts((x) => x.map((i) => (i.id === id ? (data as Product) : i)));
    },
    deleteProduct: async (id) => {
      await supabase.from("products").delete().eq("id", id);
      setProducts((x) => x.filter((i) => i.id !== id));
    },

    setBrand: async (b) => { await supabase.from("store_config").upsert({ id: "brand", data: b }); setBrandState(b); },
    setContact: async (c) => { await supabase.from("store_config").upsert({ id: "contact", data: c }); setContactState(c); },
    setAlert: async (a) => { await supabase.from("store_config").upsert({ id: "alert", data: a }); setAlertState(a); },
    setHero: async (h) => { await supabase.from("store_config").upsert({ id: "hero", data: h }); setHeroState(h); },
    setStory: async (s) => { await supabase.from("store_config").upsert({ id: "story", data: s }); setStoryState(s); },

    addFaq: async (f) => {
      const { data } = await supabase.from("faqs").insert([f]).select().single();
      if (data) setFaqs((x) => [...x, data as Faq]);
    },
    updateFaq: async (id, f) => {
      const { data } = await supabase.from("faqs").update(f).eq("id", id).select().single();
      if (data) setFaqs((x) => x.map((i) => (i.id === id ? (data as Faq) : i)));
    },
    deleteFaq: async (id) => {
      await supabase.from("faqs").delete().eq("id", id);
      setFaqs((x) => x.filter((i) => i.id !== id));
    },

    addTestimonial: async (t) => {
      const { data } = await supabase.from("testimonials").insert([t]).select().single();
      if (data) setTestimonials((x) => [...x, data as Testimonial]);
    },
    updateTestimonial: async (id, t) => {
      const { data } = await supabase.from("testimonials").update(t).eq("id", id).select().single();
      if (data) setTestimonials((x) => x.map((i) => (i.id === id ? (data as Testimonial) : i)));
    },
    deleteTestimonial: async (id) => {
      await supabase.from("testimonials").delete().eq("id", id);
      setTestimonials((x) => x.filter((i) => i.id !== id));
    },

    addCollection: async (c) => {
      const { data } = await supabase.from("collections").insert([c]).select().single();
      if (data) setCollections((x) => [...x, data as Collection]);
    },
    updateCollection: async (id, c) => {
      const { data } = await supabase.from("collections").update(c).eq("id", id).select().single();
      if (data) setCollections((x) => x.map((i) => (i.id === id ? (data as Collection) : i)));
    },
    deleteCollection: async (id) => {
      await supabase.from("collections").delete().eq("id", id);
      setCollections((x) => x.filter((i) => i.id !== id));
    },

    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function whatsappLink(phone: string, product: Product, colorName?: string) {
  const colorPart = colorName ? ` en el Color: ${colorName}` : "";
  const msg = `Hola Textiles DYL, estoy interesada en el producto *${product.name}* (cód. ${product.code}, S/ ${product.price})${colorPart}. ¿Tienen disponibilidad?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}