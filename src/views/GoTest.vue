<template>
  <div class="gotest">
    <div>
      <b-row class="mx-auto w-75">
        <b-col class="px-0" cols="8">
          <h2 class="text-left mt-2">
            Всего баллов: <b>{{ totalPoints }}</b> Набрано Вами: <b>{{ userPoints }}</b>
          </h2>
        </b-col>
        <b-col class="px-0">
          <h2  class="text-right mt-2">
            Время на вопрос: <b>{{ timeOnQuestion }}</b>
          </h2>
        </b-col>
      </b-row>
      <p v-if="!test"> loading.....</p>
      <b-jumbotron
        class="w-75 mx-auto mt-1 py-3"
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
                        <b-col>
                          <b-form-input
                            v-model="results[index].answer"
                            placeholder="Введите ответ"></b-form-input>
                        </b-col>
                      </b-row>

                      <b-row v-else-if="q.question.qtype == 'checkbox'" class="mb-4">
                        <b-col
                          v-if="q.question.img"
                          cols="4">
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080';

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
    };
  },
  methods: {
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
        // user: '',
        answer: '',
        question: id,
      });
      return q;
    },
    checkRaio(question, id) {
      const q = question;
      q.variants = JSON.parse(q.variants);
      this.results.push({
        // user: '',
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
        // user: '',
        answer: [],
        question: id,
      });
      return q;
    },
    getTest() {
      const id = `${this.$route.params.id}`;
      axios.get(`${BASE_API_URL}/tests/${id}/`)
        .then((response) => {
          // console.log(response.data);
          this.test = response.data;
          this.timeOnQuestion = this.test.time_on_question;
          // this.timeOnQuestion = 2;

          this.questions = response.data.questions;
          for (let i = 0; i < this.questions.length; i += 1) {
            const q = this.questions[i];

            switch (q.question.qtype) {
              case 'input':
                q.question = this.checkInput(q.question, q.id);
                break;
              case 'radio':
                q.question = this.checkRaio(q.question, q.id);
                break;
              case 'checkbox':
                q.question = this.checkCheckbox(q.question, q.id);
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
      const resuls = this.results[index].answer.toLowerCase();
      const question = this.questions[index].question.answer.toLowerCase();
      this.showResult(resuls === question, index, r);
    },
    checkCheckboxAnsver(index, r) {
      const resuls = this.results[index].answer;
      const question = this.questions[index].question.answer;
      let res = 0;
      const ans = question.length;

      for (let i = 0; i < resuls.length; i += 1) {
        if (question.indexOf(resuls[i]) !== -1) {
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
          // console.log('Hello');
          this.sendResults();
        }, 1000);
      }
    },
    sendResults() {
      const data = {
        user: '',
        test: this.test.id,
        answers: JSON.stringify(this.results),
      };
      axios.post(`${BASE_API_URL}/results/`, data)
        .then((response) => {
          // console.log(response.data);
          this.$router.push(`/results/${response.data.id}`);
        });
    },
  },
  mounted() {
    this.getTest();
  },
};
</script>
