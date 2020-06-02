<template>
  <div class="testdetails">
    <div>
      <p v-if="!test"> loading.....</p>
      <b-card no-body v-else>
        <b-tabs pills card>
          <b-tab
            v-for="(q, index) in test.questions"
            v-bind:key="q.id"
            :title="`Вопрос ${index + 1}`"
            :disabled="disabledQuestions[index]"
            >
            <b-card-text>{{ q.question.question }}</b-card-text>
            <b-card-text>
              тут будут варианты ответов
              <b-button
                @click="cangeDisable(index)"
                variant="success">Пройти</b-button>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
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
      disabledQuestions: [],
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
          for (let i = 0; i < this.test.questions.length; i += 1) {
            this.disabledQuestions[i] = true;
          }
          this.disabledQuestions[0] = false;
        });
    },
    cangeDisable(index) {
      // if (index > 0) {
      //   this.$set(this.disabledQuestions, index - 1, true);
      // }
      this.$set(this.disabledQuestions, index - 1, true);
      this.$set(this.disabledQuestions, index, true);
      this.$set(this.disabledQuestions, index + 1, false);
    },
  },
  mounted() {
    this.getTest();
  },
};
</script>
