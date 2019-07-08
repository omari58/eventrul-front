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
    <h3 class="ui header">Andmed</h3>
    <form class="ui form">
      <div class="field">
        <label>Nimi</label>
        <input v-model="service.title" type="text" />
      </div>
      <div class="field">
        <label>Kirjeldus</label>
        <textarea v-model="service.description"></textarea>
      </div>
      <div class="field">
        <label>Kategooria</label>
        <select v-model="service.service_category_id">
          <option v-for="item in categories" :key="item.id" :value="item.id">{{
            item.name
          }}</option>
        </select>
      </div>
      <div class="field">
        <label>Piirkond</label>
        <select v-model="service.location_id">
          <option v-for="item in locations" :key="item.id" :value="item.id">{{
            item.name
          }}</option>
        </select>
      </div>
      <div class="field">
        <label>Pilt</label>
        <input v-model="service.image" type="text" />
      </div>
      <button class="ui button" type="button" @click="submitServiceEdit()">
        Salvesta
      </button>
    </form>
    <div class="ui divider" />
    <h3 class="ui header">Valikud</h3>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Pilt</th>
          <th>Nimi</th>
          <th>Kirjeldus</th>
          <th>Hind</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="option in service.serviceOptions" :key="option.id">
          <td><img class="ui large image" :src="option.image" /></td>
          <td>{{ option.title }}</td>
          <td>{{ option.description }}</td>
          <td>{{ option.price }}€</td>
          <td class="collapsing">
            <nuxt-link
              tag="button"
              :to="
                `/admin/partner/${service.partner.id}/teenus/${service.id}/${option.id}`
              "
              class="ui small circular icon button"
            >
              <i class="ui zoom icon"></i>
            </nuxt-link>
            <button
              class="ui red button circular small icon"
              @click="deleteOption(option.id)"
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
    <div id="newServiceOptionModal" class="ui modal">
      <i class="close icon"></i>
      <div class="header">
        Lisa uus valik
      </div>
      <div class="content">
        <form class="ui form">
          <div class="field">
            <label>Nimi</label>
            <input v-model="newOption.title" type="text" />
          </div>
          <div class="field">
            <label>Kirjeldus</label>
            <textarea v-model="newOption.description"></textarea>
          </div>
          <div class="field">
            <label>Hind</label>
            <input v-model="newOption.price" type="number" />
          </div>
          <div class="field">
            <label>Pilt</label>
            <input v-model="newOption.image" type="text" />
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          Tagasi
        </div>
        <button class="ui right green button" @click="submitOption()">
          Salvesta
        </button>
      </div>
    </div>

    <div class="ui divider"></div>
    <h3 class="ui header">Lisainfo</h3>

    <table class="ui celled table">
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Ikoon</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in service.serviceExtraInfos" :key="item.id">
          <td>{{ item.title }}</td>
          <td><i class="ui icon" :class="item.icon"></i></td>
          <td class="collapsing">
            <button
              class="ui red button circular small icon"
              @click="deleteExtraInfo(item.id)"
            >
              <i class="ui trash icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <form v-if="newExtraInfo !== false" class="ui form">
      <div class="field">
        <label>Nimi</label>
        <input v-model="newExtraInfo.title" type="text" />
      </div>
      <div class="field">
        <label>Ikoon</label>
        <input v-model="newExtraInfo.icon" type="text" />
      </div>
      <button class="ui green button" @click="submitExtraInfo()" type="button">
        <i class="ui plus icon"></i> Salvesta
      </button>
      <button
        class="ui black button"
        @click="newExtraInfo = false"
        type="button"
      >
        <i class="ui close icon"></i> Tagasi
      </button>
    </form>

    <button
      v-if="newExtraInfo === false"
      class="ui button"
      @click="newExtraInfo = { icon: '', title: '' }"
    >
      <i class="ui plus icon"></i> Lisa uus
    </button>

    <div class="ui divider"></div>
    <h3 class="ui header">Pildid</h3>

    <table class="ui celled table">
      <thead>
        <tr>
          <th>Pilt</th>
          <th>Link</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="image in service.images" :key="image.id">
          <td><img class="ui small image" :src="image.link" /></td>
          <td>{{ image.link }}</td>
          <td class="collapsing">
            <button
              class="ui red button circular small icon"
              @click="deleteImage(image.id)"
            >
              <i class="ui trash icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="newImages.length > 0" class="ui list">
      <div class="ui item">
        <form class="ui form">
          <div v-for="(row, index) in newImages" :key="index" class="field">
            <label
              >Link {{ index + 1 }}
              <button
                class="ui mini icon tertiary button"
                @click="newImages.splice(index, 1)"
              >
                <i class="ui red trash icon"></i></button
            ></label>
            <input v-model="row.link" type="text" />
          </div>
        </form>
      </div>
    </div>

    <button class="ui button" @click="newImages.push({ link: '' })">
      <i class="ui plus icon"></i> Lisa uus
    </button>
    <button
      v-if="newImages.length > 0"
      class="ui green button"
      type="button"
      @click="submitImages()"
    >
      Salvesta
    </button>
  </div>
