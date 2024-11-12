function userStore() {
  let state = $state<User>({
    address: '',
    id: null,
    first_name: '',
    direct_invites: 0,
    indirect_invites: 0,
    username: null,
  })

  function setAddress(wallet: string) {
    state.address = wallet
  }

  function setUser(user: Partial<User>) {
    state = { ...state, ...user }
  }

  return {
    get user() {
      return state
    },
    setAddress,
    setUser,
  }
}

const { user, setAddress, setUser } = userStore()

export { user, setAddress, setUser }
