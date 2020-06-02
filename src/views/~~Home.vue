<template>
  <div class="home">
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

        <!-- <b-navbar-brand class="ml-auto">Username</b-navbar-brand> -->
        <b-dropdown variant="dark" right text="Username" class="ml-auto">
          <b-dropdown-item>First Action</b-dropdown-item>
          <b-dropdown-item>Second Action</b-dropdown-item>
          <b-dropdown-item>Third Action</b-dropdown-item>
        </b-dropdown>
      </b-navbar>
    </div>

    <div>
      <b-sidebar
      id="sidebar-variant"
      title="Тесты"
      bg-variant="dark"
      text-variant="light"
      shadow>
        <div class="px-0 py-2">
          <b-list-group id="list-group">
              <b-list-group-item variant="dark" to="/ddd">Button item</b-list-group-item>
              <b-list-group-item variant="dark" to="/ddd">I am a button</b-list-group-item>
              <b-list-group-item variant="dark" to="/ddd">Disabled button</b-list-group-item>
              <b-list-group-item variant="dark" to="/ddd">This is a button too</b-list-group-item>
            </b-list-group>
        </div>
      </b-sidebar>
    </div>

    <main>
      <b-container class="bv-example-row" style="max-width: 100%;">
        <router-view />
      </b-container>
    </main>
  </div>
</template>

<script>
import BurgerButton from 'vue-burger-button';
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'Home',
  components: { BurgerButton },
  data() {
    return {
      isActive: true,
      showSidebar: true,
      tests: {},
    };
  },
  methods: {
    getTests() {
      axios.get(`${BASE_API_URL}/tests/`)
        .then((response) => console.log(response));
    },
  },
  mounted() {
    this.getTests();
  },
};
</script>

<style scoped>
#list-group * {
  border-radius: 0;
}

</style>

<style src="vue-burger-button/dist/vue-burger-button.css" />
