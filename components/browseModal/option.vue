<template>
  <div class="ui horizontal fluid card">
    <div class="image" style="width: 250px">
      <img :src="data.image" style="height: 100%; object-fit: cover" />
    </div>
    <div class="content">
      <h3 class="header center aligned">{{ data.title }}</h3>
      <div class="ui basic segment center aligned big text">
        <p class="">{{ data.description }}</p>
      </div>
      <div class="ui centered grid">
        <div class="column centered">
          <div
            :id="`option_calendar_${data.id}`"
            class="ui calendar optionCalendar"
          >
            <div class="ui input left icon">
              <i class="calendar icon"></i>
              <input type="text" placeholder="KUUPÄEV" />
            </div>
          </div>
        </div>
        <div class="column centered">
          <div class="ui small statistic">
            <div class="value">{{ data.price }}€</div>
            <div class="label">
              HIND
            </div>
          </div>
        </div>
        <div class="column centered">
          <button
            class="ui green big button addToCart"
            @click="addToCart(data)"
          >
            Vali {{ data.title }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Option',
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'service'],
  beforeMount() {
    /* eslint-disable */
  },
  methods: {
    addToCart(option) {
      this.$store.commit('cart/add', {
        partner_service_id: this.service.id,
        service_option_id: option.id,
        service_title: this.service.title,
        partner_name: this.service.partner.name,
        option_title: option.title,
        // eslint-disable-next-line
        date: $('#option_calendar_' + option.id).calendar('get date'),
        price: option.price
      })

      this.$hideBrowseModal()
    }
  }
}
</script>

<style scoped></style>
