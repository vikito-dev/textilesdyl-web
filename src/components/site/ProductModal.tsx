import { useEffect, useState } from "react";
import { useStore, whatsappLink, type Product } from "@/lib/store";
import { X, ChevronLeft, ChevronRight, Flame, MessageCircle, Sparkles } from "lucide-react";

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { contact } = useStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [fade, setFade] = useState(false);

  const activeColor = product.colors[colorIdx];
  const images = activeColor?.image ? [activeColor.image, ...product.images] : product.images;
  const currentImg = images[imgIdx] || "";

  // FOMO count (deterministic-ish from product id)
  const fomoCount = 3 + (product.id.charCodeAt(0) % 7);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  useEffect(() => {
    setFade(true);
    const t = setTimeout(() => setFade(false), 300);
    return () => clearTimeout(t);
  }, [imgIdx, colorIdx]);

  const link = whatsappLink(contact.whatsapp, product, activeColor?.name);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md grid place-items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass relative rounded-[2rem] w-full max-w-5xl max-h-[92vh] overflow-y-auto grid md:grid-cols-2 gap-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 size-10 grid place-items-center rounded-full glass hover:bg-destructive/20"
        >
          <X className="size-5" />
        </button>

        {/* Gallery */}
        <div className="relative bg-muted/30">
          <div className="relative aspect-[4/5] overflow-hidden">
            {currentImg && (
              <img
                src={currentImg}
                alt={product.name}
                className={`size-full object-cover transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}
              />
            )}
            {product.limited && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full px-3 py-1 bg-foreground text-background text-xs uppercase tracking-[0.2em]">
                <Sparkles className="size-3" /> Edición Limitada
              </div>
            )}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full glass hover:bg-[color:var(--gold)]/30">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full glass hover:bg-[color:var(--gold)]/30">
                <ChevronRight className="size-5" />
              </button>
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative size-16 rounded-xl overflow-hidden border-2 transition ${i === imgIdx ? "border-[var(--gold)]" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="p-6 md:p-8 flex flex-col">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {product.category} · {product.code}
          </div>
          <h2 className="font-display text-4xl mt-2">{product.name}</h2>
          <div className="mt-2 font-display text-3xl gold-text">S/ {product.price}</div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-5 inline-flex items-center gap-2 self-start glass rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="size-3.5 text-[var(--gold)]" />
            Talla Única (Silueta Completa / Adaptable)
          </div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Color: <span className="text-foreground font-medium">{activeColor?.name}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c, i) => {
                  const active = i === colorIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => setColorIdx(i)}
                      aria-label={c.name}
                      className={`relative size-10 rounded-full transition ${active ? "scale-110" : "hover:scale-105"}`}
                      style={{
                        background: c.hex,
                        boxShadow: active
                          ? `0 0 0 2px var(--background), 0 0 0 4px ${c.hex}, 0 0 24px ${c.hex}`
                          : `0 0 0 1px color-mix(in oklab, ${c.hex} 50%, transparent)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs bg-[var(--rose)]/15 text-[var(--rose)] border border-[var(--rose)]/30">
            <Flame className="size-3.5" />
            {product.limited ? "¡Últimas unidades disponibles!" : `🔥 ${fomoCount} personas consultan por esta prenda ahora`}
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-6"
          >
            <span className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 bg-foreground text-background hover:bg-[var(--plum)] transition shadow-xl shadow-[color:var(--plum)]/30">
              <MessageCircle className="size-5" /> Consultar disponibilidad
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
