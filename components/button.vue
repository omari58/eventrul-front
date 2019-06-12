<template>
    <div class="btn--wrapper" :style="btnStyle">
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'button',
    props: ['type'],
    computed: {
      btnStyle() {
        const types = {
          primary: {
            bg: "$primary",
            color: "white",
            border: "none"
          },
          warning: {
            bg: "$warning",
            color: "white",
            border: "none"
          },
          danger: {
            bg: "$danger",
            color: "white",
            border: "none"
          },
          default: {
            bg: "white",
            color: "$dark",
            border: "1px solid $grey"
          }
        }

        const sizes = {
          small: {
            height: "3rem",
            fontSize: "1.5rem"
          },
          medium: {
            height: "5rem",
            fontSize: "2rem"
          }
        }
      }
    }
  }
</script>

<style scoped>
 .btn--wrapper {
   border-radius: 1rem;
   min-width: 10rem;
 }
</style>
