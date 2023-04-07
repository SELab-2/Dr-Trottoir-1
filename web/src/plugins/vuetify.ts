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
    background: '#FFFFFF', // white
    'on-background': '#000000', // black

    surface: '#F5F5F5', // grey-lighten-4
    'on-surface': '#000000',

    primary: '#1867C0', // blue
    'on-primary': '#FFFFFF', // white

    secondary: '#009688', // teal
    'on-secondary': '#FFFFFF', // white

    warning: '#FF9800', // orange
    'on-warning': '#FFFFFF', // white

    error: '#B00020', // red
    'on-error': '#FFFFFF', // white

    success: '#4CAF50', // green
    'on-success': '#FFFFFF', // white
  }
}


export default createVuetify({
  theme: {
    defaultTheme: 'drTrottoirLight',
    themes: {
      drTrottoirLight,
    }
  }
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
