import { type App, createApp } from "vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { onTestFinished } from "vitest";

export function withSetup<T>(composable: () => T): [T, App<Element>] {
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

  app.mount(document.createElement("div"));
  onTestFinished(() => {
    app.unmount();
  });

  // return the result and the app instance
  // for testing provide/unmount
  return [result!, app];
}
