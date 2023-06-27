import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const routes = [
  {
    path: '/login',
    component: () => import('../views/auth/Login.vue'),
    name: 'Login',
  },
  {
    path: '/register',
    component: () => import('../views/auth/Register.vue'),
    name: 'Register',
  },
  {
    path: '/',
    component: () => import('../views/app/Home.vue'),
    name: 'Home',
    alias: '/home',
  },
  {
    path: '/about',
    component: () => import('../views/app/About.vue'),
    name: 'About',
  },
  {
    path: '/dashboard',
    component: () => import('../views/app/Dashboard.vue'),
    name: 'Dashboard',
  },
  {
    path: '/documents/:blockId?',
    component: () => import('../views/app/Documents.vue'),
    name: 'Documents',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

const ALLOWED_ROUTE_PREFIXES = ['/login', '/register'];

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  const isAllowed = ALLOWED_ROUTE_PREFIXES.some((route) => {
    return to.fullPath.match(new RegExp(`^${route}`));
  });
  if (!authStore.user.accessToken && !isAllowed) {
    return {
      name: 'Login',
    };
  }

  if (isAllowed && authStore.user.accessToken) {
    return {
      name: 'Home',
    };
  }
});
