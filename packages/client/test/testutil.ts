import { type App, createApp } from "vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { onTestFinished } from "vitest";
import type { CreateTRPCVue } from "../src/types/client";
import type { AnyRouter } from "@trpc/server";
import { TRPCUntypedClient, httpLink } from "@trpc/client";

export function withSetup<TRouter extends AnyRouter, T>(
  client: CreateTRPCVue<TRouter>,
  port: number,
  composable: () => T,
): [T, App<Element>] {
  let result: T;
  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      return () => {};
    },
  });
  app.use(VueQueryPlugin, {
    queryClient: new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
  });
  app.use(client, {
    client: new TRPCUntypedClient({
      links: [
        httpLink({
          url: `http://127.0.0.1:${port}`,
        }),
      ],
    }),
  });

  app.mount(document.createElement("div"));
  onTestFinished(() => {
    app.unmount();
  });

  // return the result and the app instance
  // for testing provide/unmount
  return [result!, app];
}
