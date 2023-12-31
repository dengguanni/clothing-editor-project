import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/editor/index.vue'),
    children: [
      // {
      //   path: '/editor',
      //   component: () => import('@/views/editor/index.vue'),
      // },

    ]
  },
  {
    path: '/editor',
    component: () => import('@/views/editor/index.vue'),
  },

];

export default routes;
