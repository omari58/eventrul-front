<template>
  <div>
    <div class="ui container">
      <h1 class="ui header center aligned">
        {{ $route.query.cat ? `Vali ${$route.query.cat}` : 'Sirvi valikuid' }}
      </h1>

      <div class="ui fluid search" style="width: 100%">
        <div class="ui icon fluid input">
          <input class="prompt" type="text" placeholder="Otsi kohti..." />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>

      <div class="ui divider"></div>

      <div class="ui form">
        <div class="four fields">
          <div class="field">
            <div class="ui calendar" id="browseCalendar">
              <div class="ui input left icon">
                <i class="calendar icon"></i>
                <input type="text" placeholder="KUUPÄEV" />
              </div>
            </div>
          </div>
          <div class="field">
            <div class="ui dropdown selection">
              <i class="grey map marked icon"></i>
              <input type="hidden" name="area" />
              <div class="default text">PIIRKOND</div>
              <div class="menu">
                <div class="item" data-value="1">Tallinn</div>
                <div class="item" data-value="2">Tartu</div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="ui input left icon">
              <i class="users icon"></i>
              <input type="text" placeholder="INIMESTE ARV" />
            </div>
          </div>
          <div class="field">
            <div class="ui calendar" id="browseTime">
              <div class="ui input left icon">
                <i class="time icon"></i>
                <input type="text" placeholder="KELL" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ui stackable centered grid">
        <div class="ui two wide column" v-for="tag in tags" :key="tag.id">
          <button
            class="ui button"
            :class="{ green: tag.selected }"
            style="text-transform: capitalize; width: 100%"
            @click="tag.selected = !tag.selected"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="ui container">
      <div class="ui cards">
        <div
          v-for="item in categoryItems"
          :key="item.id"
          class="ui horizontal fluid card"
        >
          <div class="itemImage">
            <img :src="item.src" alt="" />
          </div>
          <div class="content aligned center">
            <h3 class="ui header center aligned massive">{{ item.title }}</h3>
            <div class="ui basic fitted segment center aligned">
              <div
                class="ui disabled huge rating"
                data-icon="fire alternate"
                data-max-rating="5"
                :data-rating="item.rating"
              ></div>
            </div>
            <div class="ui basic segment center aligned large text">
              <p class="">{{ item.description }}</p>
            </div>

            <div class="ui three mini statistics">
              <div class="statistic">
                <div class="value">
                  <i class="users icon"></i> {{ item.maxCapacity }}
                </div>
                <div class="label">
                  INIMEST
                </div>
              </div>
              <div class="statistic">
                <div class="value">
                  <i class="door open icon"></i> {{ item.rooms }}
                </div>
                <div class="label">
                  RUUMI
                </div>
              </div>
              <div class="statistic">
                <div class="value">
                  <i class="euro icon"></i> {{ item.minPrice }}
                </div>
                <div class="label">
                  ALATES
                </div>
              </div>
            </div>

            <div class="ui basic segment center aligned">
              <button class="ui button">
                VAATA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Asukoht',
  data() {
    return {
      tags: [],
      categoryItems: [
        {
          id: 0,
          title: 'Pealkiri',
          rating: 4,
          src: 'images/categories/places.jpg',
          description:
            'Kuidas korraldada ettevõtte suvepäevi nii, et kõik osalejad meenutaksid neid üritusi hea sõnaga veel aastaid hiljemgi ja eesmärk toredalt aega veeta saaks täidetud? Võimalusi, kuidas suvepäevi korraldada ja mida nende jooksul teha, on loomulikult lõputult. Suvepäevad või mistahes muud ettevõtte meeskondlikud väljasõidud on aeg, mil peamiselt töises keskkonnas aega veetvad kolleegid saavad nautida vaba aega ja üksteist paremini tundma õppida.',
          maxCapacity: 500,
          rooms: 4,
          minPrice: 400
        },
        {
          id: 1,
          title: 'Pealkiri',
          rating: 3,
          src: 'images/categories/places.jpg',
          description:
            'Kuidas korraldada ettevõtte suvepäevi nii, et kõik osalejad meenutaksid neid üritusi hea sõnaga veel aastaid hiljemgi ja eesmärk toredalt aega veeta saaks täidetud? Võimalusi, kuidas suvepäevi korraldada ja mida nende jooksul teha, on loomulikult lõputult. Suvepäevad või mistahes muud ettevõtte meeskondlikud väljasõidud on aeg, mil peamiselt töises keskkonnas aega veetvad kolleegid saavad nautida vaba aega ja üksteist paremini tundma õppida.',
          maxCapacity: 500,
          rooms: 4,
          minPrice: 400
        }
      ]
    }
  },
  async mounted() {
    /* eslint-disable */
    $('.ui.rating').rating('disable')
    $('#browseCalendar').calendar()

    $('#browseTime').calendar({
      type: 'time',
      ampm: false
    })
    $('.ui.dropdown').dropdown()
    /* eslint-enable */

    const tags = await this.$axios('api/tag/all')

    for (const tag of tags.data) {
      tag.selected = false
    }

    this.tags = tags.data
  }
}
</script>

<style lang="scss" scoped>
.itemImage {
  img {
    width: 300px;
    height: 100%;
    object-fit: cover;
  }
}
</style>
