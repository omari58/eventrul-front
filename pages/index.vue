<template>
  <div>
    <front-page-header />
    <div class="ui container" id="FpScrollTarget">
      <div class="ui huge header">Kust soovid alustada?</div>
      <div class="ui four stackable cards">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="ui card"
          style="box-shadow: none"
        >
          <div class="content">
            <nuxt-link
              :to="`/sirvi?cat=${cat.name.toLowerCase()}&cat_id=${cat.id}`"
            >
              <category :name="cat.name" :src="cat.image" />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="ui container">
      <div class="ui basic fitted segment text massive center aligned">
        <p>
          Ürituse korraldamine ei pea olema pikk protsess, mis pigistab välja
          kõik loomemahlad. Oleme kõik meeldejäävaks ürituseks vajaliku
          koondanud ühele lehele. Nii ei kulu aega õigete otsingusõnade välja
          mõtlemiseks ja on võimalik välja filtreerida just Sulle sobivad
          lahendused. Mugava lisana on võimalik konto loomisel kõike üritusega
          seonduvat ka ühes kohas hallata.
        </p>
        <p>
          <strong
            >Suurepärase ürituse korraldamine pole kunagi olnud lihtsam.</strong
          >
        </p>
      </div>
    </div>

    <div class="ui container">
      <div class="ui three stackable cards">
        <div
          v-for="point in points"
          :key="point.id"
          class="ui centered card key-point"
        >
          <div class="content">
            <div class="center aligned point-icon">
              <i :class="`${point.icon} icon huge`"></i>
            </div>
            <h3 class="center aligned header">{{ point.title }}</h3>
            <div class="center aligned">
              <div class="ui basic fitted segment text huge center aligned">
                <p>{{ point.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ui container">
      <div class="background-stripe"></div>
      <div class="ui huge header">Põnevad pakkumised</div>
      <div class="ui segment basic">
        <div class="ui four stackable cards">
          <div v-for="offer in offers" :key="offer.id" class="ui centered card">
            <div class="ui image">
              <img :src="offer.src" />
            </div>
            <div class="content center aligned">
              <div class="ui basic fitted segment text large center aligned">
                <h3 class="center aligned header">{{ offer.title }}</h3>
                <p>{{ offer.content }}</p>
              </div>
            </div>
            <button class="ui bottom attached button small basic">
              LOE EDASI
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="ui container">
      <div class="ui huge header">Eventruli lugemissoovitused</div>
      <div class="ui cards">
        <div
          v-for="item in news"
          :key="item.id"
          class="ui horizontal fluid card"
        >
          <div class="news-image">
            <img :src="item.src" />
          </div>
          <div class="content center aligned">
            <div class="ui basic fitted segment text big center aligned">
              <h3 class="ui header">{{ item.title }}</h3>
              <p>{{ item.content }}</p>
            </div>
            <a :href="item.link" target="_blank" class="ui button small basic">
              LOE EDASI
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import frontPageHeader from '~/components/frontPageHeader'
import category from '~/components/front_page/category'

export default {
  layout: 'frontpage',
  components: { category, frontPageHeader },
  data() {
    return {
      categories: [],
      points: [
        {
          id: 0,
          title: 'Ära põleta aega',
          icon: 'clock',
          content:
            'Enam ei tähenda ürituse korraldamine päevi internetis kaevamist ja 120 avatud akent. Oleme Sulle ühele lehele koondanud kokku parima, mida ürituskorraldusturul pakkuda on. Sõelu filtrite abil välja just need koostööpartnerid, kes sinu tingimustele sobivad.'
        },
        {
          id: 1,
          title: 'Lihtsuses peitub võlu',
          icon: 'comments',
          content:
            'Loogiline ülesehitus ja tuttavad võtmesõnad muudavad lehel navigeerimise imelihtsaks. Kõik pakkumised ja info on nähtav ka ilma sisse logimata. Konto loomine laseb sul üritusega seonduvad detailid salvestada ning teenusepakkujatega otse suhelda.'
        },
        {
          id: 2,
          title: 'Saa põhjalik ülevaade',
          icon: 'compass',
          content:
            'Lase end inspireerida või avasta ise. Põhjalikud ja omavahel võrreldavad profiilid võimaldavad Sul end turul pakutavaga kurssi viia. Päringut on võimalik täpsustada läbi lehekülje vestlusakna.'
        }
      ],
      offers: [
        {
          id: 0,
          title: 'Strand spaa- ja konverentsihotell',
          src: 'images/pakkumine1.jpg',
          content:
            'Nelja tärniga spaahotell Strand asub Pärnu kuurordis, vaid 10-minutilise jalutuskäigu kaugusel rannast ja kesklinnast. Hotelli külalised saavad nautida tasuta sissepääsu spaasse, kus on sisebassein ning saadaval on elegantsed minibaariga toad ja minigolfirada.'
        },
        {
          id: 1,
          title: 'Viiking spaahotell',
          src: 'images/pakkumine2.jpg',
          content:
            'Spa Hotel Viiking asub vaid lühikese jalutuskäigu kaugusel rannast ja Pärnu kesklinnast. Hotellis on moodsad toad ja sisebasseiniga spaakeskus.'
        },
        {
          id: 2,
          title: 'Rannahotell',
          src: 'images/pakkumine3.jpg',
          content:
            'Parkidega ümbritsetud Rannahotell paikneb suurepärases kohas liivaranna ääres. Pärnu kesklinn jääb vaid 15-minutilise jalutuskäigu kaugusele. Hotelli hoone on tõeline funktsionaalse stiili pärl.'
        },
        {
          id: 3,
          title: 'Estonia Resort Hotel & Spa',
          src: 'images/pakkumine4.jpg',
          content:
            'Spa Estonia asub ainult 5-minutilise jalutuskäigu kaugusel merest ja 15-minutilise teekonna kaugusel Pärnu kesklinnast. Hotellil on väliterrassiga spaa ning mitmesuguste treeninguvõimalustega aktiivne spaa-ala. Külalistele pakutakse enam kui 30 erinevat heaoluhooldust ja massaaži.'
        }
      ],
      news: [
        {
          id: 0,
          title: 'Edukate suvepäevade korraldamise võti',
          src: 'images/uudis1.jpg',
          link:
            'https://www.sekretar.ee/uudised/2017/05/18/edukate-suvepaevade-korraldamise-voti',
          content:
            'Kuidas korraldada ettevõtte suvepäevi nii, et kõik osalejad meenutaksid neid üritusi hea sõnaga veel aastaid hiljemgi ja eesmärk toredalt aega veeta saaks täidetud?\n' +
            'Võimalusi, kuidas suvepäevi korraldada ja mida nende jooksul teha, on loomulikult lõputult. Suvepäevad või mistahes muud ettevõtte meeskondlikud väljasõidud on aeg, mil peamiselt töises keskkonnas aega veetvad kolleegid saavad nautida vaba aega ja üksteist paremini tundma õppida.\n'
        },
        {
          id: 1,
          title: '7 olulist viga, mida peoruumide rentimisel tehakse ',
          src: 'images/uudis2.jpg',
          link:
            'https://www.sekretar.ee/uudised/2017/05/15/7-olulist-viga-mida-peoruumide-rentimisel-tehakse',
          content:
            'Kindlasti oled viibinud mõnel üritusel, kus oli liiga kitsas, lärmakas, külm või palav. Milliste emotsioonidega sa sellelt sündmuselt lahkusid?\n' +
            'Tõenäoliselt mitte eriti positiivsetega ja ehk lahkusid isegi enne peo lõppu. Üks on selge – halvasti valitud ja mittesobivad peoruumid võivad rikkuda kogu ürituse. Järgnevalt toome välja 7 suurimat viga, mida peoruumide rentimisel tehakse ja anname soovitusi nende vältimiseks.\n'
        },
        {
          id: 2,
          title: 'Kas firma sünnipäev vajab tähistamist? ',
          src: 'images/uudis3.jpg',
          link:
            'https://www.sekretar.ee/uudised/2016/09/09/kas-firma-sunnipaev-vajab-tahistamist',
          content:
            'Käesoleval aastal saavad esimesed taasiseseisvunud vabariigi ajal asutatud firmad tähistada 25.aastast juubelit! Äripäeva Infopanga andmetel tähistab sel aastal juba 10000 firmat kümnendat juubelit!\n' +
            'Kuuldavasti lõpetab esimese 3 aasta jooksul 80% alustavatest ettevõtetest tegevuse. Seega on iga sünnipäev märkimisväärne sündmus, mis vajab tähistamist! Mida firma sünnipäeval teha? Kellele pidu korraldada? Kolleegidele, klientidele ja/või koostööpartneritele? Seda teab ja tunnetab iga firma ise. Allpool jagame mõtteid peo korraldamiseks eelkõige kolleegidele.\n'
        }
      ]
    }
  },
  async mounted() {
    const categories = await this.$axios('api/serviceCategories/all')

    this.categories = categories.data
  }
}
</script>

<style lang="scss">
.container {
  margin-top: 40px;
}

.news-image {
  img {
    width: 200px;
    height: 100%;
    object-fit: cover;
  }
}

.background-stripe {
  height: 371px;
  width: 100%;

  z-index: -1;

  position: absolute;
  left: 0;

  background: url('~static/images/fp_background_stripe.svg');
  background-position-x: left;
  background-position-y: center;
  background-size: cover;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.key-point {
  box-shadow: none !important;

  .point-icon {
    margin-bottom: 15px;
  }
}
</style>
