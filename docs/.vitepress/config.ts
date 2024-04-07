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
      { text: "API docs", link: "/api/" },
    ],

    sidebar: {
      "/guide/": [
        { text: "Overview", link: "/guide/" },
        { text: "Setup", link: "/guide/setup" },
        { text: "Nuxt integration", link: "/guide/nuxt" },
      ],
      "/api/": [],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/Holi0317/tvq" }],
  },
});
