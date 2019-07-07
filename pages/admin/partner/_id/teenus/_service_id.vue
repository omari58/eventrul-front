<template>
  <div class="ui basic segment">
    <div class="ui breadcrumb">
      <nuxt-link tag="a" to="/admin" class="section">Admin</nuxt-link>
      <div class="divider">/</div>
      <nuxt-link
        tag="a"
        :to="'/admin/partner/' + $route.params.id"
        class="section"
        >{{ service.partner.name }}</nuxt-link
      >
      <div class="divider">/</div>
      <div class="active section">{{ service.title }}</div>
    </div>
    <div class="ui divider"></div>
  </div>
</template>

<script>
export default {
  name: 'Teenus',
  data() {
    return {
      service: {}
    }
  },
  async asyncData({ params, $axios }) {
    try {
      // eslint-disable-next-line no-undef
      const { data } = await $axios.get(
        'api/partnerService/' + params.service_id
      )
      return { service: data[0] }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },
  methods: {
    async getService() {
      try {
        const { data } = await this.$axios.get(
          'api/partnerService/' + this.$route.params.service_id
        )
        this.service = data[0]
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
