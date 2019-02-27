<template>
  <section  class="section box">
    <article class="media order">
      <figure class="media-left">
        <div class="columns">
          <div class="column has-text-centered">
            <div>
              <a @click.prevent="voteAnswers(answer, 1)" class="has-text-info">
                <span class="mdi mdi-arrow-up-drop-circle-outline mdi-36px"></span>
              </a>
            </div>
            <div>
              <span>{{ voteCount() }}</span>
            </div>
            <div>
              <a @click.prevent="voteAnswers(answer, -1)" class="has-text-info">
                <span class="mdi mdi-arrow-down-drop-circle-outline mdi-36px"></span>
              </a>
            </div>
          </div>
        </div>
      </figure>
      <div class="media-content">
        <div class="level-item">
          <article class="media order">
            <div
              class="media-content" style="margin-left: 10px;">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dolor quod, dolorum eveniet possimus itaque,
              voluptatibus deserunt beatae iure minus expedita est aperiam maiores
              laborum cum consectetur minima, incidunt velit! Ab.
            <p v-html="answer.content"></p>
            </div>
          </article>
        </div>
        <footer>
          <article class="media order">
            <figure class="media-left">
              <p class="is-size-7" v-if="isAuthorize">
                <a @click.prevent="editAnswer()"
                  href="" class="button is-warning is-size-7">
                edit
                </a>
              </p>
            </figure>
            <div class="media-content">
              </div>
            <div class="media-right">
              <p class="is-size-7">
                by @{{ answer.userId.name }}. {{ displayDate(answer.created_at) }}
              </p>
            </div>
          </article>
        </footer>
      </div>
    </article>
  </section>
</template>

<script>
import getDate from '@/helpers/getDate';
import user from '@/api/underflowUser';

export default {
  name: 'answers',
  props: ['answer', 'index'],
  methods: {
    displayDate(date) {
      return getDate(date);
    },
    voteAnswers(obj, value) {
      this.$store.commit('loading', true);
      user({
        method: 'patch',
        url: `/answers/${obj._id}?vote=${value}`,
      })
        .then(({ data }) => {
          // this.data = {...data.data}
          // this.question = data.data;
          data.data.index = this.index;
          this.$store.commit('voteAnswer', data.data);
          this.$store.commit('loading', false);
        })
        .catch(({ response }) => {
          console.log(response);
          this.$store.commit('loading', false);
        });
    },
    editAnswer() {
      this.$store.commit('loading', true);
      this.answer.index = this.index;
      this.$emit('edit-answer', this.answer);
    },
    voteCount() {
      let total = 0;
      if (this.answer.votes.length) {
        this.answer.votes.forEach((vote) => {
          total += vote.status;
        });
      }
      return total;
    },
  },
  computed: {
    isAuthorize() {
      return this.answer.userId._id.toString() === localStorage.getItem('id');
    },
  },
};
</script>
