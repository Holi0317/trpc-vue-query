import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
  type DehydratedState,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";

export default defineNuxtPlugin({
  name: "vue-query",
  setup(nuxt) {
    const vueQueryState = useState<DehydratedState | null>("vue-query");

    // Modify your Vue Query global settings here
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 5000 } },
    });
    const options: VueQueryPluginOptions = { queryClient };

    nuxt.vueApp.use(VueQueryPlugin, options);

    if (import.meta.server) {
      nuxt.hooks.hook("app:rendered", () => {
        const state = dehydrate(queryClient);
        vueQueryState.value = state;
      });
    }

    if (import.meta.client) {
      hydrate(queryClient, vueQueryState.value);
    }
  },
});
