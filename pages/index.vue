<template>
  <div class="container">
    <front-page-header />

    <category name="Toitlustus" src="images/categories/food.jpg" />
  </div>
</template>

<script>
import frontPageHeader from '~/components/headers/frontPageHeader'
import category from '~/components/front_page/category'

export default {
  components: {
    frontPageHeader,
    category
  }
}
</script>

<style lang="scss"></style>
