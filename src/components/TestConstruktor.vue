<template>
  <b-container>
    <div class="testTitle">
      <b-row align-v="center">
        <b-col sm="6" class="tileLable">
          <label :for="datestart">Дата начала тестирования:</label>
        </b-col>
        <b-col sm="5">
          <b-form-input v-model="datestart" :id="datestart" :type="`date`"></b-form-input>
        </b-col>
      </b-row>
      <b-row align-v="center">
        <b-col sm="6" class="tileLable">
          <label :for="dateend">Дата окончания:</label>
        </b-col>
        <b-col sm="5">
          <b-form-input v-model="dateend" :id="dateend" :type="`date`"></b-form-input>
        </b-col>
      </b-row><b-row align-v="center">
        <b-col sm="6" class="tileLable">
          <label :for="timetest">Время на прохождение теста:</label>
        </b-col>
        <b-col sm="5">
          <b-form-input v-model="timetest" :id="timetest" :type="`time`"></b-form-input>
        </b-col>
      </b-row>
    </div>
    <div v-for="element in elements" :key="element.id">
      <div class="question" v-if="element.type == 'input'">
        <b-col align-h="center">
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="delElement(element.id)">
            <span aria-hidden="true">&#10008;</span>
          </button>
          <h4><b>Вопрос {{element.id}}</b></h4>
        </b-col>
        <b-row>
          <b-col>
            <div class="image">
              <b-img
                v-if="element.img"
                :src="`${element.img}`"
                fluid
                alt="Responsive image"></b-img>
              <b-form-file
                v-else
                v-model="element.img"
                plain
                accept=".jpg, .png, .gif"></b-form-file>
            </div>
          </b-col>
          <b-col cols="10">
            <b-col>
              <b-form-input
                v-if="element.show"
                v-model="element.question"
                @blur="element.show = false; $emit('update')"
                @keyup.enter="element.show=false; $emit('update')"
                placeholder="Введите вопрос"></b-form-input>
              <h5 v-else @click="element.show = true;">{{element.question}}</h5>
              <b-form-input v-model="element.answer" placeholder="Введите ответ"></b-form-input>
            </b-col>
            <b-row align-h="end" align-v="center">
              <b-col cols="5">Цена вопроса, баллов:</b-col>
              <b-col cols="2">
                <b-form-input
                class="inputPrice"
                v-model="element.price"
                placeholder="0"></b-form-input>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>

      <div class="question" v-else-if="element.type == 'checkbox'">
        <b-col>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="delElement(element.id)">
            <span aria-hidden="true">&#10008;</span>
          </button>
          <h4><b>Вопрос {{element.id}}</b></h4>
          <b-form-input
            v-if="element.show"
            v-model="element.question"
            @blur="element.show = false; $emit('update')"
            @keyup.enter="element.show=false; $emit('update')"
            placeholder="Введите вопрос"></b-form-input>
          <h5 v-else @click="element.show = true;">{{element.question}}</h5>

          <b-row class="ckeckbox">
            <b-form-checkbox-group
              v-model="element.selected"
              :options="element.options"
              stacked
            ></b-form-checkbox-group>

            <b-col>
              <input
                ref="inputAddOptionCheckbox"
                type="hidden"
                placeholder="Введите вариант ответа"
                @keyup.enter="addOptionCheckbox(element.id); $emit('update')">
              <div ref="addOptionCheckbox">
                <a
                  href="#"
                  class="addOptionCheckbox"
                  @click="showOptionInputCheckbox">&#128736; Добавить</a>
                <a
                  href="#"
                  v-if="element.options[0]"
                  class="deloption"
                  @click="delOption(element.id)">&#128465; Удалить</a>
              </div>
            </b-col>
          </b-row>

        </b-col>
        <b-row align-h="end" align-v="center">
          <b-col cols="5">Цена вопроса, баллов:</b-col>
          <b-col cols="2">
            <b-form-input
            class="inputPrice"
            v-model="element.price"
            placeholder="0"></b-form-input>
          </b-col>
        </b-row>
      </div>

      <div class="question" v-else-if="element.type == 'radio'">
        <b-col>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="delElement(element.id)">
            <span aria-hidden="true">&#10008;</span>
          </button>
          <h4><b>Вопрос {{element.id}}</b></h4>
          <b-form-input
            v-if="element.show"
            v-model="element.question"
            @blur="element.show = false; $emit('update')"
            @keyup.enter="element.show=false; $emit('update')"
            placeholder="Введите вопрос"></b-form-input>
          <h5 v-else @click="element.show = true;">{{element.question}}</h5>

          <b-row class="ckeckbox">
            <b-form-radio-group
              v-model="element.selected"
              :options="element.options"
              stacked
            ></b-form-radio-group>

            <b-col>
              <input
                ref="inputAddOptionRadio"
                type="hidden"
                placeholder="Введите вариант ответа"
                @keyup.enter="addOptionRadio(element.id); $emit('update')">
              <div ref="addOptionRadio">
                <a
                  href="#"
                  class="addOption"
                  @click="showOptionInputRadio">&#128736; Добавить</a>
                <a
                  href="#"
                  v-if="element.options[0]"
                  class="deloption"
                  @click="delOption(element.id)">&#128465; Удалить</a>
              </div>
            </b-col>
          </b-row>

        </b-col>
        <b-row align-h="end" align-v="center">
          <b-col cols="5">Цена вопроса, баллов:</b-col>
          <b-col cols="2">
            <b-form-input
            class="inputPrice"
            v-model="element.price"
            placeholder="0"></b-form-input>
          </b-col>
        </b-row>
      </div>
    </div>

      <b-button variant="primary" @click="addInput">Add input</b-button>
      <b-button variant="primary" @click="addCheckbox">Add checkbox</b-button>
      <b-button variant="primary" @click="addRadio">Add radio</b-button>
      <b-button type="reset" variant="danger" @click="reset">Reset</b-button>
      <b-button @click="showAny">Show</b-button>
  </b-container>
