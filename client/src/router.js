import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/LoginForm.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/RegisterForm.vue'),
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'feed',
          component: () => import('./views/Feeds.vue'),
        },
        {
          path: '/post',
          name: 'post',
          component: () => import('./views/PostQuestion.vue'),
        },
        {
          path: '/questions/:id',
          name: 'questions',
          component: () => import('./views/QuestionDetail.vue'),
        },
        {
          path: '/tag/:name',
          name: 'tag',
          component: () => import('./views/QuestionsTag.vue'),
        },
        {
          path: '*',
          name: 'redirect-nested',
          beforeEnter: (to, from, next) => {
            next('/');
          },
        },
      ],
    },
    {
      path: '*',
      name: 'not-found',
      beforeEnter: (to, from, next) => {
        next('/')
      }
    },
  ],
});
