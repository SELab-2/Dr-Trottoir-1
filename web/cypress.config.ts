import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    //baseUrl: "https://sel2-1.ugent.be/",
    baseUrl: "http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('@cypress/code-coverage/task')(on, config)

      // add other tasks to be registered here

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