</template>

<script>

export default {
  name: 'TestConstruktor',
  data() {
    return {
      datestart: '',
      dateend: '',
      timetest: '',
      elements: [],
    };
  },
  methods: {
    addInput() {
      this.elements.push({
        id: this.elements.length + 1,
        type: 'input',
        question: '',
        answer: '',
        price: '',
        img: 'http://127.0.0.1:8000/media/images/06.jpg',
        show: true,
      });
    },
    addCheckbox() {
      this.elements.push({
        id: this.elements.length + 1,
        type: 'checkbox',
        question: '',
        options: [],
        selected: [],
        price: '',
        show: true,
      });
    },
    addRadio() {
      this.elements.push({
        id: this.elements.length + 1,
        type: 'radio',
        question: '',
        options: [],
        selected: '',
        price: '',
        show: true,
      });
    },
    showOptionInputCheckbox() {
      this.$refs.addOptionCheckbox[0].hidden = true;
      this.$refs.inputAddOptionCheckbox[0].type = 'display';
    },
    addOptionCheckbox(id) {
      const option = {
        text: this.$refs.inputAddOptionCheckbox[0].value,
        value: this.$refs.inputAddOptionCheckbox[0].value.toLowerCase(),
      };
      this.elements[id - 1].options.push(option);
      this.$refs.inputAddOptionCheckbox[0].value = '';
      this.$refs.addOptionCheckbox[0].hidden = false;
      this.$refs.inputAddOptionCheckbox[0].type = 'hidden';
    },
    showOptionInputRadio() {
      this.$refs.addOptionRadio[0].hidden = true;
      this.$refs.inputAddOptionRadio[0].type = 'display';
    },
    addOptionRadio(id) {
      const option = {
        text: this.$refs.inputAddOptionRadio[0].value,
        value: this.elements[id - 1].options.length,
      };
      this.elements[id - 1].options.push(option);
      this.$refs.inputAddOptionRadio[0].value = '';
      this.$refs.addOptionRadio[0].hidden = false;
      this.$refs.inputAddOptionRadio[0].type = 'hidden';
    },
    delOption(id) {
      this.elements[id - 1].options.pop();
    },
    delElement(id) {
      this.$delete(this.elements, id - 1);
      for (let i = 0; i < this.elements.length; i += 1) {
        this.elements[i].id = i + 1;
      }
    },
    reset() {
      this.elements = [];
    },
    showAny() {
      console.log(this.elements[0].img);
    },
  },
};
</script>

<style scoped>
.col {
  padding: 0;
}
.testTitle {
  padding: 4px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 60%;
}
.testTitle div {
  margin: 2px;
}
.testTitle .tileLable {
  text-align: end;
}
.testTitle label {
  margin: 0;
}
.question {
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 5px;
  width: 60%;
}
.question p {
  margin: 0;
  padding: 0;
}
.question * {
  margin: 5px 0;
}
.ckeckbox div {
  width: 100%;
  text-align: left;
}
.addOption {
  text-decoration: none;
}
.deloption {
  text-decoration: none;
  color: red;
  margin-left: 5px;
}
.deloption:hover {
  color: darkred;
}
.image {
  width: 100vw;
  height: 100vh;
  max-width: 100px;
  max-height: 133px;
  border: 1px solid black;
}
.image img {
  width: 100%;
}
.inputPrice {
  height: 30px;
  padding: 3px 6px;
  text-align: center;
}
button {
  margin: 0 5px;
}
</style>
