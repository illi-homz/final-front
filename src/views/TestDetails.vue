<template>
  <div class="testdetails">
    <div>
      <p v-if="!test"> loading.....</p>
      <b-jumbotron
        v-else
        class="mx-5 mt-5 w-75 mx-auto"
        bg-variant="secondary"
        text-variant="white"
        border-variant="dark">
        <b-row>
          <b-col cols="2" v-if="test.img">
            <b-img
              :src="`${test.img}`"
              fluid
              alt="Responsive image"></b-img>
          </b-col>
          <b-col>
            <h1>{{ test.title }}</h1>

            <h5>
              {{ test.about }}<br>
              <small>
                Дата начала прохождения: {{ start_date | formatDate }}<br>
                Дата окончания: {{ end_date | formatDate }}
              </small>
            </h5>

            <hr class="my-4">

            <h5 v-if="test.questions.length > 0">
              Всего {{ test.questions.length }} вопроса(ов)
            </h5>
            <h5 v-if="test.groups.length > 0">
              Всего {{ test.questionsCounter }} вопроса(ов)
            </h5>
          </b-col>
        </b-row>
        <b-row>
          <b-button
            :to="`/gotest/${test.id}`"
            class="ml-auto mr-3 w-25"
            variant="success">Пройти</b-button>
          <b-button
              :to="`/test-details/${test.id}`"
              class="mr-3 w-25"
              v-if="userIsStaff"
              variant="danger">Редактировать</b-button>
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
      userIsStaff: false,
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
    getTest() {
      const config = this.setConfig();
      const id = `${this.$route.params.id}`;
      axios.get(`${BASE_API_URL}/tests/${id}/`, config)
        .then((response) => {
          this.test = response.data;
          this.start_date = response.data.start_date;
          this.end_date = response.data.end_date;
          if (this.test.groups.length > 0) {
            this.test.questionsCounter = this.countQuestionsInGroups();
          }
        });
    },
    countQuestionsInGroups() {
      let totalQuestions = 0;
      for (let i = 0; i < this.test.groups.length; i += 1) {
        totalQuestions += this.test.groups[i].group.questions.length;
      }
      return totalQuestions;
    },
  },
  mounted() {
    this.getTest();
    const userIsStaff = this.$cookies.get('user_is_staff');
    if (userIsStaff === 'true') {
      this.userIsStaff = true;
    }
  },
};
</script>
