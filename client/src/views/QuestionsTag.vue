<template>
  <div style="margin-top: 10px;">
    <div v-if="isLoading">
      <Loading></Loading>
    </div>
    <div v-else class="columns has-background-white">
      <div class="column">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <p class="subtitle is-4">
                <strong>{{ $route.params.name }}</strong> Tag Question(s)
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
    <section v-if="!questions.length">
      Sorry Nothing found.
    </section>
    <section v-else>
    <QuestionBox v-for="(question) in questions"
      :question="question"
      :key="question._id">
    </QuestionBox>
    </section>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import swal from 'sweetalert';
import QuestionBox from '@/components/Question.vue';
import guest from '@/api/underflowGuest';
import user from '@/api/underflowUser';

export default {
  components: {
    Loading, QuestionBox,
  },
  data() {
    return {
    };
  },
  methods: {
    subscribeTag() {
      console.log(localStorage.getItem('token'))
      if (!this.isLogin) {
        swal('You have to be login first to post', {
          timer: 1750,
          button: true,
        });
      } else {
        this.$store.commit('loading', true);
        user({
          method: 'patch',
          url: `/users/tag/${this.$route.params.name}`,
        })
          .then(({ data }) => {
            // console.log(data.data)
            // console.log(data.message)
            if(data.message.includes('already')) {
              swal('you already subscribed this', {
                timer: 1750,
                button: false,
              });
            } else {
              swal('Subscribe Success', {
                timer: 1750,
                button: true,
                icon: 'success',
              });
            }
            this.$store.commit('loading', false);
            if(data.data) {
              this.$store.commit('loadUserTag', data.data.tags)
            }
          })
          .catch(({ response }) => {
            console.log(response.data);
            this.$store.commit('loading', false);
          });
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
      return this.$store.state.questionsByTag;
    },
  },
};
</script>
