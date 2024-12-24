import { user } from '@state/user.svelte'
import { getFriends } from '@utils/api'

/** @type {import('./$types').PageLoad} */
export async function load() {
  if (!user.tg_id) return {}
  const data = await getFriends(user.tg_id)
  console.log('+page6', data)
  return {}
}
