import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  css: ["~/assets/main.css"],

  vite: {
    plugins: [tailwindcss()],
    worker: {
      format: "es",
    },
    optimizeDeps: {
      include: ["monaco-editor"],
    },
  },

  app: {
    head: {
      title: "BS Code",
      meta: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "author", content: "Kenneth Ng" },
        { property: "og:title", content: "BS Code" },
        { property: "og:site_name", content: "BS Code" },
        {
          name: "keywords",
          content:
            "vscode, code, code editor, monaco, playground, js, javascript, script, web, development, developer",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/bscode.svg" }],
    },
  },

  modules: ["@pinia/nuxt"],
});
