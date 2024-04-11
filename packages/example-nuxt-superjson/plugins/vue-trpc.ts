import { TRPCUntypedClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export default defineNuxtPlugin({
  name: "vue-trpc",
  dependsOn: ["vue-query"],
  setup(nuxt) {
    // Fetch the request headers on plugin initialization. This will return
    // empty object in client and should always return the same object on SSR
    // (because each SSR invoke is rendering a page/route/HTTP request).
    //
    // If we were to call `useRequestHeaders` on every trpc request, it might fall
    // because the call is not in a nuxt context.
    const headers = useRequestHeaders();

    nuxt.vueApp.use(trpc, {
      client: new TRPCUntypedClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
            headers,
            // Simple fetch polyfill for trpc
            async fetch(input, init) {
              const resp = await $fetch.raw(input.toString(), init as any);

              return {
                ...resp,
                json: () => Promise.resolve(resp._data),
              };
            },
          }),
        ],
      }),
    });
  },
});
