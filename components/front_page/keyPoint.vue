<template>
  <div class="wrapper">
    <div class="icon">
      <fa-icon :icon="icon" />
    </div>
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'keyPoint',
  props: ['title', 'icon', 'content']
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
