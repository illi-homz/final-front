<template>
  <div class="main">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand v-b-toggle.sidebar-variant>
          <burger-button
            :bar-color="'#fff'"
            :bar-height="5"
            :bar-width="30"
            />
        </b-navbar-brand>


        <b-navbar-brand class="ml-2" to="/">На главную</b-navbar-brand>

        <b-navbar-brand v-if="id" class="ml-auto">{{ username }}</b-navbar-brand>

        <b-dropdown v-if="id" variant="dark" right text="Username" class="ml-auto">
          <b-dropdown-item to="/my-page">My page</b-dropdown-item>
          <b-dropdown-item v-b-modal.modal-logout>Logout</b-dropdown-item>
        </b-dropdown>

        <div v-else class="ml-auto">
          <b-button variant="dark" v-b-modal.modal-login>Login</b-button>
          <b-button variant="dark" v-b-modal.modal-register>Register</b-button>
        </div>
      </b-navbar>
    </div>

    <div>
      <b-sidebar
      id="sidebar-variant"
      title="Меню"
      bg-variant="dark"
      text-variant="light"
      shadow>
        <div class="px-0 py-2">
          <b-list-group id="list-group">
              <b-list-group-item
                variant="dark"
                to="/">
                На главную</b-list-group-item>
              <b-list-group-item
                variant="dark"
                to="/create-test"
                v-if="userData.is_staff">
                Создать тест</b-list-group-item>
              <b-list-group-item
                variant="dark"
                to="/create-question"
                v-if="userData.is_staff">
                Создать вопросы</b-list-group-item>
              <b-list-group-item
                variant="dark"
                to="/create-qroup-questions"
                v-if="userData.is_staff">
                Создать группу вопросов</b-list-group-item>
              <b-list-group-item
                variant="dark"
                to="/test-list"
                v-if="userData.is_staff">
                Список тестов</b-list-group-item>
              <b-list-group-item
                variant="dark"
                to="/contact-us">
                Связаться с нами</b-list-group-item>
            </b-list-group>
        </div>
      </b-sidebar>
    </div>

    <div>
      <b-modal id="modal-login" title="Вход" hide-footer>
        <b-form @submit="login">
          <b-row align-v="center" class="mb-2">
            <b-col cols="2">Логин</b-col>
            <b-col>
              <b-form-input
                v-model="username"
                type="text"
                placeholder="Введите логин"></b-form-input>
            </b-col>
          </b-row>
          <b-row align-v="center">
            <b-col cols="2">Пароль</b-col>
            <b-col>
              <b-form-input
                v-model="password"
                type="password"
                placeholder="Введите пароль"></b-form-input>
            </b-col>
          </b-row>
          <b-row v-if="noLogin">
            <b-col class="text-danger">
              * Введены неверные данные
            </b-col>
          </b-row>
          <b-button class="mt-3" block variant="success" @click="login">
            Login
          </b-button>
        </b-form>
        <b-button class="mt-1" block @click="$bvModal.hide('modal-login')" variant="danger">
          Cansel
        </b-button>
      </b-modal>
    </div>

    <div>
      <b-modal id="modal-logout" title="Выход" hide-footer>
        Уверен?
        <b-button class="mt-1" block @click="logout" variant="success">
          Logout
        </b-button>
        <b-button class="mt-1" block @click="$bvModal.hide('modal-login')" variant="danger">
          Cansel
        </b-button>
      </b-modal>
    </div>

    <div>
      <b-modal id="modal-register" title="Регистрация пользователя" hide-footer>
        <p class="text-center">
          Опция пока не реализована
        </p>
        <p class="text-center">
          за помощью обратитесь к вашему разработчику
        </p>
        <b-button class="mt-1" block @click="$bvModal.hide('modal-register')" variant="danger">
          Cansel
        </b-button>
      </b-modal>
    </div>

    <main>
      <b-container class="bv-example-row px-0" style="max-width: 100%;">
        <router-view />
      </b-container>
    </main>
  </div>
</template>

<script>
import BurgerButton from 'vue-burger-button';
import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'MainLayout',
  components: { BurgerButton },
  data() {
    return {
      isActive: true,
      showSidebar: true,
      tests: {},
      username: '',
      password: '',
      id: '',
      userData: '',
      noLogin: false,
    };
  },
  methods: {
    getUserId(token) {
      const data = VueJwtDecode.decode(token);
      return data.user_id;
    },
    getUserData(id, jwt) {
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${BASE_API_URL}/users/${id}/`, config)
        .then((response) => {
          const userData = response.data;
          this.userData = userData;
          this.$cookies.set(
            'user_data', userData,
            null, null, null, true, 'Lax',
          );
          this.$cookies.set(
            'user_is_staff', userData.is_staff,
            null, null, null, true, 'Lax',
          );
        });
    },
    login(event) {
      event.preventDefault();
      if (this.username && this.password) {
        const requestData = {
          username: this.username,
          password: this.password,
        };
        const config = {
          headers: {
            'X-CSRFToken': this.$cookies.get('csrftoken'),
          },
        };
        axios.post(`${BASE_API_URL}/api/token/`, requestData, config)
          .then((response) => {
            this.$bvModal.hide('modal-login');
            this.$cookies.set(
              'jwt_token', response.data.access,
              '14d', null, null, true, 'Lax',
            );
            this.id = this.getUserId(response.data.access);
            this.$cookies.set(
              'user_id', this.id,
              null, null, null, true, 'Lax',
            );
            this.getUserData(this.id, response.data.access);
            this.noLogin = false;
          })
          .catch(() => {
            this.noLogin = true;
          });
      }
      this.$router.replace('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    logout() {
      this.$bvModal.hide('modal-logout');
      this.$cookies.remove('jwt_token');
      this.$cookies.remove('user_data');
      this.$cookies.remove('user_id');
      this.$cookies.remove('user_is_staff');
      this.username = '';
      this.password = '';
      this.userData = '';
      this.id = '';
      this.$router.replace('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
  },
  mounted() {
    const userData = this.$cookies.get('user_data');
    if (userData) {
      this.userData = userData;
      this.username = this.userData.username;
      this.id = this.userData.id;
    }
  },
};
</script>

<style scoped>
#list-group * {
  border-radius: 0;
}

</style>

<style src="vue-burger-button/dist/vue-burger-button.css" />
