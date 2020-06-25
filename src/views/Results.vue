<template>
  <div class="results">
    <p v-if="!result"> loading.....</p>
    <b-jumbotron
    class="w-75 mx-auto mt-2 py-3"
    border-variant="dark"
    v-else>
      <h1 class="text-center">{{ result.test.title }}</h1>
      <h4>Время и дата тестирования: {{ result.create_date | formatDateTime }}</h4>
      <h4>Всего вопросов: <b>{{ result.test.questions.length }}</b></h4>
      <h4>Полнота ответов: <b>{{
        (completenessOfAnswers / answeretQuestions.length * 100).toFixed(2)
        }}%</b></h4>
      <h4>Всего баллов: <b>{{ totalPrice }}</b></h4>
      <h4><b>Ваши ответы:</b></h4>
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
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080';

export default {
  name: 'Results',
  data() {
    return {
      result: null,
      fullResults: [],
      totalPrice: 0,
      answeretQuestions: null,
      questionsInTest: null,
      counterCoreectAnswer: 0,
      completenessOfAnswers: 0,
    };
  },
  methods: {
    initial() {
      const id = `${this.$route.params.id}`;
      axios.get(`${BASE_API_URL}/results/${id}/`)
        .then((response) => {
          this.result = response.data;
          this.answeretQuestions = JSON.parse(this.result.answers);
          this.questionsInTest = this.result.test.questions;
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
          if (this.questionsInTest[k].id === answQ.question) {
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
