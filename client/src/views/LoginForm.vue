<template>
    <div class="columns is-centered" style="margin-top: 1em;">
      <article class="card" v-if="loading">
        <Loading></Loading>
      </article>
      <article class="card" v-else>
        <div class="card-content">
          <h1 class="title">
            <img src="./../assets/nomad.jpg" alt="logo" width="300">
          </h1>
          <form @submit.prevent="submitLogin">
            <p class="control has-icon" style="margin: 1em;">
              <input class="input" type="email" placeholder="Email" v-model="email">
            </p>
            <p class="control has-icon" style="margin: 1em;">
              <input class="input" type="password" placeholder="Password" v-model="password">
            </p>
            <p class="control" style="margin: 1em;">
              <button type="submit" class="button is-danger is-medium is-fullwidth">
                <i class="fa fa-user"></i>
                Login
              </button>
            </p>
          </form>
        </div>
      </article>
    </div>
</template>

<script>
import swal from 'sweetalert';
import guest from '@/api/underflowGuest';
import Loading from '@/components/Loading.vue';

export default {
  name: 'login',
  components: {
    Loading,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    submitLogin() {
      this.$store.commit('loading', true);
      guest({
        url: '/users/login',
        method: 'post',
        data: {
          email: this.email,
          password: this.password,
        },
      })
        .then(({ data }) => {
          this.clearForm();
          swal('Welcome!', {
            button: true,
            timer: 1750,
            icon: 'success',
          });
          localStorage.setItem('token', data.token);
          localStorage.setItem('id', data.id);
          this.loginSuccess();
          this.$router.push('/');
          this.$store.commit('loading', false);
        })
        .catch(({ response }) => {
          this.$store.commit('loading', false);
          console.log(response.data.message);
          const warning = response.data.message || response.statusText;
          swal(warning, {
            timer: 1750,
            button: false,
          });
        });
    },
    loginSuccess() {
      this.$store.commit('loginSuccess');
    },
    clearForm() {
      this.email = '';
      this.password = '';
    },
  },
  computed: {
    loading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>
