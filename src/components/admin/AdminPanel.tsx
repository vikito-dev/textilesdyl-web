import { useState, useEffect } from "react";
import { useStore, type Product, type ProductColor } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import {
  Plus, Trash2, Save, Image as ImageIcon, Palette, Phone, Package,
  Megaphone, Layout, HelpCircle, MessageSquareQuote, Layers, X, LogOut, Loader2, BookOpen
} from "lucide-react";

type Tab = "products" | "brand" | "contact" | "alert" | "hero" | "faqs" | "testimonials" | "collections" | "story";

// ----------------- FUNCIÓN MÁGICA PARA SUBIR IMÁGENES A SUPABASE -----------------
async function uploadToSupabase(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from('tienda')
    .upload(filePath, file);

  if (error) {
    console.error("Error subiendo imagen:", error);
    alert("Hubo un error al subir la imagen.");
    return null;
  }

  const { data } = supabase.storage.from('tienda').getPublicUrl(filePath);
  return data.publicUrl;
}

// ----------------- COMPONENTE DE LOGIN (MODAL) -----------------
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Credenciales incorrectas: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleLogin} className="glass max-w-sm w-full p-8 rounded-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="size-12 mx-auto rounded-full bg-gradient-to-br from-[var(--plum)] to-[var(--gold)]" />
          <h1 className="font-display text-2xl">Acceso Seguro</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Panel Administrativo</p>
        </div>
        <div className="space-y-4">
          <Input label="Correo electrónico" value={email} onChange={setEmail} type="email" />
          <Input label="Contraseña" value={password} onChange={setPassword} type="password" />
        </div>
        <button disabled={loading} type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 bg-foreground text-background transition hover:bg-[color:var(--gold)]">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Ingresar al panel"}
        </button>
      </form>
    </div>
  );
}

