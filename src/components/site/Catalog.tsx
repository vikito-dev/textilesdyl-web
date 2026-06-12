import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";

export function Catalog() {
  const { products } = useStore();
  const categories = useMemo(() => ["Todas", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const collections = useMemo(() => ["Todas", ...Array.from(new Set(products.map((p) => p.collection)))], [products]);
  const [cat, setCat] = useState("Todas");
  const [col, setCol] = useState("Todas");

  const filtered = products.filter(
    (p) => (cat === "Todas" || p.category === cat) && (col === "Todas" || p.collection === col),
  );

  return (
    <section id="catalogo" className="relative max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Colección</div>
          <h2 className="font-display text-5xl mt-2">Nuestro <span className="gold-text">Catálogo</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 md:min-w-[420px]">
          <Filter label="Categoría" value={cat} onChange={setCat} options={categories} />
          <Filter label="Colección" value={col} onChange={setCol} options={collections} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-20">No hay prendas con esos filtros.</div>
      )}
    </section>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="glass rounded-full pl-4 pr-2 py-2 flex items-center gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm py-1"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background">{o}</option>
        ))}
      </select>
    </label>
  );
}
