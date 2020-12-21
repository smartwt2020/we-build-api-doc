import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/_variables.scss'
import './assets/scss/common.scss'
import aswEle from 'asw-ele2'
import 'asw-ele2/scss/index.scss'
Vue.use(aswEle)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
