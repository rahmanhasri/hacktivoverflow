<template>
  <router-view></router-view>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  mounted() {
    this.$store.dispatch('getQuestions');
  },
  components: {
  },
};
</script>
