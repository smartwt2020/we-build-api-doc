<template>
  <div class="container">
    <div class="flex align-center justify-space-between">
      <h3>Saved Server</h3>
      <div class="flex">
        <input type="file" class="m-1" @change="onFileChange"/>
        <button class="asw-info-outline" @click="downloadConfig">Downlaod All Config</button>
      </div>
    </div>
    <div class="server" v-for="(server,i) in config" :key="server.id" >
      <div class="server-name">{{server.serverName}}</div>
      <div class="server-path">{{server.baseUrl + server.url}}</div>
      <div class="server-button ">
        <button class="mt-2 mx-2 s asw-danger-outline" @click="Delete(i)">Delete</button>
        <button class="mt-2 s asw-info-outline" @click="Edit(i)">Edit</button>
      </div>
    </div>
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
  </div>
</template>

<script>
import axios from 'axios'
import localStore from '@/utills/localstore.js'
export default {
  data () {
    return {
      config: '',
      openModal: false,
      serverName: '',
      baseUrl: '',
      docPath: '',
      index: -1,
      test: 0
    }
  },
  methods: {
    onFileChange (e) {
      const file = e.target.files
      console.log(file)
      if (file.length) {
        if (file[0].type === 'application/json') {
          const reader = new FileReader()
          reader.onload = (e) => {
            console.log(e.target.result)
            try {
              this.config = [...this.config, ...JSON.parse(e.target.result)]
              localStore.saveAllServer(this.config)
              this.config = localStore.getAllServer()
            } catch {
              console.log(e)
              alert(e)
            }
          }
          reader.readAsText(file[0], 'UTF-8')
        } else {
          alert(file[0].name + 'is Not Json file')
        }
      }
    },
    downloadConfig () {
      var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.config, null, 2))
      var downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', 'server-config.json')
      document.body.appendChild(downloadAnchorNode) // required for firefox
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    },
    testConnection () {
      axios({
        baseURL: this.baseUrl,
        url: this.docPath
      }).then(() => { this.test = 1 })
        .catch((e) => { this.test = -1; this.errorMsg = e })
    },
    Edit (i) {
      this.index = i
      const server = this.config[i]
      this.serverName = server.serverName
      this.baseUrl = server.baseUrl
      this.docPath = server.url
      this.openModal = true
      this.test = 0
    },
    save () {
      const i = this.index
      this.config[i].serverName = this.serverName
      this.config[i].baseUrl = this.baseUrl
      this.config[i].url = this.docPath
      localStore.saveAllServer(this.config)
      this.config = localStore.getAllServer()
      this.test = 0
      this.serverName = ''
      this.baseUrl = ''
      this.docPath = ''
      this.openModal = false
      localStore.saveAllServer(this.config)
      this.config = localStore.getAllServer()
    },
    Delete (i) {
      this.config.splice(i, 1)
      localStore.saveAllServer(this.config)
      this.config = localStore.getAllServer()
    }
  },
  mounted () {
    this.config = localStore.getAllServer()
  }
}
</script>

<style lang="scss">
.server {
  padding: 10px 15px;
  background: #f2feff;
  margin: 10px 0px;
  border: 1px solid #5dd8e3;
  border-radius: 5px;
  &-name {
    padding: 4px 0px;
    font-size: 20px;
    font-weight: bold;
    color: gray;
  }
  &-button {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
