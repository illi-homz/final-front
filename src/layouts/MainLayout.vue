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

        <!-- <b-navbar-brand class="ml-auto">Username</b-navbar-brand> -->
        <b-dropdown variant="dark" right text="Username" class="ml-auto">
          <b-dropdown-item to="my-page">My page</b-dropdown-item>
          <b-dropdown-item to="logout">Logout</b-dropdown-item>
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
              <b-list-group-item variant="dark" to="/create-test">Создать тест</b-list-group-item>
              <b-list-group-item variant="dark" to="/create-question">
                Создать вопросы
              </b-list-group-item>
              <b-list-group-item variant="dark" to="/create-qroup-questions">
                Создать группу вопросов
              </b-list-group-item>
              <b-list-group-item variant="dark" to="/test-list">Список тестов</b-list-group-item>
              <b-list-group-item variant="dark" to="/contact-us">
                Связаться с нами
              </b-list-group-item>
            </b-list-group>
        </div>
      </b-sidebar>
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

export default {
  name: 'MainLayout',
  components: { BurgerButton },
  data() {
    return {
      isActive: true,
      showSidebar: true,
      tests: {},
    };
  },
};
</script>

<style scoped>
#list-group * {
  border-radius: 0;
}

</style>

<style src="vue-burger-button/dist/vue-burger-button.css" />
