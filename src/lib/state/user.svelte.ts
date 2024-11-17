function userStore() {
  let state = $state<User>({
    id: null,
    first_name: '',
    address: '',
    direct_invites: 0,
    indirect_invites: 0,
    cigs: 0,
    level: 0,
    username: null,
  })

  function setAddress(wallet: string) {
    state.address = wallet
  }

  function setUser(user: Partial<User>) {
    state = { ...state, ...user }
  }

  function setCigs(cigs: number) {
    state.cigs += cigs
  }

  function upLevel() {
    state.level += 1
  }

  return {
    get user() {
      return state
    },
    setAddress,
    setUser,
    setCigs,
    upLevel,
  }
}

export const { user, setAddress, setUser, setCigs, upLevel } = userStore()