// ----------------- PANEL PRINCIPAL PROTEGIDO -----------------
export function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [tab, setTab] = useState<Tab>("products");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isCheckingAuth) return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-[var(--gold)]" /></div>;
  
  if (!session) return <AdminLogin />;

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-30 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-[var(--plum)] to-[var(--gold)]" />
            <div>
              <div className="font-display text-lg">Panel Admin</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">TEXTILES DYL</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm rounded-full px-4 py-2 glass hover:bg-[color:var(--gold)]/20">Ver tienda</a>
            <button onClick={() => supabase.auth.signOut()} className="size-9 grid place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-2 mb-8 flex-wrap">
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={<Package className="size-4" />}>Productos</TabBtn>
          <TabBtn active={tab === "collections"} onClick={() => setTab("collections")} icon={<Layers className="size-4" />}>Colecciones</TabBtn>
          <TabBtn active={tab === "hero"} onClick={() => setTab("hero")} icon={<Layout className="size-4" />}>Hero</TabBtn>
          <TabBtn active={tab === "story"} onClick={() => setTab("story")} icon={<BookOpen className="size-4" />}>Historia</TabBtn>
          <TabBtn active={tab === "alert"} onClick={() => setTab("alert")} icon={<Megaphone className="size-4" />}>Banner</TabBtn>
          <TabBtn active={tab === "brand"} onClick={() => setTab("brand")} icon={<Palette className="size-4" />}>Marca</TabBtn>
          <TabBtn active={tab === "contact"} onClick={() => setTab("contact")} icon={<Phone className="size-4" />}>Contacto</TabBtn>
          <TabBtn active={tab === "faqs"} onClick={() => setTab("faqs")} icon={<HelpCircle className="size-4" />}>FAQs</TabBtn>
          <TabBtn active={tab === "testimonials"} onClick={() => setTab("testimonials")} icon={<MessageSquareQuote className="size-4" />}>Testimonios</TabBtn>
        </div>

        {tab === "products" && <ProductsTab />}
        {tab === "collections" && <CollectionsTab />}
        {tab === "brand" && <BrandTab />}
        {tab === "contact" && <ContactTab />}
        {tab === "alert" && <AlertTab />}
        {tab === "hero" && <HeroTab />}
        {tab === "story" && <StoryTab />}
        {tab === "faqs" && <FaqsTab />}
        {tab === "testimonials" && <TestimonialsTab />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
        active ? "bg-foreground text-background" : "glass hover:bg-[color:var(--gold)]/20"
      }`}>
      {icon} {children}
    </button>
  );
}

/* ----------------- PRODUCTS ----------------- */
const emptyProduct: Omit<Product, "id"> = {
  name: "", code: "", price: 0, category: "Chompas", collection: "Invierno",
  description: "", images: [], colors: [], featured: false, limited: false,
};

function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [draft, setDraft] = useState<Omit<Product, "id">>(emptyProduct);

  return (
    <div className="space-y-8">
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2"><Plus className="size-5" /> Nuevo producto</h3>
        <ProductForm value={draft} onChange={setDraft} />
        <button
          onClick={() => {
            if (!draft.name || !draft.code) return;
            addProduct(draft);
            setDraft(emptyProduct);
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background hover:bg-[var(--plum)] transition"
        >
          <Plus className="size-4" /> Agregar producto
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-2xl">Catálogo ({products.length})</h3>
        {products.map((p) => (
          <ProductRow key={p.id} product={p} onUpdate={(d) => updateProduct(p.id, d)} onDelete={() => deleteProduct(p.id)} />
        ))}
      </div>
    </div>
  );
}

function ProductRow({ product, onUpdate, onDelete }: { product: Product; onUpdate: (d: Partial<Product>) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [d, setD] = useState<Omit<Product, "id">>(product);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <img src={product.images[0] || ""} alt={product.name} className="size-16 rounded-xl object-cover bg-muted" />
        <div className="flex-1">
          <div className="font-display text-lg flex items-center gap-2">
            {product.name}
            {product.featured && <span className="text-[10px] uppercase rounded-full px-2 py-0.5 bg-[var(--gold)]/30">Destacado</span>}
            {product.limited && <span className="text-[10px] uppercase rounded-full px-2 py-0.5 bg-foreground text-background">Limitada</span>}
          </div>
          <div className="text-xs text-muted-foreground">{product.code} · {product.category} · S/ {product.price} · {product.images.length} foto(s) · {product.colors.length} color(es)</div>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-full px-3 py-1.5 text-sm glass">
          {open ? "Cerrar" : "Editar"}
        </button>
        <button onClick={onDelete} className="size-9 grid place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20">
          <Trash2 className="size-4" />
        </button>
      </div>
      {open && (
        <div className="mt-4 pt-4 border-t border-border/60">
          <ProductForm value={d} onChange={setD} />
          <button
            onClick={() => { onUpdate(d); setOpen(false); }}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background"
          >
            <Save className="size-4" /> Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}

function ProductForm({ value, onChange }: { value: Omit<Product, "id">; onChange: (v: Omit<Product, "id">) => void }) {
  const set = (patch: Partial<Omit<Product, "id">>) => onChange({ ...value, ...patch });
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Input label="Nombre" value={value.name} onChange={(v) => set({ name: v })} />
      <Input label="Código" value={value.code} onChange={(v) => set({ code: v })} />
      <Input label="Categoría" value={value.category} onChange={(v) => set({ category: v })} />
      <Input label="Colección" value={value.collection} onChange={(v) => set({ collection: v })} />
      <Input label="Precio (S/)" type="number" value={String(value.price)} onChange={(v) => set({ price: Number(v) || 0 })} />
      <div className="flex items-end gap-4">
        <Toggle label="Destacado" value={!!value.featured} onChange={(v) => set({ featured: v })} />
        <Toggle label="Edición Limitada" value={!!value.limited} onChange={(v) => set({ limited: v })} />
      </div>
      <div className="md:col-span-2">
        <Input label="Descripción" value={value.description} onChange={(v) => set({ description: v })} textarea />
      </div>
      <div className="md:col-span-2">
        <MultiImageInput label="Imágenes (Nube Supabase)" value={value.images} onChange={(v) => set({ images: v })} />
      </div>
      <div className="md:col-span-2">
        <ColorsEditor value={value.colors} onChange={(v) => set({ colors: v })} />
      </div>
    </div>
  );
}

function ColorsEditor({ value, onChange }: { value: ProductColor[]; onChange: (v: ProductColor[]) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Colores disponibles</span>
        <button
          onClick={() => onChange([...value, { name: "Nuevo", hex: "#cccccc" }])}
          className="inline-flex items-center gap-1 text-xs rounded-full glass px-3 py-1.5"
        >
          <Plus className="size-3.5" /> Agregar color
        </button>
      </div>
      <div className="space-y-2">
        {value.map((c, i) => (
          <div key={i} className="flex items-center gap-2 glass rounded-xl p-2">
            <input type="color" value={c.hex}
              onChange={(e) => onChange(value.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))}
              className="size-9 rounded cursor-pointer bg-transparent" />
            <input value={c.hex}
              onChange={(e) => onChange(value.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))}
              className="w-24 bg-transparent outline-none text-xs" />
            <input value={c.name} placeholder="Nombre"
              onChange={(e) => onChange(value.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
              className="flex-1 bg-transparent outline-none text-sm border-l border-border pl-2" />
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="size-8 grid place-items-center rounded-full hover:bg-destructive/20 text-destructive">
              <X className="size-4" />
            </button>
          </div>
        ))}
        {value.length === 0 && <div className="text-xs text-muted-foreground">Sin colores. Agrega al menos uno.</div>}
      </div>
    </div>
  );
}

/* ----------------- COLLECTIONS ----------------- */
function CollectionsTab() {
  const { collections, addCollection, updateCollection, deleteCollection } = useStore();
  const [d, setD] = useState({ name: "", description: "", image: "" });
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 space-y-3">
        <h3 className="font-display text-2xl">Nueva colección</h3>
        <Input label="Nombre" value={d.name} onChange={(v) => setD({ ...d, name: v })} />
        <Input label="Descripción" value={d.description} onChange={(v) => setD({ ...d, description: v })} />
        <ImageInput label="Imagen de Colección" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
        <button onClick={() => { if (d.name) { addCollection(d); setD({ name: "", description: "", image: "" }); } }}
          className="rounded-full px-5 py-2.5 bg-foreground text-background inline-flex items-center gap-2"><Plus className="size-4" /> Agregar</button>
      </div>
      {collections.map((c) => (
        <EditableRow key={c.id} title={c.name} thumb={c.image} onDelete={() => deleteCollection(c.id)}>
          {(close) => {
            const [e, setE] = useState(c);
            return (
              <div className="space-y-3">
                <Input label="Nombre" value={e.name} onChange={(v) => setE({ ...e, name: v })} />
                <Input label="Descripción" value={e.description} onChange={(v) => setE({ ...e, description: v })} />
                <ImageInput label="Imagen de Colección" value={e.image} onChange={(v) => setE({ ...e, image: v })} />
                <button onClick={() => { updateCollection(c.id, e); close(); }} className="rounded-full px-5 py-2 bg-foreground text-background inline-flex items-center gap-2"><Save className="size-4" /> Guardar</button>
              </div>
            );
          }}
        </EditableRow>
      ))}
    </div>
  );
}

/* ----------------- BRAND ----------------- */
function BrandTab() {
  const { brand, setBrand } = useStore();
  const [d, setD] = useState(brand);
  return (
    <div className="glass rounded-3xl p-6 max-w-2xl">
      <h3 className="font-display text-2xl mb-4">Identidad de marca</h3>
      <div className="space-y-3">
        <Input label="Nombre" value={d.name} onChange={(v) => setD({ ...d, name: v })} />
        <Input label="Eslogan" value={d.tagline} onChange={(v) => setD({ ...d, tagline: v })} />
        <ImageInput label="Logo (Nube o texto)" value={d.logo} onChange={(v) => setD({ ...d, logo: v })} allowText />
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Color banner inicio" value={d.bannerFrom} onChange={(v) => setD({ ...d, bannerFrom: v })} />
          <ColorInput label="Color banner final" value={d.bannerTo} onChange={(v) => setD({ ...d, bannerTo: v })} />
        </div>
        <div className="h-20 rounded-2xl" style={{ background: `linear-gradient(135deg, ${d.bannerFrom}, ${d.bannerTo})` }} />
        <button onClick={() => setBrand(d)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background">
          <Save className="size-4" /> Guardar marca
        </button>
      </div>
    </div>
  );
}

/* ----------------- CONTACT ----------------- */
function ContactTab() {
  const { contact, setContact } = useStore();
  const [d, setD] = useState(contact);
  return (
    <div className="glass rounded-3xl p-6 max-w-2xl">
      <h3 className="font-display text-2xl mb-4">Configuración de contacto</h3>
      <div className="space-y-3">
        <Input label="WhatsApp (solo números, con código país)" value={d.whatsapp} onChange={(v) => setD({ ...d, whatsapp: v.replace(/\D/g, "") })} />
        <Input label="Instagram URL" value={d.instagram} onChange={(v) => setD({ ...d, instagram: v })} />
        <Input label="TikTok URL" value={d.tiktok} onChange={(v) => setD({ ...d, tiktok: v })} />
        <Input label="Facebook URL" value={d.facebook} onChange={(v) => setD({ ...d, facebook: v })} />
        <button onClick={() => setContact(d)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background">
          <Save className="size-4" /> Guardar contacto
        </button>
      </div>
    </div>
  );
}

/* ----------------- ALERT ----------------- */
function AlertTab() {
  const { alert, setAlert } = useStore();
  const [d, setD] = useState(alert);
  return (
    <div className="glass rounded-3xl p-6 max-w-2xl">
      <h3 className="font-display text-2xl mb-4">Banner de alertas superior</h3>
      <div className="space-y-3">
        <Toggle label="Mostrar banner" value={d.enabled} onChange={(v) => setD({ ...d, enabled: v })} />
        <Input label="Texto del banner" value={d.text} onChange={(v) => setD({ ...d, text: v })} />
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Color de fondo" value={d.bg} onChange={(v) => setD({ ...d, bg: v })} />
          <ColorInput label="Color de texto" value={d.fg} onChange={(v) => setD({ ...d, fg: v })} />
        </div>
        <div className="rounded-xl py-2 px-4 text-center text-sm" style={{ background: d.bg, color: d.fg }}>
          {d.text || "Vista previa"}
        </div>
        <button onClick={() => setAlert(d)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background">
          <Save className="size-4" /> Guardar banner
        </button>
      </div>
    </div>
  );
}

/* ----------------- HERO ----------------- */
function HeroTab() {
  const { hero, setHero } = useStore();
  const [d, setD] = useState(hero);
  return (
    <div className="glass rounded-3xl p-6 max-w-2xl">
      <h3 className="font-display text-2xl mb-4">Hero principal</h3>
      <div className="space-y-3">
        <Input label="Título" value={d.title} onChange={(v) => setD({ ...d, title: v })} />
        <Input label="Subtítulo" value={d.subtitle} onChange={(v) => setD({ ...d, subtitle: v })} textarea />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Texto del botón (CTA)" value={d.ctaText} onChange={(v) => setD({ ...d, ctaText: v })} />
          <Input label="Enlace del botón" value={d.ctaLink} onChange={(v) => setD({ ...d, ctaLink: v })} />
        </div>
        <ImageInput label="Imagen del Hero" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
        <button onClick={() => setHero(d)} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background">
          <Save className="size-4" /> Guardar hero
        </button>
      </div>
    </div>
  );
}

/* ----------------- STORY ----------------- */
function StoryTab() {
  const { story, setStory } = useStore();
  const [d, setD] = useState(story);
  
  return (
    <div className="glass rounded-3xl p-6 max-w-2xl">
      <h3 className="font-display text-2xl mb-4">Sección "Nuestra Historia"</h3>
      <div className="space-y-3">
        <Input label="Antetítulo (Eyebrow)" value={d.eyebrow} onChange={(v) => setD({ ...d, eyebrow: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Título (Texto blanco)" value={d.title} onChange={(v) => setD({ ...d, title: v })} />
          <Input label="Título (Texto dorado)" value={d.titleGold} onChange={(v) => setD({ ...d, titleGold: v })} />
        </div>
        <Input label="Párrafo 1" value={d.p1} onChange={(v) => setD({ ...d, p1: v })} textarea />
        <Input label="Párrafo 2" value={d.p2} onChange={(v) => setD({ ...d, p2: v })} textarea />
        <Input label="Etiquetas de botones (separadas por comas)" value={d.tags} onChange={(v) => setD({ ...d, tags: v })} />
        <ImageInput label="Imagen de la sección (Sube a Supabase)" value={d.image} onChange={(v) => setD({ ...d, image: v })} />
        
        <button onClick={() => setStory(d)} className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background hover:bg-[var(--plum)] transition">
          <Save className="size-4" /> Guardar historia
        </button>
      </div>
    </div>
  );
}

/* ----------------- FAQS ----------------- */
function FaqsTab() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useStore();
  const [d, setD] = useState({ q: "", a: "" });
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 space-y-3">
        <h3 className="font-display text-2xl">Nueva pregunta</h3>
        <Input label="Pregunta" value={d.q} onChange={(v) => setD({ ...d, q: v })} />
        <Input label="Respuesta" value={d.a} onChange={(v) => setD({ ...d, a: v })} textarea />
        <button onClick={() => { if (d.q) { addFaq(d); setD({ q: "", a: "" }); } }}
          className="rounded-full px-5 py-2.5 bg-foreground text-background inline-flex items-center gap-2"><Plus className="size-4" /> Agregar</button>
      </div>
      {faqs.map((f) => (
        <EditableRow key={f.id} title={f.q} onDelete={() => deleteFaq(f.id)}>
          {(close) => {
            const [e, setE] = useState(f);
            return (
              <div className="space-y-3">
                <Input label="Pregunta" value={e.q} onChange={(v) => setE({ ...e, q: v })} />
                <Input label="Respuesta" value={e.a} onChange={(v) => setE({ ...e, a: v })} textarea />
                <button onClick={() => { updateFaq(f.id, e); close(); }} className="rounded-full px-5 py-2 bg-foreground text-background inline-flex items-center gap-2"><Save className="size-4" /> Guardar</button>
              </div>
            );
          }}
        </EditableRow>
      ))}
    </div>
  );
}

/* ----------------- TESTIMONIALS ----------------- */
function TestimonialsTab() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore();
  const [d, setD] = useState({ name: "", text: "", rating: 5, avatar: "" });
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 space-y-3">
        <h3 className="font-display text-2xl">Nuevo testimonio</h3>
        <Input label="Nombre" value={d.name} onChange={(v) => setD({ ...d, name: v })} />
        <Input label="Testimonio" value={d.text} onChange={(v) => setD({ ...d, text: v })} textarea />
        <Input label="Estrellas (1-5)" type="number" value={String(d.rating)} onChange={(v) => setD({ ...d, rating: Math.min(5, Math.max(1, Number(v) || 5)) })} />
        <ImageInput label="Avatar (opcional)" value={d.avatar} onChange={(v) => setD({ ...d, avatar: v })} />
        <button onClick={() => { if (d.name) { addTestimonial(d); setD({ name: "", text: "", rating: 5, avatar: "" }); } }}
          className="rounded-full px-5 py-2.5 bg-foreground text-background inline-flex items-center gap-2"><Plus className="size-4" /> Agregar</button>
      </div>
      {testimonials.map((t) => (
        <EditableRow key={t.id} title={`${t.name} · ${t.rating}★`} thumb={t.avatar} onDelete={() => deleteTestimonial(t.id)}>
          {(close) => {
            const [e, setE] = useState(t);
            return (
              <div className="space-y-3">
                <Input label="Nombre" value={e.name} onChange={(v) => setE({ ...e, name: v })} />
                <Input label="Testimonio" value={e.text} onChange={(v) => setE({ ...e, text: v })} textarea />
                <Input label="Estrellas (1-5)" type="number" value={String(e.rating)} onChange={(v) => setE({ ...e, rating: Math.min(5, Math.max(1, Number(v) || 5)) })} />
                <ImageInput label="Avatar" value={e.avatar} onChange={(v) => setE({ ...e, avatar: v })} />
                <button onClick={() => { updateTestimonial(t.id, e); close(); }} className="rounded-full px-5 py-2 bg-foreground text-background inline-flex items-center gap-2"><Save className="size-4" /> Guardar</button>
              </div>
            );
          }}
        </EditableRow>
      ))}
    </div>
  );
}

/* ----------------- SHARED INPUTS ----------------- */
function EditableRow({ title, thumb, children, onDelete }: { title: string; thumb?: string; children: (close: () => void) => React.ReactNode; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-4">
        {thumb ? <img src={thumb} alt="" className="size-12 rounded-xl object-cover bg-muted" /> : <div className="size-12 rounded-xl bg-muted" />}
        <div className="flex-1 font-display text-lg truncate">{title}</div>
        <button onClick={() => setOpen(!open)} className="rounded-full px-3 py-1.5 text-sm glass">{open ? "Cerrar" : "Editar"}</button>
        <button onClick={onDelete} className="size-9 grid place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="size-4" /></button>
      </div>
      {open && <div className="mt-4 pt-4 border-t border-border/60">{children(() => setOpen(false))}</div>}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3}
          className="mt-1 w-full rounded-xl bg-background/60 border border-border px-3 py-2 outline-none focus:border-[var(--gold)]" />
      ) : (
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl bg-background/60 border border-border px-3 py-2 outline-none focus:border-[var(--gold)]" />
      )}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span className="relative inline-block w-10 h-6">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <span className="absolute inset-0 rounded-full bg-muted peer-checked:bg-[var(--plum)] transition" />
        <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition" />
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 rounded-xl bg-background/60 border border-border px-2 py-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-8 rounded cursor-pointer bg-transparent" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
      </div>
    </label>
  );
}

function ImageInput({ label, value, onChange, allowText }: { label: string; value: string; onChange: (v: string) => void; allowText?: boolean }) {
  const [uploading, setUploading] = useState(false);

  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1 flex gap-2 items-stretch">
        <label className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl glass cursor-pointer text-sm py-2 hover:bg-[color:var(--gold)]/20">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />} 
          {uploading ? "Subiendo..." : "Subir a Supabase"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setUploading(true);
            const url = await uploadToSupabase(f);
            if (url) onChange(url);
            setUploading(false);
          }} />
        </label>
        {allowText && (
          <input value={value?.startsWith("http") ? "" : value || ""} onChange={(e) => onChange(e.target.value)} placeholder="o URL externa"
            className="flex-1 rounded-xl bg-background/60 border border-border px-3 py-2 outline-none text-sm focus:border-[var(--gold)]" />
        )}
        {value && (
          <button type="button" onClick={() => onChange("")} className="size-10 grid place-items-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20">
            <X className="size-4" />
          </button>
        )}
      </div>
      {value && value.startsWith("http") && (
        <img src={value} alt="preview" className="mt-2 size-20 rounded-xl object-cover" />
      )}
    </label>
  );
}

function MultiImageInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <label className="inline-flex items-center gap-1 text-xs rounded-full glass px-3 py-1.5 cursor-pointer hover:bg-[color:var(--gold)]/20">
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />} 
          {uploading ? "Subiendo..." : "Subir a Supabase"}
          <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            setUploading(true);
            const urls = await Promise.all(files.map(uploadToSupabase));
            const validUrls = urls.filter((url): url is string => url !== null);
            onChange([...value, ...validUrls]);
            e.target.value = "";
            setUploading(false);
          }} />
        </label>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {value.map((src, i) => (
          <div key={i} className="relative group">
            <img src={src} alt="" className="aspect-square w-full object-cover rounded-xl" />
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 size-6 grid place-items-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length === 0 && <div className="col-span-full text-xs text-muted-foreground py-3">Sin imágenes. Sube archivos a la nube.</div>}
      </div>
    </div>
  );
}