<template>
  <div class="wrapper">
    <div
      class="background-image"
      :style="{
        background: `url(${src})` + ' center',
        backgroundSize: '100%',
        backgroundPosition: 'center'
      }"
    >
      <div class="mask">
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'category',
  props: ['src', 'name'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 5rem;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'serenity';

  .background-image {
    height: 100%;
    width: 100%;

    border-radius: 1rem;
    cursor: pointer;

    .mask {
      width: 100%;
      height: 100%;
      background-color: rgba(55, 55, 55, 0.6);
      border-radius: 1rem;

      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background-color: rgba(55, 55, 55, 0.4);
      }
    }

    span {
      color: white;
      font-size: 1.25rem;
      font-weight: 400;
      text-transform: uppercase;
      text-align: center;
    }
  }
}
</style>
