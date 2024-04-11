import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "tvq",
  description: "A VitePress Site",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    search: {
      provider: "local",
    },

    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "H3 Adapter", link: "/h3-adapter" },
      { text: "API docs", link: "/api/" },
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
        items: [
          { text: "Overview", link: "/h3-adapter/" },
          { text: "Setup with Nuxt", link: "/h3-adapter/nuxt" },
          { text: "Setup with nitro", link: "/h3-adapter/nitro" },
          { text: "Setup with h3", link: "/h3-adapter/h3" },
        ],
      },
      {
        text: "API documentation",
        items: [{ text: "JSDoc", link: " /api/jsdoc" }],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/Holi0317/tvq" }],
  },
});
