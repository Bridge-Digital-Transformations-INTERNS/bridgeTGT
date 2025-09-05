import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/main.css";
import "./assets/css/fonts.css";
import "./assets/css/base.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
