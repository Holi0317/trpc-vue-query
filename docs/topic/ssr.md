# SSR and suspense

See [Nuxt guide](../guide/nuxt) for how to setting up SSR in vue-trpc. Other SSR implementation might
work as well, but not tested. Contribution to their setup are welcomed.

## What is `serverPrefetch` option

Vue has a [`serverPrefetch`] composable that will get called in SSR context. This is also
an option when calling `createTRPCVue`. If `true`, `useQuery` will call `.suspense()` inside
`serverPrefetch` and hint SSR engine to fetch the query.

This can also be override on per-`useQuery` bases.

[`serverPrefetch`]: https://vuejs.org/api/options-lifecycle.html#serverprefetch

## Suspense

`useQuery` returns a suspense call from vue-query for using suspense. See [documentation
on vue-query](https://tanstack.com/query/latest/docs/framework/vue/guides/suspense) for details.

## Serializing vue-query state from SSR to client

Integration between vue-query and the SSR framework (nuxt, in most cases) is not in the scope of this project.
However, the glue code is straightforward and included in [the Nuxt guide](../guide/nuxt) in setup.

If the trpc server utilize [data transformer](https://trpc.io/docs/server/data-transformers) returns
types that are not JSON serializable (eg, `Date`, `Set`), the SSR state serialization should handle
those types properly. The query client state will include transformed values for serializer to deal with.

In nuxt case, they will use [devalue](https://github.com/Rich-Harris/devalue) for app state serialization
as [documented here](https://nuxt.com/docs/getting-started/data-fetching#serializing-data-from-server-to-client).
This should handle most cases by default.
