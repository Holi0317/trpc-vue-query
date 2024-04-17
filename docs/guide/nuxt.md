# Integration with nuxt

There is no official nuxt integration package. However, vue-query and vue-trpc can be
integrated into nuxt with some simple plugins provided here. You might need to tweak
the plugin to fit your application need.

A full example is available at [example-nuxt] directory.

See also [h3 adapter](../h3-adapter/index) for the server adapter with h3/nitro.

[example-nuxt]: https://github.com/Holi0317/trpc-vue-query/tree/main/packages/example-nuxt

## 1. Install required packages

> [!WARNING]  
> tvq is designed for trpc v11. See [support matrix in overview](./index#support-matrix)
> for details

::: code-group

```bash [npm]
npm install -S @tvq/client @tanstack/vue-query @trpc/client@next @trpc/server@next
```

```bash [pnpm]
pnpm install -S @tvq/client @tanstack/vue-query @trpc/client@next @trpc/server@next
```

```bash [yarn]
yarn add @tvq/client @tanstack/vue-query @trpc/client@next @trpc/server@next
```

:::

## 2. Create trpc-vue-query hooks

This will provide the interface for calling trpc procedures which we will show later.

This file can be placed under `utils/trpc.ts` so it is available via [auto import](https://nuxt.com/docs/guide/concepts/auto-imports).

::: code-group

```ts [utils/trpc.ts]
import { createTRPCVue } from "@tvq/client";
// Tweak the import to point to server router export, similar to how react integration works
import type { AppRouter } from "../server/trpc/routers";

export const trpc = createTRPCVue<AppRouter>({
  // Set serverPrefetch to true for nuxt. This hint nuxt to fetch during SSR
  serverPrefetch: true,
});
```

:::

## 3. Create vue-query and vue-trpc plugin

::: code-group

```ts [plugins/vue-query.ts]
// Setup vue-query. Adapted from tanstack-query docs:
// https://tanstack.com/query/latest/docs/framework/vue/guides/ssr

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
        vueQueryState.value = dehydrate(queryClient);
      });
    }

    if (import.meta.client) {
      hydrate(queryClient, vueQueryState.value);
    }
  },
});
```

```ts [plugins/vue-trpc.ts]
import { TRPCUntypedClient, httpBatchLink } from "@trpc/client";
import { trpc } from "../trpc";

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
```

:::

## 4. Fetch data

You can then use trpc in your components to fetch data. The trpc call should be handled during SSR.

```vue [App.vue]
<script setup lang="ts">
const userQuery = trpc.getUser.useQuery({ id: "id_bilbo" });
const userCreator = trpc.createUser.useMutation();
</script>

<template>
  <p>{{ userQuery.data?.name }}</p>
  <button @click="userCreator.mutate({ name: 'Frodo' })">Create Frodo</button>
</template>
```
