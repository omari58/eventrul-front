<template>
  <div id="browseModal" class="ui long large modal">
    <i class="close icon"></i>
    <div class="modal-header-image">
      <img :src="service.image" alt="" />
    </div>
    <div class="content">
      <h1 class="ui header massive aligned center">
        {{ service.title }}
      </h1>

      <div class="ui basic segment text aligned center big">
        <p>{{ service.description }}</p>
      </div>

      <div class="ui basic segment aligned center">
        <div class="ui small centered images modal-images">
          <img
            v-for="n in 10"
            :key="n"
            class="ui rounded image"
            :src="service.image"
          />
        </div>
      </div>

      <div class="ui basic segment center aligned">
        <h2 class="ui header">Võimalused</h2>
        <div class="ui small statistics" style="justify-content: center">
          <div
            v-for="extra in service.serviceExtraInfos"
            :key="extra.id"
            class="statistic"
          >
            <div class="value">
              <i :class="`grey ${extra.icon} icon`"></i>
            </div>
            <div class="label">
              {{ extra.title }}
            </div>
          </div>
        </div>
      </div>

      <div class="ui basic segment">
        <h2 class="ui header center aligned">Tee oma valik</h2>
        <div class="ui cards">
          <div
            v-for="option in service.serviceOptions"
            :key="`option-${option.id}`"
            class="ui horizontal fluid card"
          >
            <service-option :data="option" :service="service" />
          </div>
        </div>
      </div>
    </div>

    <div class="actions" style="display: flex; justify-content: center">
      <div class="ui cancel button" @click="$emit('close')">Sulge</div>
    </div>
  </div>
</template>

<script>
import serviceOption from '~/components/browseModal/option'
export default {
  name: 'BrowseModal',
  components: {
    serviceOption
  },
  props: ['service'],
  data() {
    return {}
  },
  beforeMount() {
    /* eslint-disable */
    $('#browseModal').modal({
      autofocus: false,
      observeChanges: true,
      onVisible() {
        $('.optionCalendar').calendar({
          type: 'date'
        })
      }
    })
    /* eslint-enable */
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.modal-header-image {
  width: 100%;
  height: 300px;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.modal-images {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.optionImage {
  img {
    width: 200px;
    height: 100%;
    object-fit: cover;
  }
}
</style>
