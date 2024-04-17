# Overview

trpc-vue-query is a binding for [Trpc], [Vue] and [tanstack Query].

Just like the [official integration] for trpc and react-query, but for vue instead.

> [!NOTE]  
> The GitHub repository is [Holi0317/trpc-vue-query], and we publish to npm package under
> [`@tvq` namespace](https://www.npmjs.com/search?q=%40tvq).
>
> The npm package [trpc-vue-query] is **NOT** owned by us and is a different (and empty?) package.

[trpc]: https://trpc.io/
[vue]: https://vuejs.org/
[tanstack query]: https://tanstack.com/query/latest/docs/framework/react/overview
[official integration]: https://trpc.io/docs/client/react
[Holi0317/trpc-vue-query]: https://github.com/Holi0317/trpc-vue-query/
[trpc-vue-query]: https://www.npmjs.com/package/trpc-vue-query

## Support matrix

- [trpc]\: v11
  - At the time of writing, this is still the "next" version of trpc.
  - But the version is "stable and can be used in production" from [migration guide](https://trpc.io/docs/migrate-from-v10-to-v11)
  - Installation command will use `@next` for trpc-related packages. If the npm tag is no
    longer required, modify the command and open an issue.
- [nuxt]\: v3
  - Technically not a hard dependency. We don't ship code depends on nuxt
  - But there is example and testing for [nuxt integration](./nuxt)
- [vue]\: v3.3
  - Vue 2.7 might work, but not tested
- [tanstack query]\: v5
  - Aligning with trpc v11's requirement on query v5

[nuxt]: https://nuxtjs.org/

## Nuxt support

Nuxt requires only some light plugin code to make it work with this package. The setup
guide is available in [nuxt integration](./nuxt) documentation.

We also have a separate [h3-adapter](../h3-adapter/index) package for h3 server adapter,
which powers nuxt server.
