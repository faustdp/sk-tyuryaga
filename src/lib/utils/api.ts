import { user } from '@state/user.svelte'

const endTimeUrl = '/api/end-time'
const farmCigsUrl = '/api/farm-cigs'
const addBonusUrl = '/api/add-bonus'
const setAddressUrl = '/api/set-address'
const claimFriendsUrl = '/api/claim-friends'
const selectImageUrl = '/api/select-image'
const getFriendsUrl = '/api/get-friends'

async function postRequest(url: string, data: any) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error(error)
  }
}

export async function postEndTime(time: string, cigs: number) {
  await postRequest(endTimeUrl, { time, cigs, id: user.tg_id })
}

export async function postFarmCigs(cigs: number) {
  await postRequest(farmCigsUrl, { cigs, id: user.tg_id })
}

export async function postAddBonus({ cigs, level, index }: { cigs: number; level?: number; index?: number }) {
  await postRequest(addBonusUrl, { cigs, level, index, id: user.tg_id })
}

export async function postSetAddress(address: string) {
  await postRequest(setAddressUrl, { address, id: user.tg_id })
}

export async function postClaimFriends(time: string) {
  await postRequest(claimFriendsUrl, { time, id: user.tg_id })
}

export async function postSelectImage(index: number, image: number) {
  await postRequest(selectImageUrl, { index, image, id: user.tg_id })
}

export async function getFriends(id: number | null) {
  //TODO POST
  try {
    const data = await fetch(getFriendsUrl)
    console.log('api53', data)
    const res = await data.json()
    return res
  } catch (error) {
    console.error(error)
  }
}
