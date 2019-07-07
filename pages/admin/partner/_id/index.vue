<template>
  <div class="ui basic segment">
    <div class="ui breadcrumb">
      <nuxt-link tag="a" to="/admin" class="section">Admin</nuxt-link>
      <div class="divider">/</div>
      <div class="active section">{{ partner.name }}</div>
    </div>
    <div class="ui divider"></div>
    <h3 class="ui header">Andmed</h3>
    <form class="ui form">
      <div class="field">
        <label>Nimi</label>
        <input v-model="partner.name" type="text" />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="partner.email" type="text" />
      </div>
      <div class="field">
        <label>Telefon</label>
        <input v-model="partner.phone" type="text" />
      </div>
      <div class="field">
        <label>Aadress</label>
        <input v-model="partner.address" type="text" />
      </div>
      <div class="field">
        <label>Facebook</label>
        <input v-model="partner.facebook" type="text" />
      </div>
      <div class="field">
        <label>Kirjeldus</label>
        <textarea v-model="partner.description"></textarea>
      </div>
      <button class="ui button">Salvesta</button>
    </form>
    <div class="ui divider"></div>
    <h3 class="ui header">Teenused</h3>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Kirjeldus</th>
          <th>Kategooria</th>
          <th>Piirkond</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in partner.services" :key="service.id">
          <td>{{ service.title }}</td>
          <td>{{ service.description }}</td>
          <td>{{ service.serviceCategory.name }}</td>
          <td>{{ service.location.name }}</td>
          <td class="collapsing">
            <nuxt-link
              tag="button"
              :to="`/admin/partner/${partner.id}/teenus/${service.id}`"
              class="ui small circular icon button"
            >
              <i class="ui zoom icon"></i>
            </nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Partner',
  data() {
    return {
      partner: []
    }
  },
  mounted() {
    this.getPartner()
  },
  methods: {
    async getPartner() {
      try {
        const { data } = await this.$axios.get(
          'api/partners/' + this.$route.params.id
        )

        this.partner = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
