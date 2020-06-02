<template>
  <b-row>
    <b-col>
      <b-jumbotron
        class="w-75 mx-auto py-3"
        bg-variant="info"
        border-variant="dark">

        <b-row>
          <!-- IMAGE -->
          <b-col cols="2">
            <b-row style="height: 148px;">
              <b-card
                class="w-100 h-100">
                <b-img
                class="w-100 h-100 m-0"
                v-if="img"
                :src="`${img}`"></b-img>
              </b-card>
              <input ref="loadImg" type="file" v-on:change="loadImgOnServer" name="img" hidden>
            </b-row>
            <b-row class="mt-1">
              <b-button @click="imgInputClick" class="w-100" variant="success">Загрузить</b-button>
            </b-row>
          </b-col>

          <!-- FORM -->
          <b-col class="mt-3">
            <b-form ref="form">
              <b-row class="mb-2" align-v="center">
                <b-col cols="2">
                  <label for="question"><b>Вопрос</b></label>
                </b-col>
                <b-col>
                  <b-form-textarea
                    id="question"
                    placeholder="Введите вопрос"
                    rows="1"></b-form-textarea>
                </b-col>
              </b-row>

              <b-row class="mb-2"  align-v="center">
                <b-col cols="2">
                  <p class="mb-0" for="answer"><b>Ответы</b></p>
                </b-col>
                <b-col>
                  <div v-for="(check, index) in checks" v-bind:key="index" class="mb-1">
                    <input v-model="selected" :value="`${check.value}`" type="checkbox">
                    <input
                    v-model="check.value"
                    class="ml-2 w-75"
                    type="text"
                    :placeholder="`Введите ответ № ${index + 1}`">
                  </div>
                  <p style="color: #eee;"><em>Не забудь выбрать верные варианты</em></p>
                </b-col>
              </b-row>

              <b-row class="mb-2"  align-v="center">
                <b-col cols="2">
                </b-col>
                <b-col>
                  <input
                    type="button"
                    class="btn btn-primary mt-2 btn-sm"
                    value="Добавить ответ"
                    @click="addAnswer">
                  <input
                    type="button"
                    class="btn btn-danger mt-2 ml-2 btn-sm"
                    value="Удалить последний"
                    @click="delLastAnswer">
                </b-col>
              </b-row>

              <b-row class="mb-2">
                <b-col cols="2">
                </b-col>
                <b-col>
                  <p v-if="noValid" class="mt-2 novalid">* Заполните поля вопроса и (или) ответа</p>
                </b-col>
                <b-col cols="3">
                  <b-button @click="onSubmit" class="ml-auto w-100 mt-2" variant="danger">
                    Создать
                  </b-button>
                </b-col>
              </b-row>

            </b-form>
          </b-col>
        </b-row>

      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

const BASE_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'CheckQuestion',
  data() {
    return {
      form: {},
      img: '',
      noValid: false,
      selected: [],
      checks: [
        { value: '' },
      ],
    };
  },
  methods: {
    addAnswer() {
      this.checks.push({ value: '' });
    },
    delLastAnswer() {
      this.checks.pop();
    },
    onSubmit() {
      const formElemenst = this.$refs.form.elements;
      this.form.qtype = 'checkbox';
      this.form.question = formElemenst.question.value;
      this.form.variants = JSON.stringify(this.checks);
      this.form.answer = JSON.stringify(this.selected);
      this.form.img = this.img;

      for (let i = 0; i < this.checks.length; i += 1) {
        if (this.checks[i].value === '') {
          this.noValid = true;
          return;
        }
      }

      if (!this.form.question || this.form.answer === '[]') {
        this.noValid = true;
      } else {
        this.noValid = false;
        axios.post(`${BASE_URL}/questions/`, this.form)
          .then((response) => {
            if (response.status === 201) {
              this.$emit('created');
              this.$emit('qClean', 'input');
            }
          });
      }
    },
    imgInputClick() {
      this.$refs.loadImg.click();
    },
    loadImgOnServer() {
      const image = this.$refs.loadImg.files[0];
      const data = new FormData();
      data.append('file', image);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      axios.post(`${BASE_URL}/images/`, data, config)
        .then((response) => {
          console.log(response);
          this.img = response.data.file;
        });
    },
  },
};
</script>

<style scoped>
.card-body {
  padding: 0;
}
.novalid {
  color: #C82333;
}
</style>
