import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ServerConfig from '../views/ServerConfig.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home2',
    component: Home
  },
  {
    path: '/docs',
    name: 'Home3',
    component: Home
  },
  {
    path: '/serverconfig',
    name: 'serverconfig',
    component: ServerConfig
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
