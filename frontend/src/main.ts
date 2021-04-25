import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { Directives } from "./directives";

import "./globals-CS";
import "./style";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Directives);
app.mount("#app");
