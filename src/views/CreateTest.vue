<template>
  <div class="home">
    <b-row>
      <b-col cols="11" xl="10" class="mx-auto">
        <b-row class="text-center mt-4">
          <b-col>
            <h1><b>Создание теста</b></h1>
          </b-col>
        </b-row>
        <b-row class="text-center mt-2">
          <b-col>
            <b-button @click="changeTest('questions')" class="mx-1" variant="success">
              Из отдельных вопросов
            </b-button>
            <b-button @click="changeTest('groups')" class="mx-1" variant="success">
              Из групп вопросов
            </b-button>
          </b-col>
        </b-row>
        <hr class="w-75">
        <h1 v-if="created" class="text-center text-danger">Тест создан</h1>

        <component v-if="t" @testClean="changeTest(t)" @created="ifCreated" :is="test">
        </component>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import TestFromQuestions from '@/components/TestFromQuestions.vue';
import TestFromGroups from '@/components/TestFromGroups.vue';

export default {
  name: 'Home',
  data() {
    return {
      t: '',
      created: false,
    };
  },
  components: {
    TestFromQuestions,
    TestFromGroups,
  },
  methods: {
    changeTest(t) {
      if (this.t === t) {
        this.t = '';
      } else {
        this.t = t;
      }
    },
    changeCreated() {
      this.created = !this.created;
    },
    ifCreated() {
      this.changeCreated();
      setTimeout(() => { this.changeCreated(); }, 2 * 1000);
    },
  },
  computed: {
    test() {
      return `test-from-${this.t}`;
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
