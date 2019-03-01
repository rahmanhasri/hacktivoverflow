<template>
  <div>
    <article v-if="isLoading">
      <Loading></Loading>
    </article>
    <article v-else>
      <section class="section box">
        <article class="media order">
          <figure class="media-left">
            <div class="columns">
              <div class="column has-text-centered">
                <div>
                  <a
                    @click.prevent="voteThis(question, 1)"
                    class="has-text-info"
                  >
                    <span
                      class="mdi mdi-arrow-up-drop-circle-outline mdi-36px"
                    ></span>
                  </a>
                </div>
                <div>
                  <span v-if="question.votes">{{ voteCount() }}</span>
                </div>
                <div>
                  <a
                    @click.prevent="voteThis(question, -1)"
                    class="has-text-info"
                  >
                    <span
                      class="mdi mdi-arrow-down-drop-circle-outline mdi-36px"
                    ></span>
                  </a>
                </div>
              </div>
            </div>
          </figure>
          <div class="media-content">
            <div>
              <p class="has-text-info">{{ question.title }}</p>
            </div>
            <div class="level-item">
              <article class="media order">
                <div class="media-content" style="margin-left: 10px;">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                  quod, dolorum eveniet possimus itaque, voluptatibus deserunt
                  beatae iure minus expedita est aperiam maiores laborum cum
                  consectetur minima, incidunt velit! Ab.
                  <p v-html="question.content"></p>
                  <footer>
                    <b-tag
                      type="is-warning"
                      v-for="(tag, index) in question.tags"
                      :key="index"
                    >
                      <a @click.prevent="seeTag(tag._id, tag.name)">{{ tag.name }}</a>
                    </b-tag>
                  </footer>
                </div>
              </article>
            </div>
            <footer>
              <article class="media order">
                <figure class="media-left" v-if="question.userId">
                  <p class="is-size-7" v-if="isAuthorize">
                    <a
                      @click.prevent="editQuestion"
                      href=""
                      class="button is-warning is-size-7"
                    >
                      edit
                    </a>
                    <a
                      @click.prevent="deleteQuestion"
                      href=""
                      class="button is-danger is-size-7"
                    >
                      delete
                    </a>
                  </p>
                </figure>
                <div class="media-content"></div>
                <div class="media-right">
                  <p class="is-size-7" v-if="question.userId">
                    by @{{ question.userId.name }}.
                    {{ displayDate(question.created_at) }}
                  </p>
                </div>
              </article>
            </footer>
          </div>
        </article>
      </section>
      <div class="columns">
        <div class="column has-background-grey-white-ter">
          <p v-if="question.answers" class="is-pulled-left is-size-4">
            <strong> {{ question.answers.length }} Answers </strong>
          </p>
        </div>
        <div class="column">
          <a
            @click.prevent="postAnswer"
            class="button is-success is-size-7 is-pulled-right"
          >
            Give Answer
          </a>
        </div>
      </div>
    </article>
    <article v-if="editor">
      <FormComponent
        @dismiss="dismiss"
        :editor="editor"
        :edit-post="editPost"
        :edit="edit"
      >
      </FormComponent>
    </article>
    <article>
      <AnswerBox
        v-for="(answer, index) in question.answers"
        :key="answer._id"
        :answer="answer"
        :index="index"
        @edit-answer="editAnswer($event)"
      >
      </AnswerBox>
    </article>
    <footer>
      <a href="" @click.prevent="scrollUp"
        ><i class="fas fa-chevron-up fa-3x"></i
      ></a>
    </footer>
  </div>
</template>

<script>
import guest from '@/api/underflowGuest';
import getDate from '@/helpers/getDate';
import user from '@/api/underflowUser';
import Loading from '@/components/Loading.vue';
import AnswerBox from '@/components/AnswerBox.vue';
import FormComponent from '@/components/Form.vue';
import swal from 'sweetalert';

export default {
  name: 'questionDetail',
  components: {
    Loading,
    AnswerBox,
    FormComponent,
  },
  created() {
    // console.log(this.$route.params.id)
    this.$store.commit('loading', true);
    guest({
      method: 'get',
      url: `/questions/${this.$route.params.id}`,
    })
      .then(({ data }) => {
        if (!data.data) {
          console.log(data.message, 'not found');
          this.$router.push('/');
        } else {
          // this.question = data.data;
          // this.answers = data.data.answers;
          console.log(data.data);
          this.$store.commit('loadDetail', data.data);
          this.$store.commit('loading', false);
        }
      })
      .catch(({ response }) => {
        console.log(response.data.message);
        this.$router.push('/');
        this.$store.commit('loading', false);
      });
  },
  methods: {
    displayDate(date) {
      return getDate(date);
    },
    voteCount() {
      let total = 0;
      // console.log(this.question.votes,'==============')
      if (this.question.votes.length) {
        this.question.votes.forEach((vote) => {
          total += vote.status;
        });
      }
      return total;
    },
    dismiss() {
      this.editor = false;
      this.edit = false;
      this.editPost = {};
    },
    voteThis(obj, value) {
      this.$store.commit('loading', true);
      user({
        method: 'patch',
        url: `/questions/${obj._id}?vote=${value}`,
      })
        .then(({ data }) => {
          // this.data = {...data.data}
          this.question.votes = data.data.votes;
          this.$store.commit('loading', false);
          // console.log(data.data);
        })
        .catch(({ response }) => {
          console.log(response);
          this.$store.commit('loading', false);
        });
    },
    postAnswer() {
      this.editor = 'answer';
      this.edit = false;
    },
    editAnswer(answer) {
      this.editor = 'answer';
      this.edit = true;
      // this.editPost.content = answer.content;
      this.editPost = answer;
      this.$store.commit('loading', false);
    },
    editQuestion() {
      this.editor = 'question';
      this.editPost.title = this.question.title;
      this.editPost.content = this.question.content;
      this.editPost.tags = this.question.tags;
      this.edit = true;
    },
    deleteQuestion() {
      swal({
        title: 'Are you sure?',
        buttons: true,
      }).then((result) => {
        if (result) {
          console.log(this.question._id)
          this.$store.commit('loading', true);
          user({
            method: 'delete',
            url: `/questions/${this.question._id}`,
          })
            .then(({ data }) => {
              swal(data.message, {
                timer: 1750,
                button: false,
              });
              this.$store.commit('deleteQuestion', this.question._id);
              this.$store.commit('loading', false);
              this.$router.replace('/');
            })
            .catch(({ response }) => {
              this.$store.commit('loading', false);
              console.log(response.data);
              const warning = response.data.message || response.statusText;
              swal(warning, {
                timer: 1750,
                button: false,
              });
            });
        }
      });
    },
    seeTag(id, name) {
      this.$store.dispatch('getQuestionsTag', id);
      this.$router.push(`/tag/${name}`);
    },
    scrollUp() {
      window.scrollBy(0, -3000);
    },
  },
  data() {
    return {
      edit: false,
      editor: false,
      editPost: {},
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
    question() {
      return this.$store.state.questionDetail;
    },
    isAuthorize() {
      return this.question.userId._id.toString() === localStorage.getItem('id');
    },
  },
};
</script>
