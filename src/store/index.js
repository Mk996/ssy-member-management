import Vue from 'vue'
import Vuex from 'vuex'
import firebaseCalls from '@/firebase/firebaseCalls'
import { TRANSACTION_TYPE } from '@/constant/constant'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLoading: false,
    memberList: [],
    transactionList: []
  },
  getters: {
    getShowLoading (state) {
      return state.showLoading
    },
    getMemberList (state) {
      return state.memberList
    },
    getTransactionList (state) {
      return state.transactionList
    }
  },
  mutations: {
    setShowLoading (state, value) {
      state.showLoading = value
    },
    setMemberList (state, value) {
      state.memberList = value
    },
    setTransactionList (state, value) {
      state.transactionList = value
    }
  },
  actions: {
    fetchAllMembers ({ commit }) {
      firebaseCalls.fetchAllMembers().then(response => {
        commit('setMemberList', response)
        commit('setShowLoading', false)
      })
    },
    fetchAllTransactions ({ commit }) {
      firebaseCalls.fetchAllTransactions().then(response => {
        commit('setTransactionList', response)
        commit('setShowLoading', false)
      })
    },
    recordPayment ({ commit, dispatch }, { recordPayment, callback }) {
      firebaseCalls.recordPaymentTransaction(recordPayment.members).then(_ => {
        dispatch('recordTransaction', { details: recordPayment, callback, type: TRANSACTION_TYPE.MEMBER_PAYMENT })
      })
    },
    initiateBenefit ({ commit, dispatch }, { benefit, callback }) {
      firebaseCalls.initiateBenefitTransaction(benefit.contributionAmount, benefit.member).then(_ => {
        dispatch('recordTransaction', { details: benefit, callback, type: TRANSACTION_TYPE.BENEFIT })
      })
    },
    recordTransaction ({ commit, dispatch }, { details, callback, type }) {
      firebaseCalls.transactionEntry(details, type).then(_ => {
        commit('setShowLoading', true)
        callback && callback()
        dispatch('fetchAllMembers')
      }).catch(err => {
        console.log(err)
      })
    }
  }
})
