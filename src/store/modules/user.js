export default {
  namespaced: true,
  state: {
    id: 0,
    name: ''
  },
  mutations: {
    accessPlatformId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
