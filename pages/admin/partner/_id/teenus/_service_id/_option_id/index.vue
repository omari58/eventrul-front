<template>
  <div v-if="option !== false" class="ui basic segment">
    <div class="ui breadcrumb">
      <nuxt-link tag="a" to="/admin" class="section">Admin</nuxt-link>
      <div class="divider">/</div>
      <nuxt-link
        tag="a"
        :to="'/admin/partner/' + option.partnerService.partner.id"
        class="section"
        >{{ option.partnerService.partner.name }}</nuxt-link
      >
      <div class="divider">/</div>
      <nuxt-link
        tag="a"
        :to="
          '/admin/partner/' +
            option.partnerService.partner.id +
            '/teenus/' +
            option.partnerService.id
        "
        class="section"
        >{{ option.partnerService.title }}</nuxt-link
      >
      <div class="divider">/</div>
      <div class="active section">{{ option.title }}</div>
    </div>
    <div class="ui divider"></div>
    <h3 class="ui header">Andmed</h3>
    <form class="ui form">
      <div class="field">
        <label>Nimi</label>
        <input v-model="option.title" type="text" />
      </div>
      <div class="field">
        <label>Kirjeldus</label>
        <textarea v-model="option.description"></textarea>
      </div>
      <div class="field">
        <label>Hind</label>
        <input v-model="option.price" type="number" />
      </div>
      <div class="field">
        <label>Pilt</label>
        <input v-model="option.image" type="text" />
      </div>
      <button class="ui button" type="button" @click="submitOptionEdit()">
        Salvesta
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Option',
  data() {
    return {
      option: false
    }
  },
  mounted() {
    this.getOption()
  },
  methods: {
    async getOption() {
      try {
        const { data } = await this.$axios.get(
          'api/serviceOptions/' + this.$route.params.option_id
        )

        this.option = data
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    async submitOptionEdit() {
      try {
        await this.$axios.put('api/serviceOptions/' + this.option.id, {
          title: this.option.title,
          description: this.option.description,
          image: this.option.image,
          price: this.option.price
        })
        this.getOption()
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'success',
          message: `Valiku info on salvestatud!`
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        // eslint-disable-next-line no-undef
        $('body').toast({
          class: 'error',
          message: `Viga! Valiku infot ei salvestatud!`
        })
      }
    }
  }
}
</script>

<style scoped></style>
