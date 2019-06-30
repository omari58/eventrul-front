<template>
  <div>
    <div class="ui dimmer" :class="{ active: loading }">
      <div class="ui text loader">Laeb</div>
    </div>
    <div class="ui container">
      <div class="ui four stackable centered  cards">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="ui card"
          style="box-shadow: none"
        >
          <div class="content">
            <div @click="updateCategory(cat.name, cat.id)">
              <category :name="cat.name" :src="cat.image" />
            </div>
          </div>
        </div>
      </div>
      <h1 class="ui header center aligned">
        {{
          $route.query.cat
            ? `Vali ${$route.query.cat.toLowerCase()}`
            : 'Sirvi valikuid'
        }}
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
        <div class="ui three wide column" v-for="tag in tags" :key="tag.id">
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
      <div v-if="categoryItems.length > 0" class="ui cards">
        <div
          v-for="item in categoryItems"
          :key="item.id"
          class="ui horizontal fluid card"
        >
          <div class="itemImage">
            <img :src="item.image" alt="" />
          </div>
          <div class="content aligned center">
            <h3 class="ui header center aligned massive">{{ item.title }}</h3>
            <div class="ui basic fitted segment center aligned">
              <div
                class="ui disabled huge rating"
                data-icon="star"
                data-max-rating="5"
                :data-rating="item.rating"
              ></div>
            </div>
            <div class="ui basic segment center aligned large text">
              <p class="">{{ item.description }}</p>
            </div>

            <div class="ui three mini statistics">
              <div class="statistic">
                <div class="value"><i class="users icon"></i> 500</div>
                <div class="label">
                  INIMEST
                </div>
              </div>
              <div class="statistic">
                <div class="value"><i class="redo icon"></i> 25</div>
                <div class="label">
                  KORDA TELLITUD
                </div>
              </div>
              <div class="statistic">
                <div class="value"><i class="euro icon"></i> 400</div>
                <div class="label">
                  ALATES
                </div>
              </div>
            </div>

            <div class="ui basic segment center aligned">
              <button class="ui button" @click="showModal(item)">
                VAATA
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="ui basic segment text center aligned massive">
        Kategooria on tühi! :(
      </div>
      <div class="ui right rail">
        <div class="ui segment">
          Right Rail Content
        </div>
      </div>
    </div>

    <div class="ui long large modal" id="browseModal">
      <i class="close icon"></i>
      <div class="modal-header-image">
        <img :src="selectedItem.image" alt="" />
      </div>
      <div class="content">
        <h1 class="ui header massive aligned center">
          {{ selectedItem.title }}
        </h1>

        <div class="ui basic segment text aligned center big">
          <p>{{ selectedItem.description }}</p>
        </div>

        <div class="ui basic segment aligned center">
          <div class="ui small centered images modal-images">
            <img
              v-for="n in 10"
              :key="n"
              class="ui rounded image"
              :src="selectedItem.image"
            />
          </div>
        </div>

        <div class="ui basic segment center aligned">
          <h2 class="ui header">Võimalused</h2>
          <div class="ui small statistics" style="justify-content: center">
            <div
              v-for="extra in selectedItem.serviceExtraInfos"
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
              v-for="option in selectedItem.serviceOptions"
              :key="option.id"
              class="ui horizontal fluid card"
            >
              <div class="optionImage">
                <img :src="selectedItem.image" />
              </div>
              <div class="content">
                <h3 class="header center aligned">{{ option.title }}</h3>
                <div class="ui basic segment center aligned big text">
                  <p class="">{{ option.description }}</p>
                </div>
                <div class="ui centered grid">
                  <div class="column centered">
                    <div class="ui calendar" id="optionCalendar">
                      <div class="ui input left icon">
                        <i class="calendar icon"></i>
                        <input type="text" placeholder="KUUPÄEV" />
                      </div>
                    </div>
                  </div>
                  <div class="column centered">
                    <div class="ui small statistic">
                      <div class="value">
                        400€
                      </div>
                      <div class="label">
                        HIND
                      </div>
                    </div>
                  </div>
                  <div class="column centered">
                    <button class="ui green big button">
                      Vali {{ option.title }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions" style="display: flex; justify-content: center">
        <div class="ui cancel button">Sulge</div>
      </div>
    </div>
  </div>
</template>

<script>
import category from '~/components/front_page/category'
export default {
  name: 'Asukoht',
  components: {
    category
  },
  data() {
    return {
      loading: true,
      selectedItem: {},
      tags: [],
      categories: [],
      categoryItems: []
    }
  },
  async mounted() {
    const tags = await this.$axios('api/tags/all')

    for (const tag of tags.data) {
      tag.selected = false
    }

    this.tags = tags.data

    const categories = await this.$axios('api/serviceCategories/all')

    this.categories = categories.data

    const categoryItems = this.$route.query.cat_id
      ? await this.$axios(
          'api/partnerService/category/' + this.$route.query.cat_id
        )
      : await this.$axios('api/partnerService/all')

    this.categoryItems = categoryItems.data

    /* eslint-disable */
    $('.ui.rating').rating('disable')
    $('#browseCalendar').calendar({
      type: 'date'
    })
    $('#browseTime').calendar({
      type: 'time',
      ampm: false
    })
    $('.ui.dropdown').dropdown()

    $('#browseModal').modal({
      autofocus: false,
      observeChanges: true
    })
    /* eslint-enable */

    this.loading = false
  },
  methods: {
    async updateCategory(catName, catId) {
      this.loading = true
      this.$router.push({
        path: 'sirvi',
        query: { cat: catName, cat_id: catId }
      })

      const categoryItems = await this.$axios(
        'api/partnerService/category/' + catId
      )

      this.categoryItems = categoryItems.data
      this.loading = false
    },
    showModal(item) {
      this.selectedItem = item
      /* eslint-disable */
      /*$('#optionCalendar').calendar({
        type: 'date'
      })*/
      $('#browseModal').modal('refresh')
      $('#browseModal').modal('show')
      /* eslint-enable */
    }
  }
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
.itemImage {
  img {
    width: 300px;
    height: 100%;
    object-fit: cover;
  }
}

.optionImage {
  img {
    width: 200px;
    height: 100%;
    object-fit: cover;
  }
}
</style>
