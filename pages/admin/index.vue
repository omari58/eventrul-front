<template>
  <div class="ui container">
    <div class="ui basic segment">
      <h3 class="ui header">Teenusepakkujad</h3>

      <table class="ui celled table">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Aadress</th>
            <th>Facebook</th>
            <th>Instagram</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="partner in partners" :key="partner.id">
            <td>{{ partner.name }}</td>
            <td>{{ partner.email }}</td>
            <td>{{ partner.phone }}</td>
            <td>{{ partner.address }}</td>
            <td>{{ partner.facebook }}</td>
            <td>{{ partner.instagram }}</td>
            <td class="collapsing">
              <nuxt-link
                tag="button"
                :to="`/admin/partner/${partner.id}`"
                class="ui button circular small icon"
              >
                <i class="ui zoom icon"></i>
              </nuxt-link>
              <button class="ui red button circular small icon">
                <i class="ui trash icon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminIndex',
  data() {
    return {
      partners: []
    }
  },
  mounted() {
    this.getPartners()
  },
  methods: {
    async getPartners() {
      try {
        const { data } = await this.$axios.get('api/partners')

        this.partners = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
