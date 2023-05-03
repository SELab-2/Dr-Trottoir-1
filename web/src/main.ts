/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerPlugins } from "@/plugins";

const app = createApp(App);
const pinia = createPinia();

registerPlugins(app);

app.use(pinia);
app.mount("#app");
