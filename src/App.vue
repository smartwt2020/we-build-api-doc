<template>
  <div id="app" class="asw">
    <navbar/>
    <router-view/>
  </div>
</template>
<script>
export default {
  components: {
    navbar: () => import('./components/navbar')
  }
}
</script>
<style lang="scss">
</style>
