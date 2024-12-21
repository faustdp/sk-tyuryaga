const endTimeUrl = '/api/end-time'
const farmCigsUrl = '/api/farm-cigs'
// const farmedCigsUrl = '/api/farmed-cigs'

export async function postEndTime(time: string, id: number | null, cigs: number) {
  try {
    await fetch(endTimeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time, id, cigs }),
    })
  } catch (error) {
    console.error(error)
  }
}

export async function postFarmCigs(cigs: number, id: number | null) {
  try {
    await fetch(farmCigsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cigs, id }),
    })
  } catch (error) {
    console.error(error)
  }
}

// export async function postSetFarmed(cigs: number, id: number | null) {
//   try {
//     await fetch(farmedCigsUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ cigs, id }),
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }
