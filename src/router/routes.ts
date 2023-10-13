import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
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
  {
    path: '/test',
    component: () => import('@/components/test.vue'),
  },
];


export default routes;
