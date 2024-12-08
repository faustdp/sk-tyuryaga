import {
  AMOUNT,
  baseAmount,
  baseTime,
  BONUSES,
  CLAIMED,
  COMBO,
  DAY,
  IMG_NAMES,
  LEVELS,
  MINUTE,
  SIXTY,
  TIME,
} from '@utils/const'

import data from '@/messages.json'

interface User {
  tg_id: number | null
  first_name: string
  address: string
  farm: Farm
  direct_invites: number
  indirect_invites: number
  cigs: number
  farm_cigs: number
  ref_cigs: number
  level: number
  claim_friends: number
  end_time: number
  farm_time: number
  farm_amount: number
  current_farm_time: number
  current_farm_amount: number
  tasks_completed: number //TODO TAsk statuses: {} AND CHANGE
  bonuses: BonusIndexes[]
  username?: string | null
}

function userStore() {
  const state = $state<User>({
    tg_id: null,
    first_name: '',
    address: '',
    farm: CLAIMED,
    direct_invites: 0,
    indirect_invites: 0,
    cigs: 0,
    farm_cigs: 0,
    ref_cigs: 0,
    level: 0,
    claim_friends: Date.now() + DAY,
    end_time: 0,
    farm_time: baseTime,
    farm_amount: baseAmount,
    current_farm_time: baseTime * MINUTE,
    current_farm_amount: baseTime * baseAmount,
    tasks_completed: 0,
    bonuses: [],
    username: null,
  })

  function setAddress(wallet: string) {
    state.address = wallet
  }

  function setUser(user: Partial<User>) {
    ;(Object.keys(user) as (keyof User)[]).forEach((key) => {
      const value = user[key]
      if (value !== undefined && key in state) {
        ;(state[key] as (typeof state)[keyof User]) = value as (typeof state)[keyof User]
      }
    })
  }

  function sumCigs() {
    state.cigs = state.farm_cigs + state.ref_cigs
  }

  function setCigs(cigs: number) {
    state.farm_cigs += cigs
    sumCigs()
  }

  function setRefCigs(cigs: number) {
    state.ref_cigs += cigs
    sumCigs()
  }

  function setFarm(farming: Farm) {
    state.farm = farming
  }

  function setEndTime(time: number) {
    if (time < Date.now()) {
      throw new Error(data.inner_error)
    }
    state.current_farm_time = state.farm_time * MINUTE
    state.current_farm_amount = Math.round(state.farm_time * state.farm_amount)
    state.end_time = time
  }

  function upLevel() {
    if (state.level >= LEVELS.length - 1) return
    state.level += 1
    state.bonuses = []
  }

  function setClaimFriends(time: number) {
    state.claim_friends = time
  }

  function addBonus(idx: BonusIndexes) {
    if (state.bonuses.includes(idx)) return
    state.bonuses = [...state.bonuses, idx]
    const bonusType = IMG_NAMES[idx].type
    const isCombo = bonusType === COMBO
    const isTime = bonusType === TIME
    if (isCombo || isTime) {
      const timeBonus = isCombo ? BONUSES[COMBO][TIME][user.level] : BONUSES[TIME][user.level]
      state.farm_time = Math.round((state.farm_time + Math.round((timeBonus / SIXTY) * 1000) / 1000) * 1000) / 1000
    }
    if (!isTime) {
      const amountBonus = isCombo ? BONUSES[COMBO][AMOUNT] : BONUSES[AMOUNT]
      state.farm_amount = state.farm_amount + amountBonus
    }
    if (state.bonuses.length === IMG_NAMES.length) {
      upLevel()
    }
  }

  return {
    get user() {
      return state
    },
    setAddress,
    setUser,
    setCigs,
    setRefCigs,
    setFarm,
    setEndTime,
    upLevel,
    setClaimFriends,
    addBonus,
  }
}

export const {
  user,
  setAddress,
  setUser,
  setCigs,
  setRefCigs,
  setFarm,
  setEndTime,
  upLevel,
  setClaimFriends,
  addBonus,
} = userStore()
