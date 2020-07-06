<template>
  <div class="main">
    <main>
      <b-container class="bv-example-row px-0" style="max-width: 100%;">
        <router-view />
      </b-container>
    </main>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  data() {
    return {};
  },
};
</script>

<style scoped>

</style>
