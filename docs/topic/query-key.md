# Query key

trpc-vue-query allows customization on the generated query key passed down into vue-query.

This only affects queries. Mutation and subscription have hard-coded query factory.

See also [Effective React Query Keys] and [Leveraging the Query Function Context] blog
posts for how to choose a query key.

[Effective React Query Keys]: https://tkdodo.eu/blog/effective-react-query-keys
[Leveraging the Query Function Context]: https://tkdodo.eu/blog/leveraging-the-query-function-context

## Default query key factory

The default query key factory is defined in [rootHandler](https://github.com/Holi0317/trpc-vue-query/blob/main/packages/client/src/rootHandler.ts#L10-L12),
which is basically passing path and input into vue-query.

## Override query key factory

Provide a query key factory as `queryKeyFactory` when calling `createTRPCVue`. That should
override all query key factories in the created trpc-vue-query hook.

```ts
import { createTRPCVue } from "@tvq/client";
import type { QueryKey } from "@tanstack/query-core";

export const trpc = createTRPCVue<AppRouter>({
  queryKeyFactory(path: string, input: unknown): QueryKey {
    // ---------------- ^ Type annotations here are optional. Just showing them for documentation purpose
    return [path, input];
  },
});
```

Note that the query key will get passed into `@tanstack/vue-query` instead of
`@tanstack/query-core` directly. The input can be reactive or `ref` object. These input
parameter must be kept reactive for reactivity and refetch to work. vue-query will watch
for the value's change and trigger refetch properly.

## Override query key for a query

Query key can also be override in a per-query basis, ignoring the query factory:

```ts
const userQuery = trpc.getUser.useQuery({
  id: "id_bilbo",
  queryKey: ["getUser", { id: ref("id_bilbo") }],
});
```

## Invoking query key factory

The query key factory will be available on the vue-trpc root object, accepting `path` and
`input` parameters.:

```ts
const key = trpc.queryKeyFactory("getUser", {});
```

This method can be used for building invalidation selectors in mutations.
