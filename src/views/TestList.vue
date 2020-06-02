<template>
  <div class="testlist">
    <div>
      <div
      class="mt-3"
      v-for="test in tests"
      :key="test.id">
        <b-card-group deck class="mb-3 mx-auto w-75">
          <b-card
            border-variant="dark"
            :header="`${test.title}`"
            header-tag="h2"
            class="mx-3"
            align="left">
            <b-card-text>
              {{ test.about }}
            </b-card-text>
            <small class="text-muted">
              <i>
                Дата начала: {{ test.start_date }}<br>
                Дата окончания: {{ test.end_date }}<br>
                Всего вопросов: {{ test.questions.length }}<br>
              </i>
            </small>
            <b-row>
              <b-button
                :to="`/test-details/${test.id}`"
                class="ml-auto mr-3 w-25"
                variant="danger">Детали</b-button>
              <b-button
                :to="`/gotest/${test.id}`"
                class="mr-3 w-25"
                variant="success">Пройти</b-button>
            </b-row>
          </b-card>
        </b-card-group>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080';

export default {
  name: 'TestList',
  data() {
    return {
      tests: null,
    };
  },
  methods: {
    getTests() {
      axios.get(`${BASE_API_URL}/tests/`)
        .then((response) => {
          this.tests = response.data;
        });
    },
  },
  mounted() {
    this.getTests();
  },
};
</script>
