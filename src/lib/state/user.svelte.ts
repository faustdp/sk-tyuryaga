import { AMOUNT, BONUSES, CLAIMED, COMBO, DAY, IMG_NAMES, LEVELS, MINUTE, SIXTY, TIME } from '@utils/const'

import data from '@/messages.json'

type Farm = 'farming' | 'farmed' | 'claimed'

interface User {
  tg_id: number | null
  first_name: string
  address: string
  farm: Farm
  direct_invites: number
  indirect_invites: number
  cigs: number
  level: number
  claimFriends: number
  endTime: number
  farmTime: number
  farmAmount: number
  currentFarmTime: number
  currentFarmAmount: number
  bonuses: BonusIndexes[]
  username?: string | null
  //TODO TAsk statuses: {}
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
    level: 0,
    claimFriends: Date.now() + DAY,
    endTime: 0,
    farmTime: LEVELS[0].baseTime * MINUTE,
    farmAmount: LEVELS[0].baseTime * LEVELS[0].baseAmount,
    currentFarmTime: LEVELS[0].baseTime * MINUTE,
    currentFarmAmount: LEVELS[0].baseTime * LEVELS[0].baseAmount,
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

  function setCigs(cigs: number) {
    state.cigs += cigs
  }

  function setFarm(farming: Farm) {
    state.farm = farming
  }

  function setEndTime(time: number) {
    if (time < Date.now()) {
      throw new Error(data.inner_error)
    }
    state.endTime = time
  }

  function upLevel() {
    if (state.level >= LEVELS.length - 2) return
    state.level += 1
    removeBonuses()
    state.farmTime = LEVELS[state.level].baseTime * MINUTE
    state.farmAmount = calcFarmAmount(0)
  }

  function setClaimFriends(time: number) {
    state.claimFriends = time
  }

  function setCurrentFarmTime() {
    state.currentFarmTime = state.farmTime
  }

  function setCurrentFarmAmount() {
    state.currentFarmAmount = state.farmAmount
  }

  function getBonuses(bonuses: BonusIndexes[]): [number, number] {
    const result: [number, number] = [0, 0]
    bonuses.forEach((bonusNumber) => {
      const bonusType = IMG_NAMES[bonusNumber].type
      const isCombo = bonusType === COMBO
      if (isCombo) {
        const bonus = BONUSES[COMBO]
        result[0] += bonus[TIME][user.level]
        result[1] += bonus[AMOUNT]
      } else {
        result[bonusType === TIME ? 0 : 1] += bonusType === TIME ? BONUSES[TIME][user.level] : BONUSES[AMOUNT]
      }
    })
    return result
  }

  const calcFarmAmount = (bonus: number, time?: number) =>
    Math.ceil((LEVELS[state.level].baseAmount + bonus) * (time ? time : LEVELS[state.level].baseTime))

  function setFarmMetrics() {
    const [timeBonus, amountBonus] = getBonuses(state.bonuses)
    const farmTime = LEVELS[state.level].baseTime + Math.round((timeBonus / SIXTY) * 100) / 100
    state.farmTime = farmTime * MINUTE
    state.farmAmount = calcFarmAmount(amountBonus, farmTime)
  }

  function addBonus(idx: BonusIndexes) {
    if (state.bonuses.includes(idx)) return
    state.bonuses = [...state.bonuses, idx]
    setFarmMetrics()
  }

  function removeBonuses() {
    state.bonuses = []
  }

  return {
    get user() {
      return state
    },
    setAddress,
    setUser,
    setCigs,
    setFarm,
    setEndTime,
    setCurrentFarmTime,
    upLevel,
    setClaimFriends,
    setCurrentFarmAmount,
    addBonus,
    removeBonuses,
  }
}

export const {
  user,
  setAddress,
  setUser,
  setCigs,
  setFarm,
  setEndTime,
  setCurrentFarmTime,
  upLevel,
  setClaimFriends,
  setCurrentFarmAmount,
  addBonus,
  removeBonuses,
} = userStore()
