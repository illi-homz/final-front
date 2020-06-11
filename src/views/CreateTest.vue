<template>
  <div class="home">
    <div>
      <b-jumbotron class="py-3 jbt" fluid>
        <template v-slot:header>
          <b-row class="text-center">
            <b-col>
              <h1><b>Создание теста</b></h1>
            </b-col>
          </b-row>
        </template>

        <template v-slot:lead>

          <b-row class="text-center">
            <b-col>
              <b-button @click="changeQ('questions')" class="mx-1" variant="success">
                Из отдельных вопросов
              </b-button>
              <b-button @click="changeQ('groups')" class="mx-1" variant="success">
                Из групп вопросов
              </b-button>
            </b-col>
          </b-row>
        </template>

        <hr class="my-4">

        <h4 v-if="created" class="text-center text-danger">Вопрос создан</h4>

        <component v-if="q" @qClean="changeQ(q)" :is="qestion"></component>

      </b-jumbotron>
    </div>
  </div>
</template>

<script>
import TestFromQuestions from '@/components/TestFromQuestions.vue';

export default {
  name: 'Home',
  data() {
    return {
      q: '',
      created: false,
    };
  },
  components: {
    TestFromQuestions,
  },
  methods: {
    changeQ(q) {
      if (this.q === q) {
        this.q = '';
      } else {
        this.q = q;
      }
    },
  },
  computed: {
    qestion() {
      return `test-from-${this.q}`;
    },
  },
};
</script>

<style scoped>
.jumbotron {
  height: calc(100vh - 56px);
  margin-bottom: 0;
}
</style>
