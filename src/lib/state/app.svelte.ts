import { SECOND, TIME } from '@utils/const'

interface State {
  isLoading: boolean
  isWalletOpened: boolean
  isWalletConnected: boolean
  isModalOpened: boolean
  activeShopTab: BoostValue
  error: null | string
  now: number
}

function appStore() {
  const state = $state<State>({
    isLoading: true,
    isWalletOpened: false,
    isWalletConnected: false,
    isModalOpened: false,
    activeShopTab: TIME,
    error: null,
    now: Date.now(),
  })

  let interval: NodeJS.Timeout

  function setIsLoaded() {
    state.isLoading = false
  }

  function setError(error: string) {
    state.error = error
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

  function setActiveTab(tab: BoostValue) {
    state.activeShopTab = tab
  }

  function openModal() {
    state.isModalOpened = true
  }

  function closeModal() {
    state.isModalOpened = false
  }

  function startInterval() {
    interval = setInterval(() => {
      state.now += SECOND
    }, SECOND)
  }

  function setNow(date: number) {
    clearInterval(interval)
    state.now = date
    startInterval()
  }

  startInterval()

  return {
    get app() {
      return state
    },
    setIsLoaded,
    setError,
    openWallet,
    closeWallet,
    connectWallet,
    disconnectWallet,
    setActiveTab,
    openModal,
    closeModal,
    setNow,
  }
}

export const {
  app,
  setIsLoaded,
  setError,
  openWallet,
  closeWallet,
  connectWallet,
  disconnectWallet,
  setActiveTab,
  openModal,
  closeModal,
  setNow,
} = appStore()
