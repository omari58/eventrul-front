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
        <label>Instagram</label>
        <input v-model="partner.instagram" type="text" />
      </div>
      <div class="field">
        <label>Kirjeldus</label>
        <textarea v-model="partner.description"></textarea>
      </div>
      <button class="ui button" @click="submitPartnerEdit()" type="button">
        Salvesta
      </button>
    </form>
    <div class="ui divider"></div>
    <h3 class="ui header">Teenused</h3>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Pilt</th>
          <th>Nimi</th>
          <th>Kirjeldus</th>
          <th>Kategooria</th>
          <th>Piirkond</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in partner.services" :key="service.id">
          <td><img class="ui image" :src="service.image" /></td>
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
            <button
              class="ui red button circular small icon"
              @click="deleteService(service.id)"
            >
              <i class="ui trash icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="ui button" @click="showModal()">
      <i class="ui plus icon"></i> Lisa uus
    </button>
    <div id="newPartnerServiceModal" class="ui modal">
      <i class="close icon"></i>
      <div class="header">
        Lisa uus teenus
      </div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <label>Nimi</label>
            <input v-model="newService.title" type="text" />
          </div>
          <div class="field">
            <label>Kirjeldus</label>
            <textarea v-model="newService.description"></textarea>
          </div>
          <div class="field">
            <label>Kategooria</label>
            <select v-model="newService.service_category_id">
              <option
                v-for="item in categories"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</option
              >
            </select>
          </div>
          <div class="field">
            <label>Piirkond</label>
            <select v-model="newService.location_id">
              <option
                v-for="item in locations"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</option
              >
            </select>
          </div>
          <div class="field">
            <label>Pilt</label>
            <input v-model="newService.image" type="text" />
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          Tagasi
        </div>
        <button class="ui right green button" @click="submitService()">
          Salvesta
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Partner',
  data() {
    return {
      partner: {},
      categories: [],
      locations: [],
      newService: {
        service_category_id: 1,
        location_id: 1,
        title: '',
        description: '',
        image: ''
      }
    }
  },
  mounted() {
    this.getPartner()
    this.getCategories()
    this.getLocations()

    // eslint-disable-next-line no-undef
    $('#newPartnerServiceModal').modal()
  },
  methods: {
    showModal() {
      // eslint-disable-next-line no-undef
      $('#newPartnerServiceModal').modal('show')
    },
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
    },
    async getCategories() {
      try {
        const { data } = await this.$axios.get('api/serviceCategories')

        this.categories = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async getLocations() {
      try {
        const { data } = await this.$axios.get('api/locations')

        this.locations = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitPartnerEdit() {
      try {
        await this.$axios.put('api/partners/' + this.partner.id, {
          name: this.partner.name,
          email: this.partner.email,
          phone: this.partner.phone,
          address: this.partner.address,
          facebook: this.partner.facebook,
          instagram: this.partner.instagram,
          description: this.partner.description
        })

        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Partneri info on salvestatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Partneri infot ei salvestatud!`
        })
      }
    },
    async submitService() {
      try {
        await this.$axios.post('api/partnerServices', {
          partner_id: this.partner.id,
          service_category_id: this.newService.service_category_id,
          location_id: this.newService.location_id,
          title: this.newService.title,
          description: this.newService.description,
          image: this.newService.image
        })
        this.getPartner()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Teenuse info on salvestatud!`
        })
        // eslint-disable-next-line no-undef
        $('#newPartnerServiceModal').modal('hide')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Teenuse infot ei salvestatud!`
        })
      }
    },
    async deleteService(id) {
      try {
        await this.$axios.delete('api/partnerServices/' + id)
        this.getPartner()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Teenus kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Teenust ei kustutatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
