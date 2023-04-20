/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify, ThemeDefinition } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// colors: https://vuetifyjs.com/en/styles/colors/
const drTrottoirLight: ThemeDefinition = {
  dark: false,
  colors: {
    "background": "#F5F5F5", // grey-lighten-4
    "on-background": "#000000", // black

    "surface": "#FFFFFF", // white
    "on-surface": "#000000",

    "border": "#BDBDBDFF", //grey-darken-2

    "primary": "#1867C0", // blue
    "on-primary": "#FFFFFF", // white

    "secondary": "#009688", // teal
    "on-secondary": "#FFFFFF", // white

    "warning": "#FF9800", // orange
    "on-warning": "#FFFFFF", // white

    "error": "#B00020", // red
    "on-error": "#FFFFFF", // white

    "success": "#4CAF50", // green
    "on-success": "#FFFFFF", // white
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "drTrottoirLight",
    themes: {
      drTrottoirLight,
    },
  },
  defaults: {
    // global outlined is too much, bad idea.
    // only set for the components you want outlined
    VTextField: { variant: "outlined" },
    VTextarea: { variant: "outlined" },
    VSelect: { variant: "outlined" },
    VFileInput: { variant: "outlined" },
    VAutocomplete: { variant: "outlined" },
  },
  display: {
    mobileBreakpoint: 'lg',
    thresholds: {
      xs: 0,
      sm: 340,
      md: 540,
      lg: 750,
      xl: 1280,
    },
  },
  /*theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },*/
});
