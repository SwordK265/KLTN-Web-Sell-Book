import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/book/:id',
    name: 'BookDetailView',
    component: () =>
      import(/*webpackChunkName:"bookDetail"*/ '../views/BookDetailView.vue')
  },
  {
    path: '/:search',
    name: 'SearchView',
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/cart',
    name: 'CartView',
    beforeEnter: () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) return { name: 'UnauthorizedView' };
    },
    component: () => import('../views/CartView.vue')
  },
  {
    path: '/profile',
    name: 'ProfileView',
    beforeEnter: () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) return { name: 'UnauthorizedView' };
    },
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/vinabook-super',
    name: 'AdminView',
    component: () => import('../views/AdminView.vue'),
    children: [
      {
        path: 'users',
        component: () => import('../components/Admin/UserComponent.vue')
      },
      {
        path: 'authors',
        component: () => import('../components/Admin/AuthorComponent.vue')
      },
      {
        path: 'publishers',
        component: () => import('../components/Admin/PublisherComponent.vue')
      },
      {
        path: 'categories',
        component: () => import('../components/Admin/CategoryComponent.vue')
      },
      {
        path: 'category-types',
        component: () => import('../components/Admin/CategoryTypeComponent.vue')
      },
      {
        path: 'books',
        component: () => import('../components/Admin/BookComponent.vue')
      },
      {
        path: 'payments',
        component: () => import('../components/Admin/PaymentComponent.vue')
      },
      {
        path: 'carts',
        component: () => import('../components/Admin/CartComponent.vue')
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/vinabook-super/login',
    name: 'Login',
    component: () => import('../components/Admin/LogIn.vue')
  },
  {
    path: '/unauthorized',
    name: 'UnauthorizedView',
    component: () => import('../views/UnauthorizedView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('user')) {
    return { name: 'Login' };
  }
});

export default router;
