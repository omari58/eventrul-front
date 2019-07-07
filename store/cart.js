export const state = () => ({
  cart: []
})

export const mutations = {
  add(state, service) {
    state.cart.push(service)
  },
  remove(state, index) {
    state.cart.splice(index, 1)
  },
  reset(state) {
    state.cart = []
  }
}

export const actions = {}
