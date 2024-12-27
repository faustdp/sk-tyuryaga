import { type User as TGUser } from 'grammy/types'

type UserForDb = Pick<TGUser, 'username' | 'id' | 'language_code' | 'first_name'>

interface CreateUser {
  tgId: number
  firstName: string
  language?: string
  username?: string
  invitedBy: number | null
}

interface Inviter {
  tg_id: number
  invited_by: number | null
  username: string | null
  first_name: string
}

interface GetUser {
  tg_id: number
  username: string | null
  first_name: string
  invites: number
  level: number
  bonuses: number[]
  activity_days: number
  ref_cigs: number
  farm_cigs: number
  end_time: string | null
  language: string | null
  claim_friends: string | null
  // farm: string
  farmed_amount: number
  address: string | null
}

interface UpdateInvites {
  invites: number
  invited_by: number
  tg_id: number
}

type DbTaskStatus = 'start' | 'check' | 'claim' | 'done'

export { UserForDb, CreateUser, Inviter, GetUser, UpdateInvites, DbTaskStatus }
