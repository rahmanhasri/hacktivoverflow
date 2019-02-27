<template>
  <div class="columns box">
    <div class="column">
      <article class="media order">
        <figure class="media-left">
            <div class="columns">
              <div class="column has-text-centered">
                <div>
                  <span>{{ question.votes.length }}</span>
                </div>
                <div>
                  <span>votes</span>
                </div>
              </div>
              <div class="column has-text-centered">
                <div>
                  <span>{{ question.answers.length }}</span>
                </div>
                <div>
                  <span>answer</span>
                </div>
              </div>
            </div>
        </figure>
        <div class="media-content">
          <div>
            <p class="has-text-info">
              <a @click.prevent="toDetail">{{ question.title }}</a>
            </p>
          </div>
          <div>
            <article class="media order">
              <figure class="media-left"><p class="is-size-7">
              Tag
              </p></figure>
              <div class="media-content"></div>
              <div class="media-right"><p class="is-size-7">
              by @{{question.userId.name}}. {{ displayDate }}
              </p></div>
            </article>
          </div>
        </div>
    </article>
    </div>
  </div>
</template>

<script>
import getDate from '@/helpers/getDate';

export default {
  name: 'questionBox',
  props: ['question'],
  data() {
    return {
      displayDate: getDate(this.question.created_at),
    };
  },
  methods: {
    toDetail() {
      this.$router.push(`/questions/${this.question._id}`);
    },
  },
};
</script>
