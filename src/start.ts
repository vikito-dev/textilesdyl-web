import { createStart, createMiddleware } from "@tanstack/react-start";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error("Server Error:", error);
    
    // Retornamos una respuesta HTML estándar y limpia de error 500
    return new Response(
      "<html><head><title>Internal Server Error</title></head><body style='font-family:sans-serif;padding:2rem;'><h1>500 - Error Interno del Servidor</h1><p>Ocurrió un problema en el servidor local.</p></body></html>",
      {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }
    );
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));