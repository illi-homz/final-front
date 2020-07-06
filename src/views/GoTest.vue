<template>
  <div class="gotest">
    <b-row>
      <b-col cols="11" xl="9" class="mx-auto">
        <b-row class="mx-3">
          <b-col class="px-0" cols="8">
            <h4 class="text-left mt-2">
              Всего баллов: <b>{{ totalPoints }}</b> Набрано Вами: <b>{{ userPoints }}</b>
            </h4>
          </b-col>
          <b-col class="px-0">
            <h4  class="text-right mt-2">
              Время на вопрос: <b>{{ timeOnQuestion }}</b>
            </h4>
          </b-col>
        </b-row>
        <p v-if="!test"> loading.....</p>
        <b-jumbotron
          class="mx-3 mt-1 py-3"
          bg-variant="info"
          border-variant="dark"
          v-else>
          <b-row class="my-3">
            <b-col>
              <b-card no-body>
                <b-tabs pills card>
                  <b-tab
                    v-for="(q, index) in questions"
                    v-bind:key="q.id"
                    :title="`Вопрос ${index + 1}`"
                    :disabled="disabledQuestions[index]"
                    >
                    <h2 v-if="result == 1" class="text-center text-success">ВЕРНО</h2>
                    <h2 v-else-if="result == 2" class="text-center text-danger">НЕ ВЕРНО</h2>
                    <h2 v-else-if="result == 3" class="text-center text-danger">ВРЕМЯ ВЫШЛО</h2>
                    <b-card-text>{{ q.question.question }}</b-card-text>
                    <b-card-text>

                      <b-form v-on:submit.prevent>
                        <b-row v-if="q.question.qtype == 'input'" class="mb-4">
                          <b-col
                            v-if="q.question.img"
                            cols="3">
                            <b-img
                              :src="`${q.question.img}`"
                              fluid
                              alt="Responsive image"></b-img>
                          </b-col>
                          <b-col>
                            <b-form-input
                              v-model="results[index].answer"
                              placeholder="Введите ответ"></b-form-input>
                          </b-col>
                        </b-row>

                        <b-row v-else-if="q.question.qtype == 'checkbox'" class="mb-4">
                          <b-col
                            v-if="q.question.img"
                            cols="3">
                            <b-img
                              :src="`${q.question.img}`"
                              fluid
                              alt="Responsive image"></b-img>
                          </b-col>
                          <b-col>
                            <b-form-checkbox
                              v-for="(q, i) in q.question.variants"
                              v-bind:key="i"
                              v-model="results[index].answer"
                              :value="`${q.value}`">
                              {{ q.value }}
                            </b-form-checkbox>
                          </b-col>
                        </b-row>

                        <b-row v-else-if="q.question.qtype == 'radio'" class="mb-4">
                          <b-col
                            v-if="q.question.img"
                            cols="3">
                            <b-img
                              :src="`${q.question.img}`"
                              fluid
                              alt="Responsive image"></b-img>
                          </b-col>
                          <b-col>
                            <b-form-radio
                              v-for="(q, i) in q.question.variants"
                              v-bind:key="i"
                              v-model="results[index].answer"
                              :value="`${q.value}`">
                              {{ q.value }}
                            </b-form-radio>
                          </b-col>
                        </b-row>

                        <b-button
                          @click="onSubmit(index, q.question.qtype)"
                          type="submit"
                          variant="success">Ответить</b-button>
                      </b-form>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-col>
          </b-row>
        </b-jumbotron>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'GoTest',
  data() {
    return {
      disabledQuestions: [],
      test: null,
      questions: [],
      start_date: null,
      end_date: null,
      results: [],
      result: 0,
      totalPoints: 0,
      userPoints: 0,
      timeOnQuestion: 0,
      interval: null,
      currentIndex: 0,
      userID: 0,
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
    questionTimer() {
      this.interval = setInterval(() => {
        if (this.timeOnQuestion > 0) {
          this.timeOnQuestion -= 1;
        } else {
          this.result = 3;
          clearInterval(this.interval);
          const type = this.questions[this.currentIndex].question.qtype;
          this.onSubmit(this.currentIndex, type, 3);
        }
      }, 1000);
    },
    checkInput(question, id) {
      const q = question;
      this.results.push({
        user: this.userID,
        answer: '',
        question: id,
      });
      return q;
    },
    checkRaio(question, id) {
      const q = question;
      q.variants = JSON.parse(q.variants);
      this.results.push({
        user: this.userID,
        answer: '',
        question: id,
      });
      return q;
    },
    checkCheckbox(question, id) {
      const q = question;
      q.answer = JSON.parse(q.answer);
      q.variants = JSON.parse(q.variants);
      this.results.push({
        user: this.userID,
        answer: [],
        question: id,
      });
      return q;
    },
    getTest() {
      const config = this.setConfig();
      const id = `${this.$route.params.id}`;
      axios.get(`${BASE_API_URL}/tests/${id}/`, config)
        .then((response) => {
          this.test = response.data;
          this.timeOnQuestion = this.test.time_on_question;

          if (this.test.groups.length > 0) {
            for (let i = 0; i < this.test.groups.length; i += 1) {
              const groupInTest = this.test.groups[i];
              for (let j = 0; j < groupInTest.group.questions.length; j += 1) {
                this.questions.push({
                  id: groupInTest.id,
                  price: groupInTest.price,
                  question: groupInTest.group.questions[j],
                });
              }
            }
          } else {
            this.questions = response.data.questions;
          }

          for (let i = 0; i < this.questions.length; i += 1) {
            const q = this.questions[i];

            switch (q.question.qtype) {
              case 'input':
                q.question = this.checkInput(q.question, q.question.id);
                break;
              case 'radio':
                q.question = this.checkRaio(q.question, q.question.id);
                break;
              case 'checkbox':
                q.question = this.checkCheckbox(q.question, q.question.id);
                break;
              default:
                console.log('Unexpected type of question');
            }

            this.totalPoints += q.price;
          }
        });
      this.questionTimer();
    },
    showResult(answer, index, res) {
      if (answer) {
        this.result = 1;
        this.userPoints += this.questions[index].price;
      } else if (res) {
        this.result = res;
      } else {
        this.result = 2;
      }
    },
    checkInputAndRadioAnsvers(index, r) {
      const result = this.results[index].answer.toLowerCase();
      const question = this.questions[index].question.answer.toLowerCase();
      this.showResult(result === question, index, r);
    },
    checkCheckboxAnsver(index, r) {
      const result = this.results[index].answer;
      const question = this.questions[index].question.answer;
      let res = 0;
      const ans = question.length;

      for (let i = 0; i < result.length; i += 1) {
        if (question.indexOf(result[i]) !== -1) {
          res += 1;
        }
      }
      this.showResult(res === ans, index, r);
    },
    onSubmit(index, qtype, res = null) {
      switch (qtype) {
        case 'input':
        case 'radio':
          this.checkInputAndRadioAnsvers(index, res);
          break;
        case 'checkbox':
          this.checkCheckboxAnsver(index, res);
          break;
        default:
          console.log('Unexpected type of question');
      }

      setTimeout(() => {
        this.$set(this.disabledQuestions, index - 1, true);
        this.$set(this.disabledQuestions, index, true);
        this.$set(this.disabledQuestions, index + 1, false);
        this.result = 0;
      }, 1000);

      this.currentIndex += 1;

      if (this.currentIndex < this.questions.length) {
        this.timeOnQuestion = this.test.time_on_question;
        clearInterval(this.interval);
        this.questionTimer();
      } else {
        clearInterval(this.interval);
        setTimeout(() => {
          this.timeOnQuestion = 0;
          this.sendResults();
        }, 1000);
      }
    },
    sendResults() {
      const config = this.setConfig();
      const data = {
        user: this.userID,
        test: this.test.id,
        answers: JSON.stringify(this.results),
      };
      axios.post(`${BASE_API_URL}/results/`, data, config)
        .then((response) => {
          this.$router.push(`/results/${response.data.id}`);
        });
    },
  },
  mounted() {
    this.getTest();
    this.userID = this.$cookies.get('user_id');
  },
};
</script>
