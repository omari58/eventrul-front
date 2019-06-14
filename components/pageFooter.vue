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
  </div>
</template>

<script>
export default {
  name: 'pageFooter'
}
</script>

<style lang="scss" scoped>
.footer {
  height: 100px;
  position: relative;

  margin-top: 50px;

  background: url('~static/images/footer_bg.svg');
  background-position-x: left;
  background-position-y: center;
  background-size: cover;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>
