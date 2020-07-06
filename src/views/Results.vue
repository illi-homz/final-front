<template>
  <div class="results">
    <b-row>
      <b-col cols="12" xl="9" class="mx-auto">
        <p v-if="!result"> loading.....</p>
        <b-jumbotron
        class="mt-2 mx-3 py-3"
        border-variant="dark"
        v-else>
          <h1 class="text-center"><b>{{ result.test.title }}</b></h1>
          <b-row class="mb-2">
            <b-col cols="2" v-if="result.test.img">
              <b-img
                :src="`${result.test.img}`"
                height="100"
                rounded
                fluid
                alt="Responsive image"></b-img>
            </b-col>
            <b-col>
              <h5>Время и дата тестирования: {{ result.create_date | formatDateTime }}</h5>
              <h5>Всего вопросов: <b>{{ questionsInTest.length }}</b></h5>
              <h5>Полнота ответов: <b>{{
                (completenessOfAnswers / answeretQuestions.length * 100).toFixed(2)
                }}%</b></h5>
              <h5>Всего баллов: <b>{{ totalPrice }}</b></h5>
            </b-col>
          </b-row>
          <h5><b>Ваши ответы:</b></h5>
          <hr>
          <b-card
          v-for="(question, index) in fullResults"
          v-bind:key="index">
            <p
              v-if="question.qtype == 'checkbox'"
              class="m-0 p-0">
              Вопрос {{ index + 1 }}.
              <span v-for="(answer, i) in question.answer" v-bind:key="i">
                (ответ {{ i + 1 }}: <b>{{ answer }}</b>)
              </span>
            </p>
            <p v-else class="m-0 p-0">Вопрос {{ index + 1 }}. {{ question.answer }}</p>
          </b-card>
        </b-jumbotron>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'Results',
  data() {
    return {
      result: null,
      fullResults: [],
      totalPrice: 0,
      answeretQuestions: null,
      questionsInTest: [],
      counterCoreectAnswer: 0,
      completenessOfAnswers: 0,
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
    initial() {
      const config = this.setConfig();
      const id = `${this.$route.params.id}`;
      axios.get(`${BASE_API_URL}/results/${id}/`, config)
        .then((response) => {
          this.result = response.data;
          this.answeretQuestions = JSON.parse(this.result.answers);

          if (this.result.test.groups.length > 0) {
            for (let i = 0; i < this.result.test.groups.length; i += 1) {
              const groupInTest = this.result.test.groups[i];
              for (let j = 0; j < groupInTest.group.questions.length; j += 1) {
                this.questionsInTest.push({
                  id: groupInTest.id,
                  price: groupInTest.price,
                  question: groupInTest.group.questions[j],
                });
              }
            }
          } else {
            this.questionsInTest = this.result.test.questions;
          }

          this.parseAnswerQIT();
          this.addQITtoAnsweretQuestion();
          this.answersControl();
          this.summTotalPrice();
        });
    },
    summTotalPrice() {
      for (let i = 0; i < this.fullResults.length; i += 1) {
        this.totalPrice += this.fullResults[i].ball;
      }
    },
    parseAnswerQIT() {
      for (let i = 0; i < this.questionsInTest.length; i += 1) {
        const questionIT = this.questionsInTest[i];
        if (questionIT.question.qtype === 'checkbox') {
          const answerCheckbox = questionIT.question.answer;
          this.questionsInTest[i].question.answer = JSON.parse(answerCheckbox);
        }
      }
    },
    addQITtoAnsweretQuestion() {
      for (let i = 0; i < this.answeretQuestions.length; i += 1) {
        const answQ = this.answeretQuestions[i];
        for (let k = 0; k < this.questionsInTest.length; k += 1) {
          if (this.questionsInTest[k].question.id === answQ.question) {
            this.answeretQuestions[i].question = this.questionsInTest[k];
          }
        }
      }
    },
    answersControl() {
      for (let i = 0; i < this.answeretQuestions.length; i += 1) {
        const answerterQuestion = this.answeretQuestions[i];
        const answ = answerterQuestion.answer;
        const currentAnswer = answerterQuestion.question.question.answer;
        let answer = null;
        let cAnswer = null;
        let percent = 0;
        switch (answerterQuestion.question.question.qtype) {
          case 'input':
            [answer, cAnswer, percent] = this.controlInput(answ, currentAnswer);
            this.completenessOfAnswers += percent;
            this.pushToFullResults(
              answerterQuestion.question.question.question,
              answerterQuestion.question.question.qtype,
              answerterQuestion.question.price,
              answer,
              cAnswer,
            );
            break;
          case 'radio':
            [answer, cAnswer, percent] = this.controlRadio(answ, currentAnswer);
            this.completenessOfAnswers += percent;
            this.pushToFullResults(
              answerterQuestion.question.question.question,
              answerterQuestion.question.question.qtype,
              answerterQuestion.question.price,
              answer,
              cAnswer,
            );
            break;
          case 'checkbox':
            [answer, cAnswer, percent] = this.controlCheckbox(answ, currentAnswer);
            this.completenessOfAnswers += percent;
            this.pushToFullResults(
              answerterQuestion.question.question.question,
              answerterQuestion.question.question.qtype,
              Math.round(answerterQuestion.question.price * percent),
              answer,
              cAnswer,
            );
            break;
          default:
            console.log('Unexpected type of question');
        }
      }
    },
    pushToFullResults(q, t, price, ans, cAns) {
      const data = {
        question: q,
        qtype: t,
        ball: price,
        answer: ans,
        cAnswer: cAns,
      };
      this.fullResults.push(data);
    },
    controlInput(answer, currentAnswer) {
      if (answer.toLowerCase() === currentAnswer.toLowerCase()) {
        return [answer, currentAnswer, 1];
      }
      return [answer, currentAnswer, 0];
    },
    controlRadio(answer, currentAnswer) {
      if (answer === currentAnswer) {
        return [answer, currentAnswer, 1];
      }
      return [answer, currentAnswer, 0];
    },
    controlCheckbox(answer, currentAnswer) {
      const currentAnswersCounter = currentAnswer.length;
      let gutAnswerCounter = 0;
      const gutAnswerList = [];
      for (let i = 0; i < answer.length; i += 1) {
        for (let k = 0; k < currentAnswer.length; k += 1) {
          if (answer[i] === currentAnswer[k]) {
            gutAnswerCounter += 1;
            gutAnswerList.push(answer[i]);
          }
        }
      }
      const percent = gutAnswerCounter / currentAnswersCounter;
      return [answer, currentAnswer, percent];
    },
  },
  created() {
    this.initial();
  },
};
</script>

<style>

</style>
