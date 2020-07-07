<template>
  <div class="edit-test">
    <b-row class="mt-2">
      <b-col cols="11" xl="9" class="mx-auto">
        <h1 v-if="success" class="text-center text-success">
          ИЗМЕНЕНИЯ ВНЕСЕНЫ
        </h1>
        <p v-if="!test">Loading ...</p>
        <b-jumbotron
          v-else
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
                  v-model="test.title"
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
                  v-model="test.about"
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
                  v-model="test.start_date"
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
                  v-model="test.end_date"
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
                  v-model="test.time_on_question"
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

            <b-row class="mb-1 my-2" align-v="center">
              <b-col cols="3">
                Изображение
              </b-col>
              <b-col>
                <b-row v-if="test.img">
                  <b-col>
                    <b-link :href="`${test.img}`">
                      <b-button variant="outline-light">
                        <b>{{ test.img }}</b>
                      </b-button>
                    </b-link>
                  </b-col>
                </b-row>
                <b-row class="mt-2">
                  <b-col>
                    <b-form-file v-model="image" plain></b-form-file>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mb-1">
              <b-col cols="3">
                <p class="mb-0">Вопросы</p>
              </b-col>
              <b-col>
                <h6 class="text-center">
                  Всего баллов за тест: {{ countTotalPrice }}
                </h6>

                <b-row v-if="test.questions">
                  <b-col>
                    <b-row
                      v-for="(qit, index) in test.questions"
                      v-bind:key="index">
                      <b-col>
                        <b-row align-v="center">
                          <b-col class="pr-0">
                            <p>Вопрос {{ index + 1 }}. {{ qit.question.question }}</p>
                          </b-col>
                          <b-col cols="3" class="pl-1">
                            <p>Баллов за вопрос: {{ qit.price }}</p>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row v-if="test.groups">
                  <b-col>
                    <b-row
                      v-for="(git, index) in test.groups"
                      v-bind:key="index">
                      <b-col>
                        <b-row
                          v-for="(q, i) in git.group.questions"
                          v-bind:key="i">
                          <b-col>
                            <b-row align-v="center">
                              <b-col class="pr-0">
                                <p>Группа {{ index + 1 }}. Вопрос {{ i + 1 }}. {{ q.question }}</p>
                              </b-col>
                              <b-col cols="3" class="pl-1">
                                <p>Баллов за вопрос: {{ git.price }}</p>
                              </b-col>
                            </b-row>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <b-row class="mt-2 mx-0">
                  <b-button class="ml-auto" @click="putchTest" variant="danger">
                    Отправить изменения
                  </b-button>
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

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'EditTest',
  data() {
    return {
      test: '',
      selectedUsers: [],
      users: [],
      totalPrice: 0,
      image: null,
      error: 0,
      dateError: 0,
      success: 0,
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
          for (let i = 0; i < this.test.tested_users.length; i += 1) {
            this.selectedUsers.push(this.test.tested_users[i].id);
          }
        });
    },
    getUsers() {
      const config = this.setConfig();
      axios.get(`${BASE_API_URL}/users/`, config)
        .then((response) => {
          for (let i = 0; i < response.data.length; i += 1) {
            this.users.push({
              value: response.data[i].id,
              text: response.data[i].username,
            });
          }
        });
    },
    putchTest() {
      if (
        !this.test.title
        || !this.test.about
        || !this.test.start_date
        || !this.test.end_date
        || !this.test.time_on_question
        // || !this.selectedUsers
        // || !this.questionsInTest
      ) {
        this.error = 1;
        return undefined;
      }
      const sd = new Date(this.test.start_date);
      const ed = new Date(this.test.end_date);

      if (sd > ed) {
        this.dateError = 1;
        return undefined;
      }
      const config = this.setConfig();
      const data = {
        id: this.test.id,
        title: this.test.title,
        about: this.test.about,
        start_date: this.test.start_date,
        end_date: this.test.end_date,
        time_on_question: this.test.time_on_question,
        img: this.test.img,
        tested_users: this.selectedUsers,
        questions: [],
        groups: [],
      };
      if (this.test.questions.length > 0) {
        for (let i = 0; i < this.test.questions.length; i += 1) {
          const ID = this.test.questions[i].id;
          data.questions.push(ID);
        }
      } else if (this.test.groups.length > 0) {
        for (let i = 0; i < this.test.groups.length; i += 1) {
          const ID = this.test.groups[i].id;
          data.groups.push(ID);
        }
      }
      if (this.image) {
        const configForImage = this.setConfig();
        configForImage.headers['Content-Type'] = 'multipart/form-data';
        const formData = new FormData();
        formData.append('file', this.image);
        axios.post(`${BASE_API_URL}/images/`, formData, configForImage)
          .then((r) => {
            data.img = r.data.file;

            axios.patch(`${BASE_API_URL}/tests/${data.id}/`, data, config)
              .then(() => {
                // console.log(response.data);
                this.success = 1;
                setTimeout(() => {
                  this.success = 0;
                  this.$router.replace(`/test-details/${this.test.id}`);
                }, 1000);
              });
          });
      } else {
        axios.patch(`${BASE_API_URL}/tests/${data.id}/`, data, config)
          .then(() => {
            // console.log(response.data);
            this.success = 1;
            setTimeout(() => {
              this.success = 0;
              this.$router.replace(`/test-details/${this.test.id}`);
            }, 1000);
          });
      }
      return 'Hello';
    },
  },
  computed: {
    countTotalPrice() {
      let totalPrice = 0;
      for (let i = 0; i < this.test.questions.length; i += 1) {
        totalPrice += this.test.questions[i].price;
      }
      for (let i = 0; i < this.test.groups.length; i += 1) {
        const countQuestions = this.test.groups[i].group.questions.length;
        totalPrice += this.test.groups[i].price * countQuestions;
      }
      return totalPrice;
    },
  },
  mounted() {
    this.getTest();
    this.getUsers();
  },
};
</script>

<style>

</style>
