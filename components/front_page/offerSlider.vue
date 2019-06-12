<template>
  <div class="offer-slider--wrapper">
    <card v-for="offer in offers" :key="offer.id" :image="offer.image">
      <div class="content">
        <h3>{{ offer.title }}</h3>
        <p>{{ offer.content }}</p>
      </div>
      <template v-slot:footer>
        <div class="btn">Loe rohkem</div>
      </template>
    </card>
  </div>
</template>

<script>
export default {
  name: 'offerSlider',
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
  .btn {
    width: 10rem;
    height: 3rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background: white;
    border: 1px solid $grey;
    border-radius: 1rem;
    color: $dark;

    cursor: pointer;
  }
}
</style>
