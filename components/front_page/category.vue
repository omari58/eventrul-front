<template>
  <div class="wrapper">
    <div
      class="background-image"
      :style="{
        background: `url(${src})` + ' center',
        backgroundSize: '30rem',
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
  props: ['src', 'name']
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 9rem;
  width: 30rem;

  display: flex;
  justify-content: center;
  align-items: center;
  .background-image {
    height: 7rem;
    width: 100%;

    border-radius: 1rem;
    cursor: pointer;

    transition: height 0.25s ease-in-out;

    &:hover {
      height: 9rem;
    }

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
      font-size: 2.8rem;
      font-weight: 400;
      text-transform: uppercase;
      text-align: center;
    }
  }
}
</style>
