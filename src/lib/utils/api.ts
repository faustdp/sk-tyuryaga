import { user } from '@state/user.svelte'
import { taskStatus } from '@utils/const'

const endTimeUrl = '/api/end-time'
const farmCigsUrl = '/api/farm-cigs'
const addBonusUrl = '/api/add-bonus'
const setAddressUrl = '/api/set-address'
const claimFriendsUrl = '/api/claim-friends'
const selectImageUrl = '/api/select-image'
const checkSubscriptionUrl = '/api/check-subscription'
const checkCodeUrl = '/api/check-code'
const taskStatusUrl = '/api/task-status'
export const friendsListUrl = '/api/friends-list'
export const sseUrl = '/api/events/'

async function postRequest(url: string, data: any) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res
  } catch (error) {
    console.error(error)
  }
}

interface PostEndTimeResponse {
  data?:
    | string
    | {
        end_time: string
        farmed_amount: string
        farmed_time: string
      }
  error?: string
}

export async function postEndTime(time: string, cigs: number, farmedTime: number) {
  const res = await postRequest(endTimeUrl, { time, cigs, farmedTime, id: user.id })
  if (!res) return null
  const result: PostEndTimeResponse = await res.json()
  return result
}

interface PostFarmCigs {
  data?: {
    farm_cigs: string
  }
  ok?: boolean
  error?: string
}

export async function postFarmCigs(cigs: number, fromFarm = true) {
  const res = await postRequest(farmCigsUrl, { cigs, fromFarm, id: user.id })
  if (!res) return null
  const result: PostFarmCigs = await res.json()
  return result
}

interface PostAddBonus {
  data?: {
    farm_cigs: string
    level: string
    bonuses: BonusIndexes[]
    selected_images: number[]
  }
  ok?: boolean
  error?: string
}

export async function postAddBonus({ cigs, level, index }: { cigs: number; level?: number; index?: number }) {
  const res = await postRequest(addBonusUrl, { cigs, level, index, id: user.id })
  if (!res) return null
  const result: PostAddBonus = await res.json()
  return result
}

export async function postSetAddress(address: string) {
  const res = await postRequest(setAddressUrl, { address, id: user.id })
  return res ? await res.json() : null
}

interface PostClaimFriends {
  data?: {
    farm_cigs: string
    ref_cigs: string
    claim_friends: string
  }
  ok?: boolean
  error?: string
}

export async function postClaimFriends(time: string, cigs: number) {
  const res = await postRequest(claimFriendsUrl, { time, cigs, id: user.id })
  if (!res) return null
  const result: PostClaimFriends = await res.json()
  return result
}

export async function postSelectImage(index: number, image: number) {
  const res = await postRequest(selectImageUrl, { index, image, id: user.id })
  if (!res) return null
  const result: Omit<PostFarmCigs, 'data'> = await res.json()
  return result
}

export async function postCheckSubscription(name: string) {
  return await postRequest(checkSubscriptionUrl, { name, id: user.tg_id })
}

export async function postCheckCode(task: number, code: string) {
  return await postRequest(checkCodeUrl, { task, code, id: user.id })
}

type Statuses = Exclude<keyof typeof taskStatus, 'loading'>

export async function postTaskStatus(task: number, status: Statuses) {
  return await postRequest(taskStatusUrl, { task, status, id: user.id })
}
