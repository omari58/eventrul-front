<template>
  <div
    class="wrapper"
    :style="{
      background: `url(${src})` + ' center',
      backgroundSize: '25rem',
      backgroundPosition: 'center'
    }"
  >
    <span>{{ name }}</span>
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
  height: 10rem;
  width: 25rem;

  border-radius: 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: white;
    font-size: 2.8rem;
    font-weight: 400;
    text-transform: uppercase;
    text-align: center;
  }
}
</style>
