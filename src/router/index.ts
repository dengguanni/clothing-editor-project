import { createRouter, createWebHashHistory,createMemoryHistory } from 'vue-router';
import routes from './routes';

export default createRouter({
  routes,
  history: createMemoryHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
});
