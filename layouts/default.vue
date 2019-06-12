<template>
  <div>
    <front-page-header />
    <div class="layout-container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import frontPageHeader from '~/components/headers/frontPageHeader'

export default {
  components: {
    frontPageHeader
  }
}
</script>

<style>
.layout-container {
  margin: 0 23rem;
}
</style>
