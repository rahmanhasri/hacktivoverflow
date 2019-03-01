<template>
  <form @submit.prevent="submitQuestion" class style="margin: 1em;">
    <!-- <p class="subtitle is-4">Ask a Question</p> -->
    <div class="field" v-if="editor === 'question'">
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Question Title"
          v-model="title"
        />
      </div>
    </div>
    <div class="field">
      <vue-editor v-model="content" :editorToolbar="customToolbar"></vue-editor>
    </div>
    <div class="field" v-if="editor === 'question'">
      <vue-tags-input
        v-model="tag"
        :tags="tags"
        @tags-changed="newTags => (tags = newTags)"
      />
    </div>
    <div class="field">
      <!-- update question -->
      <button
        @click.prevent="editQuestion"
        class="is-medium button is-warning"
        v-if="edit && editor === 'question'"
      >
        Edit Question
      </button>
      <!-- update answer -->
      <button
        @click.prevent="editAnswer"
        class="is-medium button"
        v-else-if="edit && editor === 'answer'"
      >
        Edit Answer
      </button>
      <!-- submit question -->
      <button
        @click.prevent="submitQuestion"
        class="is-medium button is-danger"
        v-else-if="editor === 'question'"
      >
        Submit
      </button>
      <!-- submit answer -->
      <button
        @click.prevent="submitAnswer"
        class="is-medium button is-success"
        v-else
      >
        Submit
      </button>
      <button @click.prevent="dismissEditor" class="is-medium button is-link">
        Dismiss
      </button>
    </div>
  </form>
</template>

<script>
import swal from 'sweetalert';
import { VueEditor } from 'vue2-editor';
import user from '@/api/underflowUser';
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'form-component',
  components: {
    VueTagsInput,
    VueEditor,
  },
  props: ['edit-post', 'editor', 'edit'],
  data() {
    return {
      title: this.editPost.title || '',
      content: this.editPost.content || '',
      tag: '',
      tags: [],
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['code-block'],
      ],
    };
  },
  methods: {
    clearForm() {
      this.title = '';
      this.content = '';
      this.tags = [];
      this.tag = '';
    },
    dismissEditor() {
      this.$emit('dismiss');
    },
    submitQuestion() {
      // console.log(this.title, this.content)
      if (this.title.length < 10) {
        swal('Minimum title must be 10 character', {
          timer: 1750,
          button: true,
        });
      } else if (this.content.length < 20) {
        swal('Minimum content must be 20 character', {
          timer: 1750,
          button: true,
        });
      } else {
        const input = {
          title: this.title,
          content: this.content,
          tags: this.tags,
        };
        this.$store.commit('loading', true);
        user({
          method: 'post',
          url: '/questions',
          data: input,
        })
          .then(({ data }) => {
            console.log(data.data);
            // this.$store.commit('addQuestion', data.data);
            this.$store.commit('loading', false);
            swal('Your question submitted', {
              timer: 1750,
              button: false,
            });
            this.clearForm();
            this.$router.push('/');
          })
          .catch(({ response }) => {
            console.log(response);
            this.$store.commit('loading', false);
          });
      }
    },
    submitAnswer() {
      // console.log(this.$route.params.id)
      if (this.content.length < 20) {
        swal('Minimum content must be 20 character', {
          timer: 1750,
          button: true,
        });
      } else {
        this.$store.commit('loading', true);
        user({
          method: 'post',
          url: `/answers/${this.$route.params.id}`,
          data: { content: this.content },
        })
          .then(({ data }) => {
            console.log(data.data);
            this.$store.commit('pushAnswer', data.data);
            this.$store.commit('loading', false);
            swal('success', {
              timer: 1750,
              button: false,
            });
            this.clearForm();
          })
          .catch(({ response }) => {
            console.log(response);
            this.$store.commit('loading', false);
          });
      }
    },
    editQuestion() {
      const id = this.$store.state.questionDetail._id;
      if (this.content.length < 20) {
        swal(
          'Minimum content is 20 characters & minimum title is 10 characters',
          {
            timer: 1750,
            button: true,
          },
        );
      } else {
        this.$store.commit('loading', true);
        user({
          method: 'put',
          url: `/questions/${id}`,
          data: {
            title: this.title,
            content: this.content,
            tags: this.tags,
          },
        })
          .then(({ data }) => {
            this.$store.commit('updateQuestion', data.data);
            this.$store.commit('loading', false);
            swal('successfully edited question', {
              timer: 1750,
              button: false,
            });
            this.clearForm();
          })
          .catch(({ response }) => {
            // console.log(response.data);
            this.$store.commit('loading', false);
            const warning = response.data.message || response.statusText;
            swal(warning, {
              timer: 1750,
              button: false,
            });
          });
      }
    },
    editAnswer() {
      if (this.content.length < 20) {
        swal('Minimum content must be 20 character', {
          timer: 1750,
          button: true,
        });
      } else {
        this.$store.commit('loading', true);
        user({
          method: 'put',
          url: `/answers/${this.editPost._id}`,
          data: { content: this.content },
        })
          .then(({ data }) => {
            this.$store.commit('loading', false);
            swal('successfully edited answer', {
              timer: 1750,
              button: false,
            });
            data.data.index = this.editPost.index;
            this.$store.commit('updateAnswer', data.data);
          })
          .catch(({ response }) => {
            this.$store.commit('loading', false);
            console.log(response.data);
          });
      }
    },
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
};
</script>
