/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import { i18n, vuetify } from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()

//icon https://boxicons.com 
// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(i18n)
app.use(createPinia())
app.use(router)

// Mount vue app
app.mount('#app')
