import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { createHead } from "@vueuse/head";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { createI18n } from "vue-i18n";

//// Head
const head = createHead();

//// Routes
const routes = setupLayouts(generatedRoutes);

//// Locale
// Import locales manually
// Required for SSG because not supports virtual packages with package name
// https://github.com/antfu/vite-ssg/issues/32
const messages = Object.fromEntries(
  Object.entries(import.meta.globEager("../locales/*.yaml")).map(
    ([key, value]) => [key.slice(11, -5), value.default]
  )
);

const i18n = createI18n({
  locale: "ru",
  fallbackLocale: "ru",
  // Force to use Composition API
  // Required to prevent "Not available in legacy mode" error
  // appears when you open page rendered with SSR
  // https://github.com/intlify/vite-plugin-vue-i18n/issues/102
  legacy: false,
  messages,
});

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    router.addRoute({
      path: "/",
      component: {
        template: "<router-view />",
      },
      beforeEnter: (to, from, next) => {
        console.log("index");
        return next();
      },
    });

    app.use(head);
    app.use(i18n);
  }
);
