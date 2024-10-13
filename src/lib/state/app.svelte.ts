function appStore() {
  const state = $state({
    isFarming: false,
  })

  function startFarm() {
    state.isFarming = true
  }

  function stopFarm() {
    state.isFarming = false
  }

  return {
    get app() {
      return state
    },
    startFarm,
    stopFarm,
  }
}

const { app, startFarm, stopFarm } = appStore()

export { app, startFarm, stopFarm }
