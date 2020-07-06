<template>
  <div class="my-page">
    <b-row class="mt-2 px-3">
      <b-col cols="12" xl="9" class="mx-auto">
        <b-row>
          <b-col>
            <h2>{{ userData.username }}</h2>
            <p>Зарегистрирован: {{ userData.date_joined }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h2><b>Пройденные тесты:</b></h2>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card no-body header="Пройденные тесты:">
              <b-list-group flush>
                <b-list-group-item
                  v-for="(result, index) in results"
                  v-bind:key="index"
                  :to="`/results/${result.id}`">
                  {{ result.test.title }}
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'MyPage',
  data() {
    return {
      userData: '',
      results: '',
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
    getResults(id) {
      const config = this.setConfig();
      config.params = {
        user: id,
      };
      axios.get(`${BASE_API_URL}/results/`, config)
        .then((responce) => {
          this.results = responce.data;
        });
    },
  },
  mounted() {
    this.userData = this.$cookies.get('user_data');
    this.userData.date_joined = moment(new Date(this.userData.date_joined))
      .format('MM.DD.YYYY');
    this.getResults(this.userData.id);
  },
};
</script>

<style>

</style>
