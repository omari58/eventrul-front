<template>
  <div class="ui container">
    <h1 class="ui header center aligned">Vali asukoht</h1>

    <div class="ui fluid search" style="width: 100%">
      <div class="ui icon fluid input">
        <input class="prompt" type="text" placeholder="Otsi kohti..." />
        <i class="search icon"></i>
      </div>
      <div class="results"></div>

      <div class="ui divider"></div>

      <div class="ui form">
        <div class="four fields">
          <div class="field">
            <div class="ui calendar" id="standard_calendar">
              <div class="ui input left icon">
                <i class="calendar icon"></i>
                <input type="text" placeholder="KUUPÄEV" />
              </div>
            </div>
          </div>
          <div class="field">
            <div class="ui input left icon">
              <i class="map icon"></i>
              <input type="text" placeholder="PIIRKOND" />
            </div>
          </div>
          <div class="field">
            <div class="ui input left icon">
              <i class="users icon"></i>
              <input type="text" placeholder="INIMESTE ARV" />
            </div>
          </div>
          <div class="field">
            <div class="ui input left icon">
              <i class="clock icon"></i>
              <input type="text" placeholder="KELL" />
            </div>
          </div>
        </div>
      </div>

      <div class="ui basic segment">
        <div class="ui large labels">
          <div v-for="n in 16" :key="n" class="ui label">
            {{ Math.random() % 2 === 0 ? 'Lühike tag' : 'See on pikem tag' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped></style>
