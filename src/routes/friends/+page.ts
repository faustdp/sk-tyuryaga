import { user } from '@state/user.svelte'
import { friendsListUrl } from '@utils/api'

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
  depends('app:friends')
  if (!user.id || user.invites === 0) return {}
  try {
    const result = await fetch(friendsListUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    })
    const response = await result?.json()
    if (!response?.data) return {}
    return { friends: response.data }
  } catch (error) {
    console.error(error)
  }
}
