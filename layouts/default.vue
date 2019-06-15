<template>
  <div class="page--wrapper">
    <page-header />
    <nuxt />
    <page-footer />
  </div>
</template>

<script>
import pageHeader from '~/components/pageHeader'
import pageFooter from '~/components/pageFooter'
export default {
  components: {
    pageFooter,
    pageHeader
  }
}
</script>

<style lang="scss" scoped>
.page--wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
