import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChevronDown } from "lucide-react";

export function Faqs() {
  const { faqs } = useStore();
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  if (!faqs.length) return null;
  return (
    <section id="faqs" className="relative max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Resolvemos</div>
        <h2 className="font-display text-5xl mt-2">Preguntas <span className="gold-text">Frecuentes</span></h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-lg">{f.q}</span>
                <ChevronDown className={`size-5 transition ${isOpen ? "rotate-180 text-[var(--gold)]" : ""}`} />
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
