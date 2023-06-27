import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import { veeValidatePlugin } from './plugins/veeValidate/veeValidatePlugin';
import Notifications from '@kyvg/vue3-notification';

createApp(App)
  .use(router)
  .use(createPinia())
  .use(veeValidatePlugin)
  .use(Notifications)
  .mount('#app');
