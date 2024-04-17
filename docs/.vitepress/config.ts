import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "trpc-vue-query",
  description: "trpc and vue-query binding, with @tanstack/vue-query",
  cleanUrls: true,
  lastUpdated: true,
  base: "/trpc-vue-query",

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    search: {
      provider: "local",
    },

    editLink: {
      pattern:
        "https://github.com/Holi0317/trpc-vue-query/edit/main/docs/:path",
    },

    nav: [
      { text: "Guide", link: "/guide/" },
      // { text: "API docs", link: "/api/" },
    ],

    sidebar: [
      { text: "Overview", link: "/guide/" },
      { text: "Setup", link: "/guide/setup" },
      { text: "Nuxt integration", link: "/guide/nuxt" },
      {
        text: "Topics",
        items: [
          { text: "Query key", link: "/topic/query-key" },
          { text: "SSR and suspense", link: "/topic/ssr" },
          { text: "Websocket", link: "/topic/ws" },
        ],
      },
      {
        text: "H3 adapter",
        items: [{ text: "Overview", link: "/h3-adapter/" }],
      },
      // {
      //   text: "API documentation",
      //   items: [{ text: "JSDoc", link: " /api/jsdoc" }],
      // },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Holi0317/trpc-vue-query" },
    ],
  },
});
