<template>
  <div class="offer-slider--wrapper">
    <card v-for="offer in offers" :key="offer.id" :image="offer.image">
      <div class="content">
        <h3>{{ offer.title }}</h3>
        <p>{{ offer.content }}</p>
      </div>
      <template v-slot:footer>
        <f-btn size="small">Loe edasi</f-btn>
      </template>
    </card>
  </div>
</template>

<script>
export default {
  name: 'OfferSlider',
  props: ['offers']
}
</script>

<style lang="scss" scoped>
.offer-slider--wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .content {
    font-size: 1.6rem;
    font-weight: 300;
    text-align: justify;

    h3 {
      text-align: center;
    }
  }
}
</style>
