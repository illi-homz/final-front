<template>
  <b-row>
    <b-col>
      <b-jumbotron
        class="w-75 mx-auto py-3"
        bg-variant="info"
        border-variant="dark">

        <b-form ref="form">
          <b-row align-v="center" class="mb-1">
            <b-col cols="3">
              Название теста
            </b-col>
            <b-col>
              <b-input
                v-model="title"
                id="answer"
                placeholder="Введите ответ"></b-input>
            </b-col>
          </b-row>

          <b-row align-v="center"  class="mb-1">
            <b-col cols="3">
              О тесте
            </b-col>
            <b-col>
              <b-form-textarea
                v-model="about"
                id="question"
                placeholder="Введите описание"
                rows="1"></b-form-textarea>
            </b-col>
          </b-row>

          <b-row align-v="center"  class="mb-1">
            <b-col cols="3">
              Дата начала
            </b-col>
            <b-col>
              <b-form-datepicker
                v-model="start_date"
                placeholder="Выберите дату начала тестирования"></b-form-datepicker>
            </b-col>
          </b-row>

          <b-row align-v="center"  class="mb-1">
            <b-col cols="3">
              Дата начала
            </b-col>
            <b-col>
              <b-form-datepicker
                v-model="end_date"
                placeholder="Выберите дату окончания тестирования"></b-form-datepicker>
            </b-col>
          </b-row>

          <b-row align-v="center"  class="mb-1">
            <b-col cols="3">
              Время на вопрос, сек
            </b-col>
            <b-col>
              <b-form-input
                v-model="time_on_question"
                type="number"
                placeholder="Введите число"></b-form-input>
            </b-col>
          </b-row>

          <b-row align-v="center" class="mb-1">
            <b-col cols="3">
              <p class="mb-0">Вопросы</p>
              <em style="font-size: 8pt;">
                (Выберите несколько попросов удерживая CTRL, укажите баллы за каждый вопрос)
              </em>
            </b-col>
            <b-col>
              <b-row v-for="qit in questionsInTest" v-bind:key="qit.id">
                <b-col>
                  <b-row align-v="center">
                    <b-col cols="9" class="pr-0">
                      <b-form-select
                        v-model="qit.question"
                        class="mb-2">
                        <b-form-select-option
                          v-for="q in questions"
                          v-bind:key="q.id"
                          :value="`${q.id}`">
                          {{ q.question }}
                        </b-form-select-option>
                      </b-form-select>
                    </b-col>
                    <b-col cols="2" class="pl-1">
                      <b-form-input
                        type="number"
                        style="width: 100%"
                        v-model="qit.price"
                        value="0"
                        class="mb-2">></b-form-input>
                    </b-col>
                    <b-col cols="1" class="mx-0 mb-2 px-0">
                      <b-button
                        class="q-del"
                        @click="delQuestion(qit.id)"
                        variant="danger"
                        pill
                        size="sm">X</b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-button variant="success">Button</b-button>
            </b-col>
          </b-row>

        </b-form>

      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

const BASE_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'TestFromQuestions',
  data() {
    return {
      title: '',
      about: '',
      start_date: '',
      end_date: '',
      time_on_question: '',
      selected: [],
      questions: [],
      questionsInTest: [
        {
          question: 'www',
          price: '5',
        },
      ],
      price: '',
    };
  },
  methods: {
    delQuestion(id) {
      this.questionsInTest.pop(id);
    },
  },
  mounted() {
    axios.get(`${BASE_URL}/questions/`)
      .then((response) => {
        this.questions = response.data;
      });
  },
};
</script>

<style>
</style>
