<template>
  <div class="header--wrapper">
    <div class="header">
      <div class="logo">
        <span>Eventrul</span>
      </div>
      <div class="menu">
        <ul class="">
          <li>Teenusepakkujale</li>
          <li>Kontakt</li>
          <li>
            <div class="btn">Logi sisse</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'frontPageHeader'
}
</script>

<style lang="scss" scoped>
.header--wrapper {
  .header {
    position: relative;
    width: 100vw;
    height: 450px;

    background: url('~assets/images/fp_header_image.jpg');
    background-position-x: left;
    background-position-y: center;
    background-size: cover;

    .logo {
      color: #ffffff;
      font-size: 10rem;
      font-weight: 900;

      position: absolute;
      top: 150px;
      left: 230px;
    }

    .menu {
      display: flex;
      flex-direction: row;

      font-size: 2rem;
    }
  }
}
</style>
