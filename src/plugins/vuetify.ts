import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@/assets/sass/variables.scss";
import pt from "vuetify/src/locale/pt";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: {
          base: "#04842C",
          darken1: "#3DBC65",
          darken2: "#A2CFB0",
        },
        error: { base: "#B00020" },
      },
    },
  },
  lang: {
    locales: { pt },
    current: "pt",
  },
});
