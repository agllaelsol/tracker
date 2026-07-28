export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

export interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
