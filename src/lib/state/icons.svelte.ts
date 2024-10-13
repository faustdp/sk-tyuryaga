function iconsStore() {
  const state = $state({
    cig: false,
    trash: false,
  })

  function setCig() {
    state.cig = !state.cig
  }

  function setTrash() {
    state.trash = !state.trash
  }

  return {
    get iconsState() {
      return state
    },
    setCig,
    setTrash,
  }
}

const { iconsState, setCig, setTrash } = iconsStore()

export { iconsState, setCig, setTrash }
