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
                <strong>Hot</strong> Questions
              </p>
            </div>
          </div>

          <div class="level-right">
            <p class="level-item">
              <a @click.prevent="postQuestion" class="button is-danger is-size-7">Ask Question</a>
            </p>
          </div>
        </nav>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <article class="media order shadow delivered">
          <figure class="media-left">
              <p class="subtitle is-6">
                9,001 questions
              </p>
          </figure>
          <div class="media-content">
          </div>
          <div class="media-right">
              <div class="tags has-addons">
                <span class="tag is-dark is-size-7">Featured</span>
                <span class="tag is-light is-size-7">Answered</span>
              </div>
          </div>
      </article>
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

export default {
  components: {
    Loading, QuestionBox,
  },
  methods: {
    postQuestion() {
      if (!this.isLogin) {
        swal('You have to be login first to post', {
          timer: 1750,
          button: true,
        });
      } else {
        this.$router.push('/post');
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
    questions() {
      return this.$store.state.questions;
    },
  },
};
</script>
