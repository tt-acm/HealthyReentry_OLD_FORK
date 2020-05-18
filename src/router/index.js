import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
// import About from '@/views/About.vue';
// import Profile from '@/views/Profile.vue';
// import Test from '@/views/Test.vue';
import Intro from '@/views/Intro.vue';
import Disclosure from '@/views/Disclosure.vue';
import Menu from '@/views/Menu.vue';

// import { authGuard } from "@/auth/authGuard";

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      // beforeEnter: (to, from, next) => {
      //   // if (store.state.user) {
      //   //   console.log("store.state.user.dateOfConsent", store.state.user.dateOfConsent);
      //   //   if (!store.state.user.dateOfConsent) return next('/disclosure');
      //   //   else return next('/menu');
      //   // }
      //   // return next();
      // }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: About
    // },
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: Profile,
    //   // beforeEnter: authGuard
    // },
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: Test,
    //   // beforeEnter: authGuard
    // }
    {
      path: '/intro',
      name: 'intro',
      component: Intro
    },
    {
      path: '/disclosure',
      name: 'disclosure',
      component: Disclosure
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu
    }
  ]
});
