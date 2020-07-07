import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import moment from 'moment';
import VueCookies from 'vue-cookies';
import cors from 'cors';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.$cookies.config('30d');

Vue.use(cors);

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
Vue.filter('formatDate', (value) => moment(String(value)).format('DD.MM.YYYY'));
Vue.filter('formatDateTime', (value) => moment(String(value)).format('HH:mm DD.MM.YYYY'));

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
