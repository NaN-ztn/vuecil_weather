import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './css/animations.css'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
