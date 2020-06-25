import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Главная', layout: 'main' },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/test-list',
    name: 'TestList',
    meta: { title: 'Список тестов', layout: 'main' },
    component: () => import('@/views/TestList.vue'),
  },
  {
    path: '/test-details/:id',
    name: 'TestDetsils',
    meta: { title: 'Подробности', layout: 'main' },
    component: () => import('@/views/TestDetails.vue'),
  },
  {
    path: '/gotest/:id',
    name: 'GoTest',
    meta: { title: 'Тестирование', layout: 'main' },
    component: () => import('@/views/GoTest.vue'),
  },
  {
    path: '/create-question',
    name: 'CreateQuestion',
    meta: { title: 'Создание вопросов', layout: 'main' },
    component: () => import('@/views/CreateQuestion.vue'),
  },
  {
    path: '/create-qroup-questions',
    name: 'CreateGroupQuestion',
    meta: { title: 'Создание групп вопросов', layout: 'main' },
    component: () => import('@/views/CreateGroupQuestions.vue'),
  },
  {
    path: '/create-test',
    name: 'CreateTest',
    meta: { title: 'Создание теста', layout: 'main' },
    component: () => import('@/views/CreateTest.vue'),
  },
  {
    path: '/results/:id',
    name: 'Results',
    meta: { title: 'Результаты теста', layout: 'main' },
    component: () => import('@/views/Results.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
