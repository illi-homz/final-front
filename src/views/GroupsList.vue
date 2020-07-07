<template>
  <div class="group-in-test-list">
    <b-row>
      <b-col cols="11" xl="8" class="mx-auto">
        <b-row
          class="mt-2"
          v-for="(group, index) in groups"
          v-bind:key="index">
          <b-col>
            <p class="p-2 m-0 group">{{index + 1}}. {{ group.title }}</p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = process.env.VUE_APP_SERVER_URL;

export default {
  name: 'GroupsList',
  data() {
    return {
      groups: [],
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
    getGroups() {
      const config = this.setConfig();
      axios.get(`${BASE_API_URL}/group-questions/`, config)
        .then((response) => {
          this.groups = response.data;
        });
    },
  },
  mounted() {
    this.getGroups();
  },
};
</script>

<style>
.group {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