</template>

<script>
export default {
  name: 'Teenus',
  data() {
    return {
      service: {
        partner: {
          name: ''
        },
        title: ''
      },
      newOption: {
        title: '',
        description: '',
        price: 0,
        image: ''
      },
      categories: [],
      locations: [],
      newImages: [],
      newExtraInfo: false
    }
  },
  mounted() {
    this.getService()
    this.getCategories()
    this.getLocations()

    // eslint-disable-next-line no-undef
    $('#newServiceOptionModal').modal()
  },
  methods: {
    showModal() {
      // eslint-disable-next-line no-undef
      $('#newServiceOptionModal').modal('show')
    },
    async submitServiceEdit() {
      try {
        await this.$axios.put('api/partnerServices/' + this.service.id, {
          service_category_id: this.service.service_category_id,
          location_id: this.service.location_id,
          title: this.service.title,
          description: this.service.description,
          image: this.service.image
        })
        this.getService()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Teenuse info on salvestatud!`
        })
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
    async getService() {
      try {
        const { data } = await this.$axios.get(
          'api/partnerServices/' + this.$route.params.service_id
        )
        this.service = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitOption() {
      try {
        await this.$axios.post('api/serviceOptions', {
          partner_service_id: this.service.id,
          title: this.newOption.title,
          description: this.newOption.description,
          price: this.newOption.price,
          image: this.newOption.image
        })
        this.getService()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Valiku info on salvestatud!`
        })
        // eslint-disable-next-line no-undef
        $('#newServiceOptionModal').modal('hide')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Valiku infot ei salvestatud!`
        })
      }
    },
    async deleteOption(id) {
      try {
        await this.$axios.delete('api/serviceOptions/' + id)
        this.getService()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Valik kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Valikut ei kustutatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitImages() {
      try {
        await this.$axios.post('api/partnerServiceImages', {
          partnerServiceId: this.service.partner.id,
          links: this.newImages
        })
        this.getService()
        this.newImages = []
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Pildid on lisatud!!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Pilte ei lisatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async deleteImage(id) {
      try {
        await this.$axios.delete('api/partnerServiceImages/' + id)
        this.getService()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Pilt kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Pilti ei kustutatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitExtraInfo() {
      try {
        await this.$axios.post('api/serviceExtraInfos', {
          partner_service_id: this.service.partner.id,
          title: this.newExtraInfo.title,
          icon: this.newExtraInfo.icon
        })
        this.getService()
        this.newExtraInfo = false
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Lisainfo lisatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Lisainfot ei lisatud!`
        })
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async deleteExtraInfo(id) {
      try {
        await this.$axios.delete('api/serviceExtraInfos/' + id)
        this.getService()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Lisainfo kustutatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Lisainfot ei kustutatud!`
        })
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
    }
  }
}
</script>

<style scoped></style>
