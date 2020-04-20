import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLoading: false
  },
  getters: {
    getShowLoading (state) {
      return state.showLoading
    }
  },
  mutations: {
    setShowLoading (state, value) {
      state.showLoading = value
    }
  }
})
