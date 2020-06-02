<template>
  <div class="testdetails">
    <div>
      <p v-if="!test"> loading.....</p>
      <b-jumbotron
        v-else
        class="mx-5 mt-5"
        bg-variant="secondary"
        text-variant="white"
        border-variant="dark">
        <template v-slot:header>{{ test.title }}</template>

        <template v-slot:lead>
          {{ test.about }}<br>
          <small>
            Дата начала прохождения: {{ start_date | formatDate }}<br>
            Дата окончания: {{ end_date | formatDate }}
          </small>
        </template>

        <hr class="my-4">

        <h5>Всего {{ test.questions.length }} вопроса(ов)</h5>
        <b-row>
          <b-button
              :to="`/gotest/${test.id}`"
              class="ml-auto mr-3 w-25"
              variant="danger">Редактировать</b-button>
          <b-button
            :to="`/gotest/${test.id}`"
            class="mr-3 w-25"
            variant="success">Пройти</b-button>
        </b-row>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080';

export default {
  name: 'TestDetails',
  data() {
    return {
      test: null,
      start_date: null,
      end_date: null,
    };
  },
  methods: {
    getTest() {
      const id = `${this.$route.params.id}`;
      axios.get(`${BASE_API_URL}/tests/${id}/`)
        .then((response) => {
          this.test = response.data;
          this.start_date = response.data.start_date;
          this.end_date = response.data.end_date;
        });
    },
  },
  mounted() {
    this.getTest();
  },
};
</script>
