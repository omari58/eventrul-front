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
              <button
                class="ui red button circular small icon"
                @click="deletePartner(partner.id)"
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

      <div class="ui divider"></div>

      <h3 class="ui header">Kategooriad</h3>

      <table class="ui celled table">
        <thead>
          <tr>
            <th>Pilt</th>
            <th>Nimi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td class="collapsing">
              <img class="ui small image" :src="item.image" />
            </td>
            <td>{{ item.name }}</td>
            <td class="collapsing">
              <button
                class="ui red button circular small icon"
                @click="deleteCategory(item.id)"
              >
                <i class="ui trash icon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <form v-if="newCategory !== false" class="ui form">
        <div class="field">
          <label>Nimi</label>
          <input v-model="newCategory.name" type="text" />
        </div>
        <div class="field">
          <label>Pilt</label>
          <input v-model="newCategory.image" type="text" />
        </div>
        <button class="ui green button" @click="submitCategory()" type="button">
          <i class="ui plus icon"></i> Salvesta
        </button>
        <button
          class="ui black button"
          @click="newCategory = false"
          type="button"
        >
          <i class="ui close icon"></i> Tagasi
        </button>
      </form>

      <button
        v-if="newCategory === false"
        class="ui button"
        @click="newCategory = { image: '', name: '' }"
      >
        <i class="ui plus icon"></i> Lisa uus
      </button>

      <div class="ui divider"></div>

      <h3 class="ui header">Piirkonnad</h3>

      <table class="ui celled table">
        <thead>
          <tr>
            <th>Nimi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in locations" :key="item.id">
            <td>{{ item.name }}</td>
            <td class="collapsing">
              <button
                class="ui red button circular small icon"
                @click="deleteLocation(item.id)"
              >
                <i class="ui trash icon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <form v-if="newLocation !== false" class="ui form">
        <div class="field">
          <label>Uus piirkond</label>
          <input v-model="newLocation" type="text" />
        </div>
        <button class="ui green button" @click="submitLocation()" type="button">
          <i class="ui plus icon"></i> Salvesta
        </button>
        <button
          class="ui black button"
          @click="newLocation = false"
          type="button"
        >
          <i class="ui close icon"></i> Tagasi
        </button>
      </form>

      <button
        v-if="newLocation === false"
        class="ui button"
        @click="newLocation = ''"
      >
        <i class="ui plus icon"></i> Lisa uus
      </button>

      <div id="newPartnerModal" class="ui modal">
        <i class="close icon"></i>
        <div class="header">
          Lisa uus partner
        </div>
        <div class="content">
          <form class="ui form">
            <div class="field">
              <label>Nimi</label>
              <input v-model="newPartner.name" type="text" />
            </div>
            <div class="field">
              <label>Email</label>
              <input v-model="newPartner.email" type="text" />
            </div>
            <div class="field">
              <label>Telefon</label>
              <input v-model="newPartner.phone" type="text" />
            </div>
            <div class="field">
              <label>Aadress</label>
              <input v-model="newPartner.address" type="text" />
            </div>
            <div class="field">
              <label>Facebook</label>
              <input v-model="newPartner.facebook" type="text" />
            </div>
            <div class="field">
              <label>Instagram</label>
              <input v-model="newPartner.instagram" type="text" />
            </div>
            <div class="field">
              <label>Kirjeldus</label>
              <textarea v-model="newPartner.description"></textarea>
            </div>
          </form>
        </div>
        <div class="actions">
          <div class="ui black deny button">
            Tagasi
          </div>
          <button class="ui right button" @click="submitPartner()">
            Salvesta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminIndex',
  data() {
    return {
      partners: [],
      newPartner: {
        name: '',
        email: '',
        phone: '',
        address: '',
        facebook: '',
        instagram: '',
        description: ''
      },
      categories: [],
      locations: [],
      newCategory: false,
      newLocation: false
    }
  },
  computed: {
    formValid() {
      return (
        this.newPartner.name !== '' &&
        this.newPartner.email !== '' &&
        this.newPartner.phone !== '' &&
        this.newPartner.address !== '' &&
        this.newPartner.facebook !== '' &&
        this.newPartner.instagram !== '' &&
        this.newPartner.description !== ''
      )
    }
  },
  mounted() {
    this.getPartners()
    this.getCategories()
    this.getLocations()
    /* eslint-disable */
    $('#newPartnerModal').modal()
    /* eslint-enable */
  },
  methods: {
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
    async getPartners() {
      try {
        const { data } = await this.$axios.get('api/partners')

        this.partners = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    showModal() {
      /* eslint-disable */
      $('#newPartnerModal').modal('show')
      /* eslint-enable */
    },
    async submitPartner() {
      try {
        if (this.formValid) {
          await this.$axios.post('api/partners', this.newPartner)
          this.getPartners()
          // eslint-disable-next-line no-undef
          $('#newPartnerModal').modal('hide')
          // eslint-disable-next-line no-undef
          $('body').toast({
            class: 'success',
            message: `Partner lisatud!`
          })
        } else {
          // eslint-disable-next-line no-undef
          $('body').toast({
            class: 'warning',
            message: `Täida kõik väljad!`
          })
        }
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Partnerit ei lisatud!`
        })
        // eslint-disable-next-line no-undef
        $('#newPartnerModal').modal('hide')
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async deletePartner(id) {
      try {
        await this.$axios.delete('api/partners/' + id)
        this.getPartners()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Partner kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Partnerit ei kustutatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitLocation() {
      try {
        await this.$axios.post('api/locations/', {
          name: this.newLocation
        })
        this.getLocations()
        this.newLocation = false
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Piirkond lisatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Piirkonda ei lisatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitCategory() {
      try {
        await this.$axios.post('api/serviceCategories/', {
          name: this.newCategory.name,
          image: this.newCategory.image
        })
        this.getCategories()
        this.newCategory = false
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Kategooria lisatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Kategooriat ei lisatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async deleteCategory(id) {
      try {
        await this.$axios.delete('api/serviceCategories/' + id)
        this.getCategories()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Kategooria kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Kategooriat ei kustutatud! Kontrolli, et kategoorial ei oleks aktiivseid teenuseid.`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async deleteLocation(id) {
      try {
        await this.$axios.delete('api/locations/' + id)
        this.getLocations()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Piirkond kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Piirkonda ei kustutatud! Kontrolli, et piirkonnal poleks aktiivseid teenuseid.`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
