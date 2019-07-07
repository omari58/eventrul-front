<template>
  <div class="footer">
    <div class="ui container secondary large menu inverted">
      <div class="right menu">
        <span class="item">
          Copyright © 2019 Eventrul. All rights reserved.
        </span>
        <a href="" class="item">
          Privaatsuspoliitika
        </a>
        <a href="" class="item">
          Küpsised
        </a>
        <a href="" class="item">
          Tingimused
        </a>
      </div>
    </div>

    <div class="ui modal" id="serviceProviderInfoModal">
      <i class="close icon"></i>
      <div class="header">
        Teenusepakkujale
      </div>
      <div class="ui basic segment big text">
        <p>
          Varsti avame lehe, kus on võimalik ise oma andmeid muuta ja jooksvalt
          sättida. Koos sellega tekib järjest palju kasulikku funktsionaalsust,
          mis teeb Sulle tehingute haldamise mugavaks ja lihtsaks. Praegu kui
          tahad muuta enda ettevõtte andmeid, siis kirjuta meile aadressil
          partner@eventrul.com ning viime vajalikud muudatused sisse.
        </p>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          Sulge
        </div>
      </div>
    </div>

    <div class="ui modal" id="loginModal">
      <i class="close icon"></i>
      <div class="header">
        Logi sisse
      </div>
      <div class="ui basic segment big text">
        <p>
          Seda fuktsionaalsust me veel avanud ei ole. Küll aga saab tasuta ja
          ilma kasutajata ligi kogu meie andmebaasile ja seda igavesti! Piilu
          ringi ning ehk leiad mõne uue mõtte järgmiseks ürituseks. ;)
        </p>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          Sulge
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageFooter',
  mounted() {
    /* eslint-disable */
    $('#serviceProviderInfoModal').modal()
    $('#loginModal').modal()
  }
}
</script>

<style lang="scss" scoped>
.footer {
  height: 100px;
  width: 100%;

  margin-top: auto;

  background: url('~static/images/footer_bg.svg');
  background-position-x: left;
  background-position-y: center;
  background-size: cover;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>
