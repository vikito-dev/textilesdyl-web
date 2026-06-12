import { useStore } from "@/lib/store";

export function Story() {
  // Importamos la configuración de la historia desde la nube
  const { story } = useStore();

  // Convertimos el texto "Etiqueta 1, Etiqueta 2" en un array real para los botones
  const tagsList = story.tags 
    ? story.tags.split(",").map(t => t.trim()).filter(Boolean) 
    : ["Sostenible", "Hecho a mano", "Edición limitada"];

  return (
    <section id="historia" className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
      <div className="relative">
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--plum)]/20 to-[var(--gold)]/20 blur-2xl" />
        <img
          // Usamos la imagen de la base de datos, o una por defecto si está vacía
          src={story.image || "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=900&q=80"}
          alt={story.title || "Tejedora trabajando a mano"}
          className="relative rounded-[2rem] aspect-[5/6] object-cover w-full glass p-2"
        />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {story.eyebrow || "Nuestra historia"}
        </div>
        <h2 className="font-display text-5xl mt-2">
          {story.title} <span className="gold-text">{story.titleGold}</span>
        </h2>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          {story.p1}
        </p>
        
        {/* Solo mostramos el segundo párrafo si escribiste algo en él */}
        {story.p2 && (
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {story.p2}
          </p>
        )}
        
        {tagsList.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tagsList.map((t, i) => (
              <div key={i} className="glass rounded-2xl px-4 py-3 text-center text-sm">
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}