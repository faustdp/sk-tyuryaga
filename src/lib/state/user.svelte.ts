interface State {
  address: string
}

function userStore() {
  const state = $state<State>({
    address: '',
  })

  function setAddress(wallet: string) {
    state.address = wallet
  }

  return {
    get user() {
      return state
    },
    setAddress,
  }
}

const { user, setAddress } = userStore()

export { user, setAddress }
