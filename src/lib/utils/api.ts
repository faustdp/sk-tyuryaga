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

export async function postEndTime(time: string, cigs: number, farmedTime: number) {
  await postRequest(endTimeUrl, { time, cigs, farmedTime, id: user.tg_id })
}

export async function postFarmCigs(cigs: number) {
  await postRequest(farmCigsUrl, { cigs, id: user.tg_id })
}

export async function postAddBonus({ cigs, level, index }: { cigs: number; level?: number; index?: number }) {
  await postRequest(addBonusUrl, { cigs, level, index, id: user.tg_id })
}

export async function postSetAddress(address: string) {
  const res = await postRequest(setAddressUrl, { address, id: user.tg_id })
  return res ? await res.json() : null
}

export async function postClaimFriends(time: string, cigs: number) {
  await postRequest(claimFriendsUrl, { time, cigs, id: user.tg_id })
}

export async function postSelectImage(index: number, image: number) {
  await postRequest(selectImageUrl, { index, image, id: user.tg_id })
}

export async function postCheckSubscription(name: string) {
  return await postRequest(checkSubscriptionUrl, { name, id: user.tg_id })
}

export async function postCheckCode(task: number, code: string) {
  return await postRequest(checkCodeUrl, { task, code, id: user.tg_id })
}

type Statuses = Exclude<keyof typeof taskStatus, 'loading'>

export async function postTaskStatus(task: number, status: Statuses) {
  return await postRequest(taskStatusUrl, { task, status, id: user.tg_id })
}
