<template>
  <div class="create-grop-questios">
    <b-row>
      <b-col cols="11" xl="8" class="mx-auto">
        <b-row class="mt-3 mx-auto text-center">
          <b-col>
            <h3><b>Создание группы вопросов</b></h3>
          </b-col>
        </b-row>
        <b-row v-if="testIsCreate" class="mt-3 w-75 mx-auto text-center text-success">
          <b-col>
            <h3><b>ГРУППА ВОПРОСОВ СОЗДАНА</b></h3>
          </b-col>
        </b-row>
        <b-jumbotron
          class="w-100 mx-auto mt-2 py-3"
          bg-variant="info"
          border-variant="dark">
          <b-row align-v="center" class="text-right mt-2">
            <b-col cols="3">Название группы</b-col>
            <b-col>
              <b-input
                v-model="groupTitle"
                id="answer"
                placeholder="Введите название группы вопросов"></b-input>
            </b-col>
          </b-row>

          <b-row align-v="center" class="text-right mt-1">
            <b-col cols="3">
              Выберите вопросы
            </b-col>
            <b-col>
              <b-row
                class="mb-1"
                align-v="center"
                v-for="(qig, index) in questionsInGroup"
                v-bind:key="index">
                <b-col>
                  <b-form-select
                    v-model="qig.question"
                    class="">
                    <b-form-select-option
                      v-for="q in questions"
                      v-bind:key="q.id"
                      :value="`${q.id}`">
                      {{ q.question }}
                    </b-form-select-option>
                  </b-form-select>
                </b-col>
                <b-col cols="1" class="pl-0">
                  <b-button
                  class="w-100"
                    @click="delQuestion(index)"
                    variant="danger"
                    size="sm">X</b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-row v-if="error">
            <b-col cols="9" class="ml-auto text-light">
              <p class="mb-1"><i>* Необходимо заполнить все поля</i></p>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="3"></b-col>
            <b-col>
              <b-row class="px-3">
                <b-button @click="addQuestion" variant="primary">
                  Добавить вопрос
                </b-button>
                <b-button class="ml-auto" @click="createGroup" variant="danger">
                  Создать
                </b-button>
              </b-row>
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
  name: 'CreateGroupQuestios',
  data() {
    return {
      groupTitle: '',
      questions: '',
      error: 0,
      testIsCreate: 0,
      questionsInGroup: [
        {
          question: 'placeholder',
        },
      ],
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
    createGroup() {
      if (this.questionsInGroup.length > 1) {
        for (let i = 0; i < this.questionsInGroup.length; i += 1) {
          if (this.questionsInGroup[i].question === 'placeholder') {
            this.questionsInGroup.splice(i, 1);
          }
        }
      }
      if (!this.groupTitle || !this.questionsInGroup) {
        this.error = 1;
        return undefined;
      }
      const data = {
        title: this.groupTitle,
        questions: [],
      };
      for (let i = 0; i < this.questionsInGroup.length; i += 1) {
        data.questions.push(this.questionsInGroup[i].question);
      }
      const config = this.setConfig();
      axios.post(`${BASE_API_URL}/group-questions/`, data, config)
        .then(() => {
          this.testIsCreate = 1;
          setTimeout(() => {
            this.testIsCreate = 0;
            this.groupTitle = '';
            this.questionsInGroup = [{ question: 'placeholder' }];
          }, 2000);
        });
      return 'hello';
    },
    getQuestions() {
      const config = this.setConfig();
      axios.get(`${BASE_API_URL}/questions/`, config)
        .then((response) => {
          this.questions = response.data;
          this.questions.push({
            id: 'placeholder',
            question: 'Выберите вопрос',
          });
        });
    },
    addQuestion() {
      this.questionsInGroup.push({
        question: 'placeholder',
      });
    },
    delQuestion(id) {
      if (this.questionsInGroup.length > 1) {
        this.questionsInGroup.splice(id, 1);
      }
    },
  },
  mounted() {
    this.getQuestions();
  },
};
</script>

<style>

</style>
