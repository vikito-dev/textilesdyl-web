type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      return await handler.fetch(request, env, ctx);
    } catch (error) {
      console.error("SSR Catastrophic Error:", error);
      
      // Respuesta HTML estándar y limpia libre de Lovable
      return new Response(
        "<html><head><title>Internal Server Error</title></head><body style='font-family:sans-serif;padding:2rem;'><h1>500 - Error de Renderizado SSR</h1><p>Ocurrió un problema al procesar la página en el servidor local.</p></body></html>",
        {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }
      );
    }
  },
};