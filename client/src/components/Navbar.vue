<template>
  <nav class="navbar has-background-grey-darker">
    <div class="navbar-brand">
      <a class="navbar-item" @click.prevent="$router.push('/')">
        <p id="logo" class="is-size-3">
          underflow
        </p>
      </a>
    </div>

    <div id="navbarExampleTransparentExample" class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control" v-if="!isLogin">
              <a
                class="button is-outlined is-danger"
                @click.prevent="$router.push('/login')"
              >
                <span>login</span>
              </a>
            </p>
            <p class="control" v-if="!isLogin">
              <a
                class="button is-outlined is-danger"
                @click.prevent="$router.push('/register')"
              >
                <span>register</span>
              </a>
            </p>
            <p class="control" v-if="isLogin">
              <a class="button is-outlined is-danger" @click.prevent="logout">
                <span>Logout</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.badge {
  background-color: #6394f8;
  border-radius: 10px;
  color: white;
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  padding: 3px 7px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

#logo {
  color: #ff5959;
}

a.button span {
  color: #ff5959 !important;
}

p.control a.button span:hover {
  color: black !important;
}
</style>

<script>
import swal from 'sweetalert';

export default {
  name: 'navbar',
  mounted() {
    if (localStorage.getItem('token')) {
      this.$store.commit('loginSuccess');
      this.$store.dispatch('getUserTag')
    }
  },
  methods: {
    logout() {
      swal('Goodbye.', {
        icon: 'success',
        button: true,
        timer: 1750,
      });
      this.$store.commit('logout');
      this.$router.push('/');
    },
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  data() {
    return {};
  },
};
</script>
