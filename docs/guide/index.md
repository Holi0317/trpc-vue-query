# Overview

tnq is a binding for [Trpc], [Nuxt] and [tanstack Query].

Just like the official binding for trpc and next, but for nuxt and vue instead.

[trpc]: https://trpc.io/
[nuxt]: https://nuxt.com/
[tanstack query]: https://tanstack.com/query/latest/docs/framework/react/overview

## Support matrix

- trpc: v11
- nuxt: v3
- vue: v3.3
- query: v5

## Vue support

Technically, we don't really have nuxt-specific code in the distributed packages. The
integration is actually targeting vue instead of nuxt. Hydration and serialization is
outsourced to query + nuxt integration instead.
