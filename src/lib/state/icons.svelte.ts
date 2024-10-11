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
    get icons() {
      return state
    },
    setCig,
    setTrash,
  }
}

const { icons: iconsState, setCig, setTrash } = iconsStore()

export { iconsState, setCig, setTrash }
