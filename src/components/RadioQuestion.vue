<template>
  <b-row>
    <b-col>
      <b-jumbotron
        class="w-100 mx-auto py-3"
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

              <b-row class="mb-2" align-v="center">
                <b-col cols="2">
                  <p class="mb-0" for="answer"><b>Ответы</b></p>
                </b-col>
                <b-col>
                  <b-row
                    v-for="(radio, index) in radios"
                    align-v="center"
                    v-bind:key="index"
                    class="mb-1">
                    <b-col cols="1">
                      <input v-model="selected" :value="`${radio.value}`" type="radio">
                    </b-col>
                    <b-col>
                      <input
                        v-model="radio.value"
                        class="w-100"
                        type="text"
                        :placeholder="`Введите ответ № ${index + 1}`">
                    </b-col>
                  </b-row>
                  <div v-for="(radio, index) in radios" v-bind:key="index" class="mb-1">
                  </div>
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
                  <p v-if="noValid" class="mt-2 text-light">
                    * Заполните поля вопроса и (или) ответа
                  </p>
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
  name: 'InputQuestion',
  data() {
    return {
      form: {},
      img: '',
      selected: '',
      noValid: false,
      radios: [
        { value: '' },
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
    addAnswer() {
      this.radios.push({ value: '' });
    },
    delLastAnswer() {
      this.radios.pop();
    },
    onSubmit() {
      const formElemenst = this.$refs.form.elements;
      this.form.qtype = 'radio';
      this.form.question = formElemenst.question.value;
      this.form.variants = JSON.stringify(this.radios);
      this.form.answer = this.selected;
      this.form.img = this.img;

      for (let i = 0; i < this.radios.length; i += 1) {
        if (this.radios[i].value === '') {
          this.noValid = true;
          return;
        }
      }

      if (!this.form.question || !this.selected) {
        this.noValid = true;
      } else {
        this.noValid = false;
        const config = this.setConfig();
        axios.post(`${BASE_URL}/questions/`, this.form, config)
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
      const config = this.setConfig();
      config.headers['Content-Type'] = 'multipart/form-data';
      const image = this.$refs.loadImg.files[0];
      const data = new FormData();
      data.append('file', image);
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
</style>
