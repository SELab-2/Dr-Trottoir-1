/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerPlugins } from "@/plugins";
import * as Sentry from "@sentry/vue";
import router from "@/router";

const app = createApp(App);
const pinia = createPinia();

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    trackComponents: true,
  });
}

app.use(pinia);
registerPlugins(app);
app.mount("#app");
