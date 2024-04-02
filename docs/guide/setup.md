# Setup vue-query integration with trpc

This is a setup guide for vue-based project. For nuxt-based project, see [the nuxt
guide](./nuxt) instead.

## 1. Install required packages {#1-install}

::: code-group

```bash [npm]
npm install -S @tnq/client @tanstack/vue-query @trpc/client @trpc/server
```

```bash [pnpm]
pnpm install -S @tnq/client @tanstack/vue-query @trpc/client @trpc/server
```

```bash [yarn]
yarn add @tnq/client @tanstack/vue-query @trpc/client @trpc/server
```

:::

## 2. Create trpc-vue hooks {#2-create-hook}

This will provide the interface for calling trpc procedures which we will show later.

::: code-group

```ts [src/trpc.ts]
import { createTRPCVue } from "@tnq/client";
// Tweak the import to point to server router export, similar to how react integration works
import type { AppRouter } from "../server/router";

export const trpc = createTRPCVue<AppRouter>();
```

:::

## 3. Install to vue instance {#3-app-use}

We require a context injection to vue instances. You should already have some call to
`createApp` in somewhere in your codebase. Just add the `.use` call.

Vue-query installation is also required and should be installed before trpc.

::: code-group

```ts [src/main.ts]
import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { TRPCUntypedClient, httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";

const app = createApp(/* ... */);

app.use(VueQueryPlugin);
app.use(trpc, {
  client: new TRPCUntypedClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/trpc",
      }),
    ],
  }),
});
```

:::

> [!NOTE]
> In case of SSR (nuxt) environment, vue-query and vue-trpc should be wrapped in a nuxt
> plugin. See [the nuxt page](./nuxt) for details.

## 4. Fetch data {#4-fetch-data}

You can then use trpc in your components to fetch data.

```vue [src/App.vue]
<script setup lang="ts">
import { trpc } from "./trpc";

const userQuery = trpc.getUser.useQuery({ id: "id_bilbo" });
const userCreator = trpc.createUser.useMutation();
</script>

<template>
  <p>{{ userQuery.data?.name }}</p>
  <button @click="userCreator.mutate({ name: 'Frodo' })">Create Frodo</button>
</template>
```
