import { postAddBonus, postSelectImage } from '@utils/api'
import { AMOUNT, BONUSES, CLAIMED, COMBO, DAY, IMG_NAMES, LEVELS, MINUTE, SIXTY, TIME } from '@utils/const'

interface User {
  //TODO SetCookie tg_id
  tg_id: number | null
  username: string | null
  first_name: string
  address: string
  language: string
  invites: number
  level: number
  cigs: number
  farm_cigs: number
  ref_cigs: number //TODO
  claim_friends: number
  amount_friends: number //TODO
  end_time: number
  farm_time: number
  farm_amount: number
  current_farm_time: number
  current_farm_amount: number
  tasks_completed: number
  activity_days: number
  farm: Farm
  bonuses: BonusIndexes[]
  selected_images: number[] //TODO BACKEDN
}

function userStore() {
  const state = $state<User>({
    tg_id: null,
    username: null,
    first_name: '',
    address: '',
    language: 'ru',
    invites: 0,
    level: 0,
    cigs: 0,
    farm_cigs: 0,
    ref_cigs: 0,
    claim_friends: Date.now() + DAY,
    amount_friends: 0,
    end_time: 0,
    farm_time: LEVELS[0].baseTime,
    farm_amount: LEVELS[0].baseAmount,
    current_farm_time: LEVELS[0].baseTime * MINUTE,
    current_farm_amount: LEVELS[0].baseTime * LEVELS[0].baseAmount,
    tasks_completed: 0,
    activity_days: 0,
    farm: CLAIMED,
    bonuses: [],
    selected_images: Array.from({ length: IMG_NAMES.length }, () => -1),
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

  function calcBonus(idx: number) {
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
  }

  function setBaseFarm(level: number, bonuses: number[]) {
    state.farm_time = LEVELS[level].baseTime
    state.farm_amount = LEVELS[level].baseAmount
    bonuses.forEach((idx) => {
      calcBonus(idx)
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
    //TODO BACK
    state.ref_cigs += cigs
    sumCigs()
  }

  function setFarm(farming: Farm) {
    state.farm = farming
  }

  function setEndTime(time: number) {
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

  function setAmountFriends(cigs: number) {
    //TODO:USE
    state.amount_friends = cigs
  }

  function selectImage(index: number, image: number) {
    if (index >= IMG_NAMES.length - 1) return
    state.selected_images[index] = image
  }

  async function addBonus(idx: BonusIndexes, cigs: number) {
    if (state.bonuses.includes(idx)) return
    state.bonuses = [...state.bonuses, idx]
    const level = user.level
    user.selected_images[idx] = level
    calcBonus(idx)
    const isLevelUp = state.bonuses.length >= IMG_NAMES.length
    if (isLevelUp) {
      upLevel()
    }
    if (cigs) {
      setCigs(cigs)
    }
    await Promise.all([
      postAddBonus({ cigs, ...(isLevelUp ? { level: state.level } : { index: idx }) }),
      postSelectImage(idx, level),
    ])
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
    setBaseFarm,
    setClaimFriends,
    setAmountFriends,
    addBonus,
    selectImage,
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
  setBaseFarm,
  setClaimFriends,
  setAmountFriends,
  addBonus,
  selectImage,
} = userStore()
