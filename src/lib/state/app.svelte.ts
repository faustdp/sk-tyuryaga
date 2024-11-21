import { CLAIMED, type ShopTabs } from '@utils/const'

type Farm = 'farming' | 'farmed' | 'claimed'

interface State {
  farm: Farm
  isLoading: boolean
  isWalletOpened: boolean
  isWalletConnected: boolean
  isModalOpened: boolean
  activeShopTab: ShopTabs
  error: null | string
  endTime: number
}

function appStore() {
  const state = $state<State>({
    farm: CLAIMED,
    isLoading: true,
    isWalletOpened: false,
    isWalletConnected: false,
    isModalOpened: false,
    activeShopTab: 0,
    error: null,
    endTime: 0,
  })

  function setFarm(farming: Farm) {
    state.farm = farming
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

  function setActiveTab(tab: ShopTabs) {
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
    setFarm,
    setIsLoaded,
    setError,
    setEndTime,
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
  setFarm,
  setIsLoaded,
  setError,
  setEndTime,
  openWallet,
  closeWallet,
  connectWallet,
  disconnectWallet,
  setActiveTab,
  openModal,
  closeModal,
} = appStore()
