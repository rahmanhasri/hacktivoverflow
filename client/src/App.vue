<template>
  <div id="app">
    <Navbar />
    <div class="columns" style="flex">
      <aside class="column is-2 aside hero is-fullheight" id="sidebar" style="height: 150vh;">
        <Sidebar />
      </aside>
      <div class="column is-7" style="height: 150vh;">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Sidebar, Navbar,
  },
  created() {
    this.$store.dispatch('getQuestions');
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Nanum+Gothic');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#logo {
  font-family: 'Nanum Gothic', sans-serif;
}

#sidebar {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

/* *:not(path):not(g) {
  color: hsla(210, 100%, 100%, 0.9) !important;
  background: hsla(210, 100%,  50%, 0.5) !important;
  outline: solid 0.25rem hsla(210, 100%, 100%, 0.5) !important;
  box-shadow: none !important;
} */
</style>
