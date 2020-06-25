<template>
  <div class="home">
    <div>
      <b-jumbotron
      class="w-75 mx-auto mt-2">
        <template v-slot:header>BootstrapVue</template>

        <template v-slot:lead>
          This is a simple hero unit, a simple jumbotron-style component for
          calling extra attention to featured content or information.
        </template>

        <hr class="my-4">

        <p>
          It uses utility classes for typography and spacing to space content out within the larger
          container.
        </p>

        <b-button class="mr-2" variant="primary" to="/test-list">Список тестов</b-button>
        <b-button class="mx-2" variant="success" href="#">Do Something Else</b-button>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>
