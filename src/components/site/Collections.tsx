import { useStore } from "@/lib/store";

export function Collections() {
  const { collections } = useStore();
  if (!collections.length) return null;
  return (
    <section id="colecciones" className="relative max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Curaduría</div>
        <h2 className="font-display text-5xl mt-2">Colecciones <span className="gold-text">Exclusivas</span></h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {collections.map((c) => (
          <a
            key={c.id}
            href="#catalogo"
            className="group relative block rounded-3xl overflow-hidden aspect-[4/5] glass hover:-translate-y-1 transition duration-500"
          >
            <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover group-hover:scale-110 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-display text-3xl">{c.name}</h3>
              <p className="text-sm opacity-90 mt-1">{c.description}</p>
            </div>
            <div className="absolute inset-0 ring-1 ring-inset ring-[color:var(--gold)]/0 group-hover:ring-[color:var(--gold)]/60 transition" />
          </a>
        ))}
      </div>
    </section>
  );
}
