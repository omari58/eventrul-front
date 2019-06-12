<template>
  <div class="card--wrapper">
    <div
      class="card-header"
      :style="
        image
          ? {
              height: '20rem',
              background: `url(${image})` + ' center',
              backgroundSize: '31rem',
              backgroundPosition: 'center',
              borderRadius: '1rem 1rem 0 0'
            }
          : ''
      "
    >
      <slot name="header" />
    </div>
    <div class="card-content">
      <slot />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: ['image']
}
</script>

<style lang="scss" scoped>
.card--wrapper {
  width: 30rem;
  max-height: 50rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .card-header {
    width: 100%;
    max-height: 20rem;
  }

  .card-content {
    width: calc(100% - 4rem);
    min-height: 5rem;
    max-height: 25rem;
    padding: 1rem 2rem;
    border-left: 1px solid $grey;
    border-right: 1px solid $grey;

    overflow-y: auto;
  }

  .card-footer {
    width: calc(100% - 2rem);
    height: 3rem;
    padding: 1rem;
    border-left: 1px solid $grey;
    border-right: 1px solid $grey;
    border-bottom: 1px solid $grey;
    border-radius: 0 0 1rem 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
