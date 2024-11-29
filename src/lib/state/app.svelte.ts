import { TIME } from '@utils/const'

interface State {
  isLoading: boolean
  isWalletOpened: boolean
  isWalletConnected: boolean
  isModalOpened: boolean
  activeShopTab: BoostValue
  error: null | string
}

function appStore() {
  const state = $state<State>({
    isLoading: true,
    isWalletOpened: false,
    isWalletConnected: false,
    isModalOpened: false,
    activeShopTab: TIME,
    error: null,
  })

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
} = appStore()
