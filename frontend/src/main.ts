import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { Directives } from "./directives";

import "./globals-CS";
import "./style";

createApp(App)
  .use(store)
  .use(router) /* .use(Directives) */
  .mount("#app");
