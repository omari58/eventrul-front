<template>
  <div class="ui right rail">
    <div class="ui sticky">
      <div class="ui attached segment">
        <h3 class="ui header">
          <i class="small shopping cart icon"></i>
          <div class="content">
            Valitud teenused |
            <button
              class="ui circular icon button"
              @click="$store.commit('cart/reset')"
            >
              <i class="icon trash"></i>
            </button>
          </div>
        </h3>
        <div class="ui middle aligned divided ordered list large">
          <div
            v-for="(item, index) in $store.state.cart.cart"
            :key="`cart-item-${index}`"
            class="item"
          >
            <div class="content">
              <div class="ui padded grid">
                <div class="middle aligned row">
                  <div class="thirteen wide column">
                    <div class="header">
                      <h4>
                        {{ item.option_title }} - {{ item.service_title }}
                      </h4>
                    </div>
                    <div class="meta">
                      <span
                        >{{ $moment(item.date).format('DD/MM/YYYY') }} |
                        {{ item.price }} €</span
                      >
                    </div>
                  </div>
                  <div class="three wide column">
                    <button
                      class="ui mini circular basic icon button"
                      @click="removeItem(index)"
                    >
                      <i class="red delete icon"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 class="ui center aligned header">{{ totalPrice }}€</h3>
      </div>
      <div
        class="ui positive bottom attached button"
        tabindex="0"
        @click="openConfirmModal()"
      >
        Vormista tellimus
      </div>
    </div>
    <div id="orderConfirmModal" class="ui modal">
      <i class="close icon"></i>
      <div class="header">
        Tellimuse kinnitus
      </div>
      <div class="ui basic segment big text">
        <p>
          Siia läheb krijeldus, mis saab edasi, kui tellimuse kinnitad
        </p>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          Tagasi
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideCart',
  computed: {
    totalPrice() {
      let totalPrice = 0
      for (const item of this.$store.state.cart.cart) {
        totalPrice += item.price
      }
      return totalPrice
    }
  },
  mounted() {
    /* eslint-disable */
    $('.ui.sticky').sticky({
      context: '#cartStickyTarget',
      offset: 50
    })
    $('#orderConfirmModal').modal({
      autofocus: false
    })
    /* eslint-enable */
  },
  methods: {
    removeItem(index) {
      this.$store.commit('cart/remove', index)
    },
    openConfirmModal() {
      /* eslint-disable */
      $('#orderConfirmModal').modal('show')
      /* eslint-enable */
    }
  }
}
</script>

<style scoped></style>
