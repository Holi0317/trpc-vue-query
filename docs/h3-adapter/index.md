# H3 server adapter

trpc-vue-query project includes a trpc [server adapter] for [h3], the web framework that powers [nitro]
and [nuxt].

For nuxt, a complete example is available at [example-nuxt] directory, including both
client and server integration.

> [!WARNING]  
> [Subscriptions/Websocket] is not supported

> [!WARNING]  
> trpc-vue-query is designed for trpc v11. See [support matrix in overview](../guide/index#support-matrix)
> for details

[example-nuxt]: https://github.com/Holi0317/tvq/tree/main/packages/example-nuxt
[server adapter]: https://trpc.io/docs/server/adapters
[h3]: https://h3.unjs.io/
[nitro]: https://nitro.unjs.io/
[nuxt]: https://nuxt.com/
[Subscriptions/Websocket]: https://trpc.io/docs/subscriptions

## Step 1: Install required packages

Assuming you already got h3/nitro/nuxt setup already.

::: code-group

```bash [npm]
npm i -S @tvq/h3-adapter @trpc/server@next
```

```bash [pnpm]
pnpm add @tvq/h3-adapter @trpc/server@next
```

```bash [yarn]
yarn add @tvq/h3-adapter @trpc/server@next
```

:::

## Step 2: Initialize trpc and create router

Basically following the [backend guide from trpc](https://trpc.io/docs/server/routers).
You might want to place trpc-related code into `server/` in nuxt context.

::: code-group

```ts [trpc/trpc.ts]
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

```ts [trpc/app.ts]
import { publicProcedure, router } from "./trpc";

const appRouter = router({
  greeting: publicProcedure.query(() => "hello tRPC v11!"),
});

export type AppRouter = typeof appRouter;
```

:::

Note that the type `AppRouter` will be available in `trpc/app.ts` for this case. You might
need to adjust that path in your framework.

## Step 3: Install router handler

:::tabs
== h3 (with router)

TRPC will be available on "/trpc" for `httpBatchLink` input.

```ts
import { createApp, createRouter, defineEventHandler } from "h3";
import { h3RequestHandler } from "@tvq/h3-adapter";
import { router } from "./trpc/trpc";

const app = createApp();
const r = createRouter();

r.use(
  "/trpc/:trpc",
  h3RequestHandler({
    router, // <-- This router is trpc's router, not h3 router
  }),
);

app.use(r);
```

To change the route parameter name, pass the name into `h3RequestHandler` as `routeParam`
if you must:

```ts
// This is possible, but not recommended. Stick with `:trpc` for parameter name unless
// there is good reason to change.

r.use(
  "/trpc/:something", // [!code highlight]
  h3RequestHandler({
    router,
    routeParam: "something", // [!code highlight]
  }),
);
```

== h3 (without router)

Not supported yet. You must use a router to use this integration.

== Nitro

TRPC will be available on "/trpc" for `httpBatchLink` input.

```ts [routes/trpc/[trpc].ts]
// File: routes/trpc/[trpc].ts
import { h3RequestHandler } from "@tvq/h3-adapter";
import { router } from "../../trpc/trpc";

export default h3RequestHandler({
  router,
});
```

Note the `[trpc]` part in the filename for the route parameter. The default route
parameter is `trpc`. If you wish to change that, pass the route parameter into
`h3RequestHandler`:

```ts [routes/trpc/[something].ts]
// File: routes/trpc/[something].ts
import { h3RequestHandler } from "@tvq/h3-adapter";
import { router } from "../../trpc/trpc";

export default h3RequestHandler({
  router,
  routeParam: "something", // [!code highlight]
});
```

== Nuxt

TRPC will be available on "/api/trpc" for `httpBatchLink` input.

```ts [server/api/trpc/[trpc].ts]
// File: server/api/trpc/[trpc].ts
import { h3RequestHandler } from "@tvq/h3-adapter";
import { router } from "../../trpc/trpc";

export default h3RequestHandler({
  router,
});
```

Note the `[trpc]` part in the filename for the route parameter. The default route
parameter is `trpc`. If you wish to change that, pass the route parameter into
`h3RequestHandler`:

```ts [server/api/trpc/[something].ts]
// File: server/api/trpc/[something].ts
import { h3RequestHandler } from "@tvq/h3-adapter";
import { router } from "../../trpc/trpc";

export default h3RequestHandler({
  router,
  routeParam: "something", // [!code highlight]
});
```

:::
