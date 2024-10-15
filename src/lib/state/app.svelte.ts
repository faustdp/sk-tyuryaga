type Farm = 'farming' | 'farmed' | 'claimed'

interface State {
  farm: Farm
  isMounted: boolean
  endTime: number
}

function appStore() {
  const state = $state<State>({
    farm: 'claimed',
    isMounted: false,
    endTime: 0,
  })

  function setFarm(farming: Farm) {
    state.farm = farming
  }

  function setIsMounted() {
    state.isMounted = true
  }

  function setEndTime(time: number) {
    state.endTime = time
  }

  return {
    get app() {
      return state
    },
    setFarm,
    setIsMounted,
    setEndTime,
  }
}

const { app, setFarm, setIsMounted, setEndTime } = appStore()

export { app, setFarm, setIsMounted, setEndTime }
