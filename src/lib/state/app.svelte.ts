import { CLAIMED } from '@utils/const'

type Farm = 'farming' | 'farmed' | 'claimed'

interface State {
  farm: Farm
  isMounted: boolean
  isLoading: boolean
  error: null | string
  endTime: number
  isWalletOpened: boolean
  isWalletConnected: boolean
}

function appStore() {
  const state = $state<State>({
    farm: CLAIMED,
    isMounted: false,
    isLoading: true,
    error: null,
    endTime: 0,
    isWalletOpened: false,
    isWalletConnected: false,
  })

  function setFarm(farming: Farm) {
    state.farm = farming
  }

  function setIsMounted() {
    state.isMounted = true
  }

  function setIsLoaded() {
    state.isLoading = false
  }

  function setError(error: string) {
    state.error = error
  }

  function setEndTime(time: number) {
    if (time < Date.now()) {
      throw new Error('Internal Error')
    }
    state.endTime = time
  }

  function openWallet() {
    state.isWalletOpened = true
  }

  function closeWallet() {
    state.isWalletOpened = false
  }

  function connectWallet() {
    state.isWalletConnected = true
  }

  function disconnectWallet() {
    state.isWalletConnected = false
  }

  return {
    get app() {
      return state
    },
    setFarm,
    setIsMounted,
    setIsLoaded,
    setError,
    setEndTime,
    openWallet,
    closeWallet,
    connectWallet,
    disconnectWallet,
  }
}

const {
  app,
  setFarm,
  setIsMounted,
  setIsLoaded,
  setError,
  setEndTime,
  openWallet,
  closeWallet,
  connectWallet,
  disconnectWallet,
} = appStore()

export {
  app,
  setFarm,
  setIsMounted,
  setIsLoaded,
  setError,
  setEndTime,
  openWallet,
  closeWallet,
  connectWallet,
  disconnectWallet,
}
