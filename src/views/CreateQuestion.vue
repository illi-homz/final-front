<template>
  <div class="home">
    <div>
      <b-jumbotron class="py-3 jbt" fluid>
        <template v-slot:header>
          <b-row class="text-center">
            <b-col>
              <h1><b>Создание вопроса</b></h1>
            </b-col>
          </b-row>
        </template>

        <template v-slot:lead>

          <b-row class="text-center">
            <b-col>
              <b-button @click="changeQ('input')" class="mx-1" variant="success">
                С полем для ввода
              </b-button>
              <b-button @click="changeQ('check')" class="mx-1" variant="success">
                Несколько вариантов
              </b-button>
              <b-button @click="changeQ('radio')" class="mx-1" variant="success">
                Один из нескольких
              </b-button>
            </b-col>
          </b-row>
        </template>

        <hr class="my-4">

        <h4 v-if="created" class="text-center text-danger">Вопрос создан</h4>

        <component v-if="q" @qClean="changeQ(q)" @created="ifCreated" :is="qestion"></component>

      </b-jumbotron>
    </div>
  </div>
</template>

<script>
import InputQuestion from '@/components/InputQuestion.vue';
import CheckQuestion from '@/components/CheckQuestion.vue';
import RadioQuestion from '@/components/RadioQuestion.vue';

export default {
  name: 'Home',
  data() {
    return {
      q: '',
      created: false,
    };
  },
  components: {
    InputQuestion, CheckQuestion, RadioQuestion,
  },
  methods: {
    changeQ(q) {
      if (this.q === q) {
        this.q = '';
      } else {
        this.q = q;
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
    qestion() {
      return `${this.q}-question`;
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
