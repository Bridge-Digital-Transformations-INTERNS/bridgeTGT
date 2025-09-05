# BridgeTGT — Vue 3 + Vite + Pinia + Tailwind starter

This single document contains a full starter project scaffold for **BridgeTGT** (Status Board). Copy files into an empty folder and follow README to run.

---

## File tree

```
package.json
vite.config.js
index.html
tailwind.config.cjs
postcss.config.cjs
src/
  main.js
  App.vue
  assets/
    main.css
    logo.svg
  components/
    HeaderBar.vue
    ProgressOverview.vue
    TasksTable.vue
    TaskRow.vue
  stores/
    projectStore.js
  utils/
    weights.js
README.md
```

---

### package.json
```json
{
  "name": "bridgetgt",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pinia": "^2.0.30",
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.5.4",
    "vite": "^5.1.7"
  }
}
```

---

### vite.config.js
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

---

### index.html
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BridgeTGT</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

### tailwind.config.cjs
```js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

### postcss.config.cjs
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### src/main.js
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

---

### src/assets/main.css
```css

```

---

### src/stores/projectStore.js
```js

```

---

### src/utils/weights.js
```js

```

---

### src/components/HeaderBar.vue
```vue

```

---

### src/components/ProgressOverview.vue
```vue

```

---

### src/components/TaskRow.vue
```vue

```

---

### src/components/TasksTable.vue
```vue

```

---

### src/App.vue
```vue

```

---

### src/assets/logo.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#7c3aed"/><text x="50" y="56" font-size="28" text-anchor="middle" fill="white" font-family="sans-serif">BT</text></svg>
```

---

### README.md
```
# BridgeTGT Starter

1. Install dependencies
   npm install

2. Run dev server
   npm run dev

This project is intentionally minimal and focused on the UI + store logic so you can iterate quickly.
