<template>
  <div class="testlist">
    <b-row>
      <b-col cols="11" xl="9" class="mx-auto">
        <div
          class="mt-3"
          v-for="(test, index) in tests"
          :key="index">
            <b-card-group deck class="mb-3 mx-auto w-100">
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
                    <span v-if="test.questions.length > 0">
                      Всего вопросов: {{ test.questions.length }}
                    </span>
                    <span v-if="test.groups.length > 0">
                      Всего вопросов: {{ test.questionsCounter }}
                    </span>
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
                    v-if="userID"
                    variant="success">Пройти</b-button>
                </b-row>
              </b-card>
            </b-card-group>
          </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;
// const BASE_API_URL = 'https://testing-gomza-back.herokuapp.com';

export default {
  name: 'TestList',
  data() {
    return {
      tests: null,
      userID: null,
    };
  },
  methods: {
    setConfig() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          'X-CSRFToken': this.$cookies.get('csrftoken'),
          Authorization: `Bearer ${jwt}`,
          // 'Access-Control-Allow-Origin': '*',
        },
      };
      return config;
    },
    getTests() {
      const config = this.setConfig();
      // console.log(BASE_API_URL, config);
      axios.get(`${BASE_API_URL}/tests/`, config)
        .then((response) => {
          this.tests = response.data;
          for (let i = 0; i < this.tests.length; i += 1) {
            if (this.tests[i].groups.length > 0) {
              this.tests[i].questionsCounter = this.countQuestionsInGroups(i);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
    this.getTests();
    this.userID = this.$cookies.get('user_id');
  },
};
</script>
