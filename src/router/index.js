import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
        },
        {
          path: 'typography',
          component: () => import('../pages/typography.vue'),
        },
        {
          path: 'noOffer',
          component: () => import('../views/pages/offer/index.vue'),
        },
        {
          path: 'unOffer',
          component: () => import('../views/pages/unOffer/index.vue'),
        },
        {
          path: 'hasOffer',
          component: () => import('../views/pages/hasOffer/index.vue'),
        },
        {
          path: 'unOrder',
          component: () => import('../views/pages/unOrder/index.vue'),
        },
        {
          path: 'hasOrder',
          component: () => import('../views/pages/hasOrder/index.vue'),
        },
        {
          path: 'invoicing',
          component: () => import('../views/pages/invoicing/index.vue'),
        },
        {
          path: 'unInvoicing',
          component: () => import('../views/pages/unInvoicing/index.vue'),
        },
        {
          path: 'balaquery',
          component: () => import('../views/pages/balaquery/index.vue'),
        },
        {
          path: 'unqualified',
          component: () => import('../views/pages/unqualified/index.vue'),
        },
        {
          path: 'barcodeP',
          component: () => import('../views/pages/barcodeP/index.vue'),
        },
        {
          path: 'barcodeInvoice',
          component: () => import('../views/pages/barcodeInvoice/index.vue'),
        },
        {
          path: 'invoiceP',
          component: () => import('../views/pages/invoiceP/index.vue'),
        },
        {
          path: 'reward',
          component: () => import('../views/pages/reward/index.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          component: () => import('../pages/login.vue'),
        },
        {
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          path: 'designer',
          component: () => import('../pages/designer.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  if (token || to.path === '/login') {
    next();
  } else {
    next("/login");
  }
})

