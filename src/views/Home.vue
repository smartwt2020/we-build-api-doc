<template>
  <div class="home">
    <div class="container">
      <nav class="item-center justify-space-between">
        <h3>Select Your server</h3>
        <asw-input-select :options="ServerOptions"  v-model="serverName"/>
      </nav>
      <div v-if="!$store.state.getErrorInDocData">
        <nav class="item-center pb-2">
          <b>Base Path:</b>
          <span class="mx-1">{{baseUrl}}</span>
        </nav>
        <div class="apis-group" v-for="apis in $store.state.docData.api2" :key="apis.id">
          <div class="item-center np nm justify-space-between" @click="apis.open = !apis.open">
            <h3>{{apis.name}}</h3>
            <span>{{apis.description}}</span>
          </div>
          <div v-show="apis.open">
             <apicard class="my-1" v-for="i in apis.api" :key="i.id" :config="i" :baseUrl="baseUrl" />
          </div>
        </div>
      </div>
      <div v-else class=" l error-card">
        <h3 class="nm ">ERROR!</h3>
        <p class="l dark">{{ $store.state.errorMessage}}</p>
        <h4 class="dark">Server Config</h4>
        <asw-json-tree :data="serverConfig" />
      </div>
    </div>
  </div>
</template>

<script>
import localStore from '@/utills/localstore.js'
export default {
  name: 'Home',
  components: {
    apicard: () => import('../components/apicard')
  },
  data () {
    return {
      serverName: ''
    }
  },
  watch: {
    serverName (val) {
      if (val) {
        this.$router.push({ path: '/docs', query: { serverName: val } }, () => {})
        this.SetDocData(val)
      }
    }
  },
  computed: {
    ServerOptions () {
      return localStore.getServerList().map(e => e.serverName)
    },
    serverConfig () {
      return localStore.getServerList().find(e => e.serverName === this.serverName)
    },
    baseUrl () {
      return 'http://' + this.$store.state.docData.host + this.$store.state.docData.basePath
    }
  },
  methods: {
    SetDocData (serverName) {
      this.$store.dispatch('GetDocData', localStore.getServerList().find(e => e.serverName === serverName))
    }
  },
  mounted () {
    const route = this.$route
    const serverName = route.query.serverName
    if (serverName === undefined) {
      this.serverName = ''
    } else {
      this.serverName = serverName
      this.SetDocData(this.serverName)
    }
  }
}
</script>
