<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

export default {
  name: 'App',
  computed: {
    layout() {
      return `${this.$route.meta.layout || 'main'}-layout`;
    },
  },
  components: {
    MainLayout,
    EmptyLayout,
  },
};
</script>
