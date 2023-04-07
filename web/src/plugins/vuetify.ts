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
const drTrottoirLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FF9800',
    primary: '#1867C0',
    secondary: '#009688',    
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
