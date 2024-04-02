# Integration with nuxt

There is no official nuxt integration package. However, vue-query and vue-trpc can be
integrated into nuxt with some simple plugins provided here.

You might need to tweak the plugin to fit your application need.

## 1. Install and setup trpc-vue hooks

Follow [installation](./setup#1-install) and [hook creation](./setup#2-create-hook) from
the setup guide in vue first.

## 2. Create vue-query and vue-trpc plugin

::: code-group

```ts [plugins/vue-query.ts]
// Setup vue-query. Adapted from tanstack-query docs:
// https://tanstack.com/query/latest/docs/framework/vue/guides/ssr

import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query";
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from "@tanstack/vue-query";
// Nuxt 3 app aliases
import { defineNuxtPlugin, useState } from "#imports";

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value);
  }
});
```

```ts [plugins/vue-trpc.ts]
import { TRPCUntypedClient, httpBatchLink } from "@trpc/client";
import { trpc } from "../trpc";

export default defineNuxtPlugin({
  name: "vue-trpc",
  dependsOn: ["vue-query"],
  setup(nuxtApp) {
    nuxt.vueApp.use(trpc, {
      client: new TRPCUntypedClient({
        links: [
          httpBatchLink({
            url: "http://localhost:3000/trpc",
          }),
        ],
      }),
    });
  },
});
```

:::

## Transformer
