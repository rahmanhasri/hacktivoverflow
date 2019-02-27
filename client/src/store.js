import Vue from 'vue';
import Vuex from 'vuex';
import guest from '@/api/underflowGuest';
// import user from '@/api/underflowUser';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    isLoading: false,
    questions: [],
    questionDetail: {},
  },
  mutations: {
    loginSuccess(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
      localStorage.clear();
    },
    loading(state, value) {
      state.isLoading = value;
    },
    addQuestion(state, value) {
      state.questions.unshift(value);
    },
    loadQuestions(state, value) {
      state.questions = value;
    },
    loadDetail(state, value) {
      state.questionDetail = value;
    },
    pushAnswer(state, value) {
      state.questionDetail.answers.push(value);
    },
    voteAnswer(state, updatedAnswer) {
      console.log(updatedAnswer.index);
      state.questionDetail.answers.splice(updatedAnswer.index, 1, updatedAnswer);
    },
    updateQuestion(state, updatedQuestion) {
      state.questionDetail.title = updatedQuestion.title;
      state.questionDetail.content = updatedQuestion.content;
      state.questionDetail.tags = updatedQuestion.tags;
    },
    updateAnswer(state, updatedAnswer) {
      state.questionDetail.answers.splice(updatedAnswer.index, 1, updatedAnswer);
    },
    deleteQuestion(state, id) {
      console.log(typeof state.questions[0]._id)
      // const index = state.questions.findIndex(question => question._id == id);
      // if (index !== -1) {
      //   state.questions.splice(index, 1);
      // }
    },
  },
  actions: {
    getQuestions({ commit }) {
      commit('loading', true);
      guest({
        method: 'get',
        url: '/questions',
      })
        .then(({ data }) => {
          commit('loading', false);
          commit('loadQuestions', data.data);
          console.log(data.data);
        })
        .catch((error) => {
          commit('loading', false);
          console.error('ERR: ', error.message);
        });
    },
  },
});
