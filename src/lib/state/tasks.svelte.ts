function tasksStore() {
  let state = $state<SocialItem[]>([])

  function setTasks(items: SocialItem[]) {
    //(SocialItemCode | SocialItemInvite | SocialItemSubscribe)
    state = items
  }

  return {
    get tasks() {
      return state
    },
    setTasks,
  }
}

export const { tasks, setTasks } = tasksStore()
