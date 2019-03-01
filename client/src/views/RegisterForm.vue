<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <!-- <div class="container"> -->
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="columns is-vcentered">
              <div class="column is-half">
                <b-field>
                  <b-input
                    placeholder="Name"
                    type="text"
                    v-model="name"
                  ></b-input>
                </b-field>
                <b-field>
                  <b-input
                    placeholder="Email"
                    type="email"
                    v-model="email"
                  ></b-input>
                </b-field>
                <b-field>
                  <b-input
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  >
                  </b-input>
                </b-field>
                <b-field class="is-pulled-right">
                  <button
                    class="is-danger button"
                    @click.prevent="submitRegister"
                  >
                    Submit
                  </button>
                </b-field>
              </div>
              <div class="column is-half">
                <img src="./../assets/Asset 3.png" alt="register" />
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </section>
  </div>
</template>

<script>
import swal from 'sweetalert';
import guest from '@/api/underflowGuest';

export default {
  name: 'register',
  components: {},
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    submitRegister() {
      // console.log('masuk sini');
      guest({
        url: '/users/register',
        method: 'post',
        data: {
          name: this.name,
          email: this.email,
          password: this.password,
        },
      })
        .then(({ data }) => {
          swal('Welcome!', {
            button: true,
            icon: 'success',
            timer: 1750,
          });
          localStorage.setItem('token', data.token);
          localStorage.setItem('id', data.id);
          this.loginSuccess();
          this.clearForm();
          console.log(data.message);
          console.log(data.data);
          this.$router.push('/');
        })
        .catch(({ response }) => {
          console.log(response.data);
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
      this.name = '';
      this.email = '';
      this.password = '';
    },
  },
};
</script>
