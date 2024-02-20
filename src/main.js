import '@/assets/app.scss'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import { plugin, defaultConfig } from '@formkit/vue'
import { createAutoAnimatePlugin } from '@formkit/addons'

import '@formkit/themes/genesis'
import router from './router'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(router)
app.use(
  plugin,
  defaultConfig({
    plugins: [
      createAutoAnimatePlugin({
        duration: 250
      })
    ]
  })
)
app.use(PrimeVue)
app.use(VueClipboard)
app.use(ToastService)

app.directive('tooltip', Tooltip)
app.mount('#app')
