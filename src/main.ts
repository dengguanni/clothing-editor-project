import { createApp } from 'vue';
import App from './App';
import router from './router';
import ViewUiPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import './styles/index.less';
import VueLazyLoad from 'vue3-lazyload';
import { registerSW } from 'virtual:pwa-register';
import '@/assets/iconFront/iconfont.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from '@/store'
// 自定义字体文件
import '@/assets/fonts/font.css';
// import axios from 'axios';
import i18n from './language/index';
if ('serviceWorker' in navigator) {
  registerSW();
}
const app = createApp(App);
// app.config.globalProperties.$http = axios;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus).use(store)
app.use(router).use(i18n).use(VueLazyLoad, {}).use(ViewUiPlus).mount('#app');
