/** Cloudflare Worker entry point for the Marco delivery tracker. */
import handler from "vinext/server/app-router-entry";
import { handleImageRequest } from "./image-request.ts";
import type { Env, WorkerExecutionContext } from "./types.ts";

type LogLevel = "info" | "error";

function logRequest(level: LogLevel, payload: Record<string, unknown>): void {
  console[level](JSON.stringify({
    timestamp: new Date().toISOString(),
    service: "marco-tracker",
    ...payload,
  }));
}

function withSecurityHeaders(response: Response, requestId: string): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Request-Id", requestId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function errorResponse(requestId: string): Response {
  return Response.json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "No fue posible procesar la solicitud.",
      requestId,
    },
  }, {
    status: 500,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Request-Id": requestId,
    },
  });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext): Promise<Response> {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();
    const url = new URL(request.url);
    const route = url.pathname === "/_vinext/image" ? "image" : "app";

    try {
      const response = route === "image"
        ? await handleImageRequest(request, env)
        : await handler.fetch(request, env, ctx);
      const securedResponse = withSecurityHeaders(response, requestId);

      logRequest("info", {
        event: "request.completed",
        requestId,
        method: request.method,
        path: url.pathname,
        route,
        status: securedResponse.status,
        durationMs: Date.now() - startedAt,
      });

      return securedResponse;
    } catch (error) {
      logRequest("error", {
        event: "request.failed",
        requestId,
        method: request.method,
        path: url.pathname,
        route,
        status: 500,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : { message: String(error) },
      });

      return errorResponse(requestId);
    }
  },
};

export default worker;
