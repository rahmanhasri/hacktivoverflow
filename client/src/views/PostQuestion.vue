<template>
  <!-- <div class="container is-centered"> -->
  <div class="columns is-centered">
    <div class="column">
      <FormComponent :edit-post="{}" :editor="'question'"></FormComponent>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import FormComponent from '@/components/Form.vue';

export default {
  name: 'post',
  components: {
    FormComponent,
  },
  mounted() {
    if (!this.isLogin) {
      this.$router.push('/');
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
};
</script>
