import Vue from 'vue'

Vue.prototype.$openBrowseModal = function() {
  /* eslint-disable */
  $('#browseModal').modal('show')
}

Vue.prototype.$hideBrowseModal = function() {
  /* eslint-disable */
  $('#browseModal').modal('hide')
}

Vue.prototype.$openServiceProviderModal = function() {
  /* eslint-disable */
  $('#serviceProviderInfoModal').modal('show')
}

Vue.prototype.$openLoginModal = function() {
  /* eslint-disable */
  $('#loginModal').modal('show')
}
