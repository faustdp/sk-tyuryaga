import { type User as TGUser } from 'grammy/types'

type UserForDb = Pick<TGUser, 'username' | 'id' | 'language_code' | 'first_name'>

interface CreateUser {
  tgId: string
  firstName: string
  language?: string
  username?: string
  invitedById?: number
}

interface Inviter {
  id: number
  tg_id: number
  invited_by_id: number | null
  username: string | null
  first_name: string
}

interface GetUser {
  /*   tg_id: number
  username: string | null
  first_name: string
  invites: number
  level: number
  bonuses: number[]
  selected_images: number[]
  activity_days: number
  ref_cigs: number
  farm_cigs: number
  end_time: string | null
  language: string | null
  claim_friends: string | null
  farmed_amount: number
  farmed_time: number */
  id: number
  tg_id: string
  username: string | null
  first_name: string
  invites: string
  level: string
  bonuses: number[]
  selected_images: number[]
  activity_days: string
  ref_cigs: string
  farm_cigs: string
  end_time: string | null
  language: string | null
  claim_friends: string | null
  farmed_amount: string
  farmed_time: string
}

interface UpdateInvites {
  invites: string
  invited_by_id: number
  tg_id: string
}

interface FriendsUser {
  id: number
  tg_id: string
  first_name: string
  farm_cigs: string
  ref_cigs: string
  depth: number
  invitees?: FriendsUser[]
}

type DbTaskStatus = 'start' | 'check' | 'claim' | 'done'

export { UserForDb, CreateUser, Inviter, GetUser, UpdateInvites, DbTaskStatus, FriendsUser }
