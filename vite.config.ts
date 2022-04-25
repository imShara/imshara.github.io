import { resolve, dirname, extname } from "path";
import fs from "fs-extra";
import { defineConfig } from "vite";
import matter from "gray-matter";
import vue from "@vitejs/plugin-vue";
import Markdown, { meta } from "vite-plugin-md";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import generateSitemap from "vite-plugin-pages-sitemap";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import { slugify } from "transliteration";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),

      // Improve performance and reduce bundle size with runtime build only
      // https://vue-i18n.intlify.dev/guide/advanced/optimization.html
      "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
    },
  },
  //@ts-ignore
  ssgOptions: {
    includedRoutes(paths, routes) {
      const locales = ["ru", "en", "kz", "ua"];
      // use original route records
      return routes.flatMap((route) => {
        const name = route.children[0].name;
        console.log(name, route.path);

        // Turn [...all] page into 404 especially for Github Pages
        // if (name === ":locale-all") {
        //   return "404";
        // }

        if (name === ":locale-news-") {
          return route.path;
        }

        // if (name === ":locale") {
        //   return locales.map((locale) => locale + "/index");
        // }

        // Insert language paths for combined-lang pages
        // return !name.startsWith(":locale")
        //   ? locales.map((lang) => lang + route.path)
        //   : route.path;

        return name.startsWith(":locale")
          ? locales.map((locale) => route.path.replace(":locale", locale))
          : route.path;
      });
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ["vue", "vue-router", "vue-i18n", "@vueuse/head"],
      dts: "./src/auto-imports.d.ts",
    }),
    Components({
      dts: "./src/components.d.ts",
    }),
    Markdown({
      headEnabled: true,
      builders: [meta()],
    }),
    Pages({
      extensions: ["vue", "md"],
      dirs: [
        { dir: "data/news", baseRoute: ":locale" },
        { dir: "pages", baseRoute: ":locale" },
      ],

      // extendRoute(route) {
      //   const path = resolve(__dirname, route.component.slice(1));
      //   const md = fs.readFileSync(path, "utf-8");
      //   const { data } = matter(md);
      //   const frontmatter = data;

      //   route.meta = Object.assign(route.meta || {}, { frontmatter });

      //   return route;
      // },
      async extendRoute(route) {
        // Transform "/news" paths
        // from: "/news/date/title.lang.md"
        // into: "/lang/news/year/month/day/slugged-title"
        if (route.component.startsWith("/data/news/")) {
          const path = resolve(__dirname, route.component.slice(1));
          const data = path.split("/").reverse();
          const filename = data[0].split(".").reverse();
          const date = data[1].split("-").join("/");
          const locale = filename[1];
          const url = slugify(filename[2]);
          const md = fs.readFileSync(path, "utf-8");
          const frontmatter = matter(md);
          const dir = dirname(path);

          const alternate = fs
            .readdirSync(dir)
            .filter(
              (name) => name.endsWith(".md") && !name.endsWith(`.${locale}.md`)
            )
            .map((name) => {
              const data = name.split(".").reverse();
              const locale = data[1];
              const url = slugify(data[2]);
              const path = `/${locale}/news/${date}/${url}`;
              return { locale, path };
            });

          route.meta = Object.assign(route.meta || {}, {
            layout: "news",
            date,
            locale,
            url,
            alternate,
            ...frontmatter.data,
          });

          route.path = `/${locale}/news/${date}/${url}`;
        }

        return route;
      },

      onRoutesGenerated: (routes) =>
        generateSitemap({
          readable: true,
          routes,
        }),
    }),

    Layouts({
      layoutsDirs: "src/layouts",
      defaultLayout: "default",
    }),

    vueI18n({
      include: resolve(__dirname, "locales/**"),
    }),
  ],
});
