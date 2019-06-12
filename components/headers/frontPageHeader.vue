<template>
  <div class="header--wrapper">
    <div class="header">
      <div class="title">
        <span>Eventrul</span>
      </div>
      <div class="menu">
        <ul>
          <li>Teenusepakkujale</li>
          <li>Kontakt</li>
          <li>
            <div class="btn">Logi sisse</div>
          </li>
        </ul>
      </div>
      <div class="subtitle">
        <span>Korraldad ägedat üritust?</span>
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
  color: white;
  width: 100vw;

  .header {
    height: 45rem;
    position: relative;

    padding: 1.5rem 23rem;

    background: url('~assets/images/fp_header_image.jpg');
    background-position-x: left;
    background-position-y: center;
    background-size: cover;

    .title {
      font-size: 15.2rem;
      font-weight: 900;

      position: absolute;
      top: 15rem;
      left: 23rem;
    }

    .subtitle {
      font-size: 7.6rem;
      font-weight: 500;

      position: absolute;
      top: 37.5rem;
      left: 23rem;
    }

    .menu {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      ul {
        text-decoration: none;
        list-style: none;
        display: flex;
        flex-direction: row;
        align-items: center;

        font-size: 2rem;
        font-weight: 200;

        li {
          text-transform: uppercase;
          &:not(:last-child) {
            margin-right: 5rem;
          }

          .btn {
            width: 13rem;
            height: 5rem;

            display: flex;
            justify-content: center;
            align-items: center;

            background: white;
            border-radius: 1rem;
            color: $dark;
          }
        }
      }
    }
  }
}
</style>
