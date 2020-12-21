<template>
  <nav class="api-doc-navbar item-center justify-space-between">
    <div class="item-center light" >
      <h2 class="nm light px-5">ASW API DOC</h2>
      <router-link to='/docs' class="light mx-2 bold"> Doc </router-link>
      <router-link to='/serverconfig' class="light bold"> Server Config </router-link>
    </div>
    <button class="mx-5 asw-success" @click="openModal = true">Register Your Server</button>
    <div class="asw-modal" v-if="openModal">
      <asw-form-modal
        title="Register Your Server"
        h="auto"
        w="500px"
        :save="true"
        :cancel="true"
        @cancel="openModal = false"
        @save="save"
      >
        <div class="m-3 py-2">
          <asw-input-box label="Server Name" sublabel=" " v-model="serverName" block/>
          <div class="flex justify-space-between py-3" >
            <asw-input-box label="Base Url" sublabel=' ' v-model="baseUrl" placeholder="127.0.0.1:8000"/>
            <asw-input-box label="Docs Path" sublabel=' ' v-model="docPath" placeholder="/v2/api-docs"/>
          </div>
          <span class=" item-center">
            <b>Doc Url: </b>
            {{baseUrl + docPath}}
            <asw-chips v-if="test === 1" class="bg-success m-1" size="10" text="Success"/>
            <asw-chips v-if="test === -1" class="bg-danger m-1" size="10" text="Failed"/>
          </span>
          <button class="asw-success-outline float-right" @click="testConnection" >Test</button>
        </div>
      </asw-form-modal>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'
import localStore from '@/utills/localstore.js'
export default {
  data () {
    return {
      openModal: false,
      serverName: '',
      baseUrl: '',
      docPath: '',
      test: 0,
      errorMsg: ''
    }
  },
  methods: {
    testConnection () {
      axios({
        baseURL: this.baseUrl,
        url: this.docPath
      }).then(() => { this.test = 1 })
        .catch((e) => { this.test = -1; this.errorMsg = e })
    },
    clear () {
      this.serverName = ''
      this.baseUrl = ''
      this.docPath = ''
    },
    close () {
      this.openModal = false
    },
    save () {
      localStore.createNew({
        serverName: this.serverName,
        baseUrl: this.baseUrl,
        url: this.docPath
      })
      this.clear()
      this.close()
      window.location.reload()
    }
  }
}
</script>

<style lang="scss">
.api-doc-navbar {
  height: 50px;
  background: $blue-4;

}
</style>
