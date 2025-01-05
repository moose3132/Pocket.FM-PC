import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './assets/main.css'
import 'https://cdn.jsdelivr.net/npm/hls.js@latest'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(createVuestic()).mount('#app')
