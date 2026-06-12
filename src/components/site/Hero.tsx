import { useStore } from "@/lib/store";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const { brand, hero } = useStore();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 weave-bg" aria-hidden />
      <div
        className="absolute -top-32 -right-32 size-[480px] rounded-full blur-3xl opacity-40 float-slow"
        style={{ background: `radial-gradient(circle, ${brand.bannerTo}, transparent 70%)` }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-32 size-[520px] rounded-full blur-3xl opacity-40 float-slow"
        style={{ background: `radial-gradient(circle, ${brand.bannerFrom}, transparent 70%)`, animationDelay: "2s" }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
            <Sparkles className="size-3" /> Nueva Colección
          </div>
          <h1 className="mt-6 font-display text-6xl md:text-7xl leading-[0.95]">
            {hero.title.split(",").map((part, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? <span className="gold-text">{part}</span> : <>{part},<br /></>}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={hero.ctaLink}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-foreground text-background hover:scale-[1.02] transition shadow-xl shadow-[color:var(--plum)]/20"
            >
              {hero.ctaText}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
            </a>
            <a href="#historia" className="inline-flex items-center gap-2 rounded-full px-6 py-3 glass hover:bg-[color:var(--gold)]/20 transition">
              Nuestra historia
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm">
            <Stat n="12+" l="Años tejiendo" />
            <div className="h-10 w-px bg-border" />
            <Stat n="100%" l="Hecho a mano" />
            <div className="h-10 w-px bg-border" />
            <Stat n="∞" l="Diseños únicos" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-50"
            style={{ background: `linear-gradient(135deg, ${brand.bannerFrom}, ${brand.bannerTo})` }} />
          <div className="relative glass rounded-[2rem] p-3 float-slow">
            <img
              src={hero.image}
              alt="Modelo luciendo prenda tejida Textiles DYL"
              className="rounded-[1.5rem] aspect-[4/5] object-cover w-full"
            />
            <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-[var(--plum)] to-[var(--gold)]" />
              <div>
                <div className="text-xs text-muted-foreground">Colección</div>
                <div className="font-display text-lg">Hilo de Oro</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl gold-text">{n}</div>
      <div className="text-muted-foreground">{l}</div>
    </div>
  );
}
