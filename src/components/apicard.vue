<template>
  <div class="apicard">
    <div class="apicard-summary flex justify-space-between" :class="config.method" @click="open = !open">
      <div class="item-center">
        <button class="s mx-4">{{config.method.toUpperCase()}}</button>
        <h4 class="np nm">{{config.urlPath}}</h4>
      </div>
      <div class="item-center mx-4">
        {{config.summary}}
      </div>
    </div>
    <div v-if="open" class="row np nm pb-3">
      <div class="col-md-6">
        <div class="flex my-2" v-if="config.tag.length">
          <span>Tag: </span>
          <asw-chips v-for="tag in config.tag" :key="tag.id" :text="tag" size="12" class="mx-2 bg-info"/>
        </div>
        <div class="item-center my-2" v-if="config.consumes.length" >
          <span>Consumes: </span>
          <small v-for="tag in config.consumes" :key="tag.id" class="mx-2">{{tag}}</small>
        </div>
        <div class="item-center my-2" v-if="config.produces.length">
          <span>Produces: </span>
          <small v-for="tag in config.produces" :key="tag.id" class="mx-2">{{tag}}</small>
        </div>
        <h4 class="my-2">Sample Response</h4>
        <div class="mx-2 ">
          <asw-json-tree :data="config.res" :depth="depth" />
        </div>
      </div>
      <div class="col-md-6">
         <div>
          <div class="item-center justify-space-between">
            <h4 class="my-2 np nm">Headers</h4>
            <h2 class="m-clk np nm" @click="AddHeader">+</h2>
          </div>
          <div class="mx-2 ">
            <div v-for="(head, index) in headers" :key="head.id" class="item-center s">
              <asw-input-box class="ml-2" v-model="head[0]" :label="index ? '' : 'Key'" sublabel=" " :disabled="!active"/>
              <asw-input-box class="ml-2" v-model="head[1]" :label="index ? '': 'Value'" sublabel=" " :disabled="!active"/>
              <button class="asw-alert s mt-3 ml-3" v-if="head[2]" @click="headers.splice(index, 1)" >Del</button>
            </div>
          </div>
        </div>
        <div v-if="config.path !== null">
          <h4 class="my-2">Path Parameter</h4>
          <div class="mx-2 ">
            <asw-input-box v-for="(value, key) in config.path" :key="key" v-model="path[key]" :label="key" :sublabel="value" :disabled="!active"/>
          </div>
        </div>
        <div v-if="config.query !== null">
          <h4 class="my-2">Path Query</h4>
          <div class="mx-2 ">
            <asw-input-box v-for="(value, key) in config.query" :key="key" v-model="query[key]" :label="key" :sublabel="value" :disabled="!active"/>
          </div>
        </div>
         <div v-if="config.body !== null">
          <h4 class="my-2">Request Body</h4>
          <div class="mx-2 ">
            <asw-json-tree :data="config.body" v-if="!active" />
            <asw-code v-model="body" v-else/>
          </div>
        </div>
        <div>
          <button v-if="active" class="asw-success-outline s float-right m-2" @click="Execute">Execute</button>
          <button class="asw-info-outline s m-2 float-right" @click="active = !active">{{ active ? 'Close': 'Try' }}</button>
        </div>
      </div>
    </div>
    <div v-if="open && resStatus > -1" class="apicard-divider">
      <div  v-if="resStatus === 0" class="flex justify-center">
        <asw-load-spin class="m-3" size="30" fill="gray" />
      </div>
      <div v-if="resStatus === 1" class="row m-2">
        <div class="col-md-12" >
          <div class="item-center justify-space-between">
            <h3>Response</h3>
            <span>{{resTime}}ms</span>
          </div>
        </div>
        <div class="col-md-6">
          <h4 class="my-2">Response Data</h4>
            <div class="mx-2 ">
              <asw-json-tree :data="resData.data" />
            </div>
        </div>
        <div class="col-md-6">
          <h4 class="my-2">Response Header</h4>
            <div class="mx-2 ">
              <asw-json-tree :data="resData.headers" />
            </div>
        </div>
      </div>
      <div v-if="resStatus === 2" class="row m-2">
        <div class="col-md-12" >
          <div class="item-center justify-space-between">
            <h3>Response</h3>
            <span>{{resTime}}ms</span>
          </div>
        </div>
        <div class="col-md-6">
          <h4 class="my-2">Response Data</h4>
            <div class="mx-2 ">
              <asw-json-tree :data="resError.data" />
            </div>
        </div>
        <div class="col-md-6">
          <h4 class="my-2">Response Header</h4>
            <div class="mx-2 ">
              <asw-json-tree :data="resError.headers" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { J2S, S2J } from '@/utills/typecast'
import axios from 'axios'
export default {
  props: {
    config: Object,
    baseUrl: String
  },
  components: {
    // vueJsonEditor
  },
  data () {
    return {
      open: false,
      depth: 5,
      active: false,
      body: '',
      query: {},
      path: {},
      headers: [],
      resStatus: -1,
      resData: {},
      resError: {},
      resTime: 0
    }
  },
  watch: {
    active (val) {
      if (val) {
        this.body = J2S(this.config.body, null, 1)
      }
    }
  },
  methods: {
    Execute () {
      this.resStatus = 0
      this.resTime = new Date().valueOf()
      let url = this.config.urlPath
      const method = this.config.method
      for (const key in this.path) {
        url = url.replace(`{${key}}`, this.path[key])
      }
      const config = {
        url: url,
        baseURL: this.baseUrl,
        params: this.query,
        method: method,
        headers: this.GetHeader(this.headers)
      }
      if (method !== 'get') {
        config.data = S2J(this.body)
      }
      axios(config).then(e => {
        this.resTime = new Date().valueOf() - this.resTime
        this.resStatus = 1
        this.resData = e
      }).catch(e => {
        this.resTime = new Date().valueOf() - this.resTime
        this.resStatus = 2
        this.resError = e.response
      })
    },
    AddHeader () {
      this.headers.push(['', '', 1])
    },
    GetHeader () {
      const obj = {}
      for (const head in this.headers) {
        const h = this.headers[head]
        if (h[0] !== '') {
          obj[h[0]] = h[1]
        }
      }
      return obj
    }
  },
  created () {
    this.body = J2S(this.config.body, null, 1)
    for (const key in this.config.path) {
      this.path[key] = ''
    }
    for (const key in this.config.query) {
      this.query[key] = ''
    }
    for (const head of this.config.header) {
      this.headers.push([head[0], '', 0])
    }
  }
}
</script>

<style lang="scss">
.apicard {
  box-shadow: 0px 0px 2px 0px #df9c9c;
  background: #f5f5f577;
  &-summary {
    height: 40px;
    button {
      width: 75px;
    }
  }
  &-divider {
    border-top: 1px solid gray;
  }
  &-summary.get {
    background: #c4fafd;
    button {
      background: #00bdc8;
    }
  }
  &-summary.post {
    background: #c0ffbe;
    button {
      background: #74b700;
    }
  }
  &-summary.put {
    background: #ffe5a8;
    button {
      background: #f5b000;
    }
  }
  &-summary.delete {
    background: #ffa3a3;
    button {
      background: #ff4143;
    }
  }
}
</style>
