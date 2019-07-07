<template>
  <div class="page-header">
    <div class="ui container secondary massive inverted menu">
      <nuxt-link tag="div" to="/" class="ui item" style="cursor: pointer">
        <i class="bullseye icon big" />
        <div class="content">
          <h1 class="ui header inverted">Eventrul</h1>
        </div>
      </nuxt-link>
      <div class="right menu">
        <a class="item" @click="$openServiceProviderModal()">
          Teenusepakkujale
        </a>
        <a class="item">
          Kontakt
        </a>
        <div class="item">
          <button class="ui button small primary">
            LOGI SISSE
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader'
}
</script>

<style lang="scss" scoped>
.page-header {
  height: 100px;
  position: relative;

  background-image: linear-gradient(
      to right,
      rgba(226, 139, 229, 0.6),
      rgba(114, 94, 255, 0.6),
      rgba(158, 243, 195, 0.6)
    ),
    url('~static/images/categories/places.jpg');
  background-position-x: left;
  background-position-y: center;
  background-size: cover;

  & > div {
    height: 100px !important;
  }
}
</style>
