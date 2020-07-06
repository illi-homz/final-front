<template>
  <div class="home">
    <div>
      <b-row class="mt-2">
        <b-col cols="12" xl="9" class="mx-auto">

          <b-jumbotron class="mx-3">
            <template v-slot:header>Сервис по тестированию</template>

            <template v-slot:lead>
              Какое то описание сарвиса
            </template>

            <hr class="my-4">

            <p>
              Еще пару слов о сервисе
            </p>

            <b-button class="mr-2" variant="primary" to="/test-list" v-if="userData">
              Список тестов
            </b-button>
            <b-button class="mx-2" variant="success" to="/my-page" v-if="userData">
              Личный кабинет
            </b-button>
          </b-jumbotron>

          <b-card
            v-if="testsForUser.length !== 0"
            class="mt-2"
            no-body
            header-html="<h4><b>Тесты которые Вам необходимо пройти:</b></h4>">
            <b-list-group flush>
              <b-list-group-item
                v-for="(test, index) in testsForUser"
                v-bind:key="index"
                :to="`/test-details/${test.id}`">
                <h5 v-if="test.questions.length > 0">
                  {{ test.title }} - всего вопросов {{ test.questions.length }}
                </h5>
                <h5 v-if="test.groups.length > 0">
                  {{ test.title }} - всего вопросов {{ test.questionsCounter }}
                </h5>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'Home',
  data() {
    return {
      userData: '',
      tests: '',
      testsForUser: [],
      results: '',
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
    getTests(id) {
      const config = this.setConfig();
      config.params = {
        user: id,
      };
      axios.get(`${BASE_API_URL}/tests/`, config)
        .then((responce) => {
          this.tests = responce.data;
          this.getResults(this.userData.id);
          for (let i = 0; i < this.tests.length; i += 1) {
            if (this.tests[i].groups.length > 0) {
              this.tests[i].questionsCounter = this.countQuestionsInGroups(i);
            }
          }
        });
    },
    getResults(id) {
      const config = this.setConfig();
      config.params = {
        user: id,
      };
      axios.get(`${BASE_API_URL}/results/`, config)
        .then((responce) => {
          this.results = responce.data;
          this.checkResults();
        });
    },
    checkResults() {
      const t = this.tests;
      const r = this.results;
      const addetTest = [];
      const resultsID = [];
      if (r.length === 0) {
        this.testsForUser = t;
      } else {
        for (let j = 0; j < r.length; j += 1) {
          resultsID.push(r[j].test.id);
        }
        for (let i = 0; i < t.length; i += 1) {
          if (!resultsID.includes(t[i].id)) {
            this.testsForUser.push(t[i]);
            addetTest.push(t[i].id);
          }
        }
      }
    },
    countQuestionsInGroups(testID) {
      const test = this.tests[testID];
      let totalQuestions = 0;
      for (let i = 0; i < test.groups.length; i += 1) {
        totalQuestions += test.groups[i].group.questions.length;
      }
      return totalQuestions;
    },
  },
  mounted() {
    this.userData = this.$cookies.get('user_data');
    if (this.userData) {
      this.getTests(this.userData.id);
    }
  },
};
</script>
