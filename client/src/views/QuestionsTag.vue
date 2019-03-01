<template>
  <div style="margin-top: 10px;">
    <div v-if="isLoading">
      <Loading></Loading>
    </div>
    <div v-else class="columns has-background-white">
      <div class="column">
        <nav class="level">
          <!-- Left side -->
          <div class="level-left">
            <div class="level-item">
              <p class="subtitle is-4">
                <strong>{{ $route.params.tag }}</strong> Tag Question(s)
              </p>
            </div>
          </div>

          <div class="level-right">
            <p class="level-item">
              <a @click.prevent="subscribeTag" class="button is-danger is-size-7">Subscribe</a>
            </p>
          </div>
        </nav>
      </div>
    </div>
    <!-- component question v-for -->
    <QuestionBox v-for="(question) in questions"
      :question="question"
      :key="question._id">
    </QuestionBox>
    <!--  -->
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import swal from 'sweetalert';
import QuestionBox from '@/components/Question.vue';
import guest from '@/api/underflowGuest.js';

export default {
  components: {
    Loading, QuestionBox,
  },
  data() {
    return {
    }
  },
  methods: {
    subscribeTag() {
      if (!this.isLogin) {
        swal('You have to be login first to post', {
          timer: 1750,
          button: true,
        });
      } else {
        // this.$router.push('/post');
      }
    },
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
};
</script>
