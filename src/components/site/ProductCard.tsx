import { useState } from "react";
import { type Product } from "@/lib/store";
import { ProductModal } from "./ProductModal";
import { Eye, Sparkles, Flame } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const cover = product.images[0] || "";

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className="group cursor-pointer glass rounded-3xl overflow-hidden hover:-translate-y-1 transition duration-500 hover:shadow-2xl hover:shadow-[color:var(--plum)]/30 relative"
      >
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[color:var(--gold)]/0 group-hover:ring-[color:var(--gold)]/60 transition pointer-events-none z-10" />
        <div className="relative overflow-hidden aspect-[4/5]">
          {cover && (
            <img
              src={cover}
              alt={product.name}
              className="size-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] glass rounded-full px-2 py-1">
              {product.collection}
            </span>
            {product.featured && (
              <span className="text-[10px] uppercase tracking-[0.2em] rounded-full px-2 py-1 bg-[var(--gold)]/90 text-background inline-flex items-center gap-1">
                <Sparkles className="size-3" /> Destacado
              </span>
            )}
            {product.limited && (
              <span className="text-[10px] uppercase tracking-[0.2em] rounded-full px-2 py-1 bg-foreground text-background inline-flex items-center gap-1">
                <Flame className="size-3" /> Limitada
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition duration-500">
            <div className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 bg-foreground text-background text-sm">
              <Eye className="size-4" /> Vista rápida
            </div>
          </div>
        </div>
        <div className="p-5 relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{product.category} · {product.code}</div>
              <h3 className="font-display text-xl mt-1">{product.name}</h3>
            </div>
            <div className="font-display text-xl gold-text">S/ {product.price}</div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          {product.colors.length > 0 && (
            <div className="mt-3 flex gap-1.5">
              {product.colors.slice(0, 5).map((c, i) => (
                <span key={i} title={c.name} className="size-4 rounded-full ring-1 ring-border" style={{ background: c.hex }} />
              ))}
            </div>
          )}
        </div>
      </article>
      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
