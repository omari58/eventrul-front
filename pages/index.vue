<template>
  <div class="container">
    <section class="section--wrapper">
      <div class="section-title">
        <span>Kust soovid alustada?</span>
      </div>
      <div class="section-content">
        <div class="categories--wrapper">
          <category
            v-for="cat in categories"
            :name="cat.name"
            :src="cat.src"
            :key="cat.id"
          />
        </div>
      </div>
    </section>

    <section class="section--wrapper">
      <div class="section-content">
        <div class="key_points--wrapper">
          <key-point
            v-for="point in points"
            :key="point.id"
            :title="point.title"
            :content="point.content"
            :icon="point.icon"
          />
        </div>
      </div>
    </section>

    <section class="section--wrapper">
      <div class="section-title">
        <span>Põnevad pakkumised</span>
      </div>
      <div class="section-content">
        <offer-slider :offers="offers" />
      </div>
    </section>
  </div>
</template>

<script>
import category from '~/components/front_page/category'
import keyPoint from '~/components/front_page/keyPoint'
import offerSlider from '~/components/front_page/offerSLider'

export default {
  components: {
    category,
    keyPoint,
    offerSlider
  },
  data() {
    return {
      categories: [
        {
          id: 0,
          name: 'Asukoht',
          src: 'images/categories/places.jpg'
        },
        {
          id: 1,
          name: 'Meelelahutus',
          src: 'images/categories/entertainment.jpg'
        },
        {
          id: 2,
          name: 'Toitlustus',
          src: 'images/categories/food.jpg'
        },
        {
          id: 3,
          name: 'Majutus',
          src: 'images/categories/accomodation.jpg'
        }
      ],
      points: [
        {
          id: 0,
          title: 'Pealkiri',
          icon: 'clock',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        },
        {
          id: 1,
          title: 'Pealkiri',
          icon: 'comments',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        },
        {
          id: 2,
          title: 'Pealkiri',
          icon: 'compass',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        }
      ],
      offers: [
        {
          id: 0,
          title: 'Asukoht',
          image: 'images/categories/places.jpg',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        },
        {
          id: 1,
          title: 'Meelelahutus',
          image: 'images/categories/entertainment.jpg',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        },
        {
          id: 2,
          title: 'Toitlustus',
          image: 'images/categories/food.jpg',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        },
        {
          id: 3,
          title: 'Majutus',
          image: 'images/categories/accomodation.jpg',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices vel purus nec interdum. Maecenas sed odio nec massa volutpat suscipit. Vivamus nec purus ac libero blandit rutrum sed vitae odio. Praesent suscipit rutrum felis id auctor. Mauris vitae elit at lorem tempor eleifend.'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 5rem 0;
  .categories--wrapper,
  .key_points--wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
