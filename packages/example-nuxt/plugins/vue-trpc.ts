import { TRPCUntypedClient, httpBatchLink } from "@trpc/client";
import { trpc } from "../trpc";

export default defineNuxtPlugin({
  name: "vue-trpc",
  dependsOn: ["vue-query"],
  setup(nuxt) {
    nuxt.vueApp.use(trpc, {
      client: new TRPCUntypedClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
            headers: useRequestHeaders,
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
