const endTimeUrl = '/api/end-time'
const farmCigsUrl = '/api/farm-cigs'
const addBonusUrl = '/api/add-bonus'
const setAddressUrl = '/api/set-address'
const claimFriendsUrl = '/api/claim-friends'

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

export async function postEndTime(time: string, id: number | null, cigs: number) {
  await postRequest(endTimeUrl, { time, id, cigs })
}

export async function postFarmCigs(cigs: number, id: number | null) {
  await postRequest(farmCigsUrl, { cigs, id })
}

export async function postAddBonus({
  cigs,
  id,
  level,
  index,
}: {
  cigs: number
  id: number | null
  level?: number
  index?: number
}) {
  await postRequest(addBonusUrl, { id, cigs, level, index })
}

export async function postSetAddress(address: string, id: number | null) {
  await postRequest(setAddressUrl, { address, id })
}

export async function postClaimFriends(time: string, id: number | null) {
  await postRequest(claimFriendsUrl, { time, id })
}
