import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import formatter from '@/utills/ServerDocToLocal.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverDoc: '',
    docData: {},
    hasDocData: false,
    currentServer: '',
    getErrorInDocData: false,
    errorMessage: ''
  },
  mutations: {
    SetError (state, data) {
      state.getErrorInDocData = true
      state.hasDocData = false
      state.errorMessage = data
      state.docData = []
    },
    SetDocData (state, data) {
      state.serverDoc = data
      state.docData = formatter.init(data)
      state.hasDocData = true
      state.getErrorInDocData = false
    }
  },
  actions: {
    GetDocData ({ commit }, ServerConfig) {
      if (ServerConfig === undefined) {
        commit('SetError', 'please select server')
      } else {
        axios({
          baseURL: ServerConfig.baseUrl,
          url: ServerConfig.url
        }).then((e) => { commit('SetDocData', e.data) })
          .catch((e) => { commit('SetError', e) })
      }
    }
  },
  modules: {
  }
})
