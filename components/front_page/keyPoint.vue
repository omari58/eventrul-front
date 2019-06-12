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
  width: 45rem;
  padding: 4rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon {
    font-size: 8rem;
    margin-bottom: 2rem;
    color: $grey;
  }

  .title {
    font-size: 2.8rem;
    font-weight: 600;
    margin-bottom: 2rem;
  }

  .content {
    font-size: 2rem;
    font-weight: 200;
    text-align: justify;
  }
}
</style>
