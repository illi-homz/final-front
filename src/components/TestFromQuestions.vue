<template>
  <div class="test-from-questions">
    <b-row class="text-center">
      <b-col>
        <h3>Создание теста из отдельных вопросов</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" xl="10" class="mx-auto">
        <b-jumbotron
          class="w-100 mx-auto py-3"
          bg-variant="info"
          border-variant="dark">

          <b-form ref="form">
            <b-row class="mb-1">
              <b-col cols="3">
                Название теста
              </b-col>
              <b-col>
                <b-input
                  v-model="title"
                  id="answer"
                  placeholder="Введите название теста"></b-input>
                  <p class="my-0" v-if="error">
                    <em class="text-light">* Введите название теста</em>
                  </p>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                О тесте
              </b-col>
              <b-col>
                <b-form-textarea
                  v-model="about"
                  id="question"
                  placeholder="Введите описание"
                  rows="1"></b-form-textarea>
                  <p class="my-0" v-if="error">
                    <em class="text-light">* Введите описание теста</em>
                  </p>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                Дата начала
              </b-col>
              <b-col>
                <b-form-datepicker
                  v-model="start_date"
                  placeholder="Выберите дату начала тестирования"></b-form-datepicker>
                  <p class="my-0" v-if="error">
                    <em class="text-light">* Введите дату начала тестирования</em>
                  </p>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                Дата окончания
              </b-col>
              <b-col>
                <b-form-datepicker
                  v-model="end_date"
                  placeholder="Выберите дату окончания тестирования"></b-form-datepicker>
                  <p class="my-0" v-if="error">
                    <em class="text-light">* Введите дату окончания тестирования</em>
                  </p>
                  <p class="my-0" v-if="dateError">
                    <em class="text-light">* Дата окончания должна быть после даты начала</em>
                  </p>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                Время на вопрос, сек
              </b-col>
              <b-col>
                <b-form-input
                  v-model="time_on_question"
                  type="number"
                  placeholder="Введите число"></b-form-input>
                <p class="my-0" v-if="error">
                  <em class="text-light">* Введите время на вопрос</em>
                </p>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                Тестируемые <br>
                <em style="font-size: 8pt;">
                  (Выберите удерживая CTRL)
                </em>
              </b-col>
              <b-col>
                <b-form-select
                v-model="selectedUsers"
                :options="users"
                multiple
                :select-size="4"></b-form-select>
                <p class="my-0" v-if="error">
                  <em class="text-light">* Выберите пользователей</em>
                </p>
              </b-col>
            </b-row>

            <b-row class="mb-1" align-v="center">
              <b-col cols="3">
                Изображение
              </b-col>
              <b-col>
                <b-form-file v-model="image" plain></b-form-file>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                <p class="mb-0">Вопросы</p>
                <em style="font-size: 8pt;">
                  (Выберите вопросы, укажите баллы за каждый вопрос)
                </em>
              </b-col>
              <b-col>
                <h6 v-if="totalPrice" class="text-center">
                  Всего баллов за тест: {{ totalPrice }}
                </h6>
                <b-row v-for="(qit, index) in questionsInTest" v-bind:key="index">
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
                          class="mb-2"></b-form-input>
                      </b-col>
                      <b-col cols="1" class="mx-0 px-0">
                        <b-button
                          class="mb-2"
                          @click="delQuestion(index)"
                          variant="danger"
                          size="sm">X</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <p v-if="error" class="mx-0 mt-0 mb-1">
                  <em class="text-light">* Выберите вопросы</em>
                </p>
                <b-row>
                  <b-col>
                    <b-row>
                      <b-col>
                        <b-row class="px-3">
                          <b-button @click="addQuestion" variant="primary">
                            Добавить вопрос
                          </b-button>
                          <b-button class="ml-auto" @click="createTest" variant="danger">
                            Создать
                          </b-button>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

          </b-form>

        </b-jumbotron>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'TestFromQuestions',
  data() {
    return {
      // totalPrice: 0,
      title: '',
      about: '',
      start_date: '',
      end_date: '',
      time_on_question: '',
      selected: [],
      image: null,
      selectedUsers: [],
      questions: [],
      questionsInTest: [
        {
          question: 'placeholder',
          price: '0',
        },
      ],
      users: [],
      error: 0,
      dateError: 0,
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
    getQuestionsAndUsers() {
      const config = this.setConfig();
      axios.get(`${BASE_URL}/questions/`, config)
        .then((response) => {
          this.questions = response.data;
          this.questions.push({
            id: 'placeholder',
            question: 'Выберите вопрос',
          });
        });
      axios.get(`${BASE_URL}/users/`, config)
        .then((response) => {
          for (let i = 0; i < response.data.length; i += 1) {
            this.users.push({
              value: response.data[i].id,
              text: response.data[i].username,
            });
          }
        });
    },
    delQuestion(id) {
      if (this.questionsInTest.length > 1) {
        this.questionsInTest.splice(id, 1);
      }
    },
    addQuestion() {
      this.questionsInTest.push({
        question: 'placeholder',
        price: '0',
      });
    },
    createTest() {
      if (this.questionsInTest.length > 1) {
        for (let i = 0; i < this.questionsInTest.length; i += 1) {
          if (this.questionsInTest[i].question === 'placeholder') {
            this.questionsInTest.splice(i, 1);
          }
        }
      }
      if (
        !this.title
        || !this.about
        || !this.start_date
        || !this.end_date
        || !this.time_on_question
        || !this.selectedUsers
        || !this.questionsInTest
      ) {
        this.error = 1;
        return undefined;
      }

      const sd = new Date(this.start_date);
      const ed = new Date(this.end_date);

      if (sd > ed) {
        this.dateError = 1;
        return undefined;
      }

      const data = {
        title: this.title,
        about: this.about,
        start_date: this.start_date,
        end_date: this.end_date,
        time_on_question: this.time_on_question,
        questions: [],
        tested_users: this.selectedUsers,
        img: '',
      };

      const config = this.setConfig();

      const d = [];
      for (let i = 0; i < this.questionsInTest.length; i += 1) {
        d.push({
          question: this.questionsInTest[i].question,
          price: this.questionsInTest[i].price,
        });
      }

      axios.post(`${BASE_URL}/questions-in-tests/`, d, config)
        .then((response) => {
          for (let i = 0; i < response.data.length; i += 1) {
            data.questions.push(response.data[i].id);
          }

          if (this.image) {
            const formData = new FormData();
            formData.append('file', this.image);
            const conf = this.setConfig();
            conf.headers['Content-Type'] = 'multipart/form-data';
            axios.post(`${BASE_URL}/images/`, formData, conf)
              .then((r) => {
                data.img = r.data.file;

                axios.post(`${BASE_URL}/tests/`, data, config)
                  .then((resp) => {
                    if (resp.status === 201) {
                      this.$emit('created');
                      this.$emit('testClean', 'test');
                    } else {
                      this.error = 1;
                    }
                  });
              });
          } else {
            axios.post(`${BASE_URL}/tests/`, data, config)
              .then((resp) => {
                if (resp.status === 201) {
                  this.$emit('created');
                  this.$emit('testClean', 'test');
                } else {
                  this.error = 1;
                }
              });
          }
        });
      return 'hello';
    },
  },
  computed: {
    totalPrice() {
      let total = 0;
      for (let i = 0; i < this.questionsInTest.length; i += 1) {
        total += Number(this.questionsInTest[i].price);
      }
      return total;
    },
  },
  mounted() {
    this.getQuestionsAndUsers();
  },
};
</script>

<style>
</style>
