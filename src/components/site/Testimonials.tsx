import { useStore } from "@/lib/store";
import { Star } from "lucide-react";

export function Testimonials() {
  const { testimonials } = useStore();
  if (!testimonials.length) return null;
  return (
    <section id="testimonios" className="relative max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Nos aman</div>
        <h2 className="font-display text-5xl mt-2">Voces <span className="gold-text">DYL</span></h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="glass rounded-3xl p-6 hover:-translate-y-1 transition duration-500 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 size-32 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-[var(--gold)] to-[var(--plum)]" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-4 ${i < t.rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <p className="text-sm leading-relaxed">"{t.text}"</p>
            <div className="mt-5 flex items-center gap-3">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="size-10 rounded-full object-cover" />
              ) : (
                <div className="size-10 rounded-full grid place-items-center bg-gradient-to-br from-[var(--plum)] to-[var(--gold)] text-white font-display">
                  {t.name[0]}
                </div>
              )}
              <div className="font-display text-lg">{t.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
