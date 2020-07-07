<template>
  <div class="questions-list">
    <b-row>
      <b-col cols="11" xl="8" class="mx-auto">
        <b-row
          class="mt-2"
          v-for="(question, index) in questions"
          v-bind:key="index">
          <b-col>
            <p class="p-2 m-0 question">{{index + 1}}. {{ question.question }}</p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'QuestionsList',
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    setConfig() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          'X-CSRFToken': this.$cookies.get('csrftoken'),
          Authorization: `Bearer ${jwt}`,
        },
      };
      return config;
    },
    getQuestions() {
      const config = this.setConfig();
      axios.get(`${BASE_API_URL}/questions/`, config)
        .then((response) => {
          this.questions = response.data;
        });
    },
  },
  mounted() {
    this.getQuestions();
  },
};
</script>

<style>
.question {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
