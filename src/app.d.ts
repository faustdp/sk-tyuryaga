import '@poppanator/sveltekit-svg/dist/svg'

import { type TonConnectUI } from '@tonconnect/ui'
import {
  AMOUNT,
  CLAIMED,
  COMBO,
  FARMED,
  FARMING,
  TASK_CODE,
  TASK_INVITE,
  TASK_SUBSCRIBE,
  taskStatus,
  TIME,
} from '@utils/const'
import type { Snippet } from 'svelte'

declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface ValidationResponse {
    valid: boolean
    userData?: any
    error?: string
  }

  type Children = Snippet

  type TonUI = TonConnectUI

  interface TypedError extends Error {
    type: string
    code?: number
    details?: any
  }

  type BonusIndexes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

  type BoostValue = typeof TIME | typeof AMOUNT | typeof COMBO

  interface Images {
    type: BoostValue
    idx: BonusIndexes
    name: string[]
    desc: string
    class: string
    width?: string
  }

  type IconsComponents = Record<string, Component>

  type Farm = typeof FARMING | typeof FARMED | typeof CLAIMED

  type TaskType = typeof TASK_INVITE | typeof TASK_CODE | typeof TASK_SUBSCRIBE

  type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus]

  interface SocialItem {
    id: number
    Icon: string
    name: string
    reward: number
    status: TaskStatus
    type: TaskType
    userCodes: string[]
    codesAmount: string | null
    invites?: number
    delay?: number
    link?: string
  }

  interface Window {
    _tonConnectUI?: TonConnectUI
  }

  interface FriendStat {
    first_name: string
    farm_cigs: string
    ref_cigs: string
    depth: number
    invitees?: FriendStat[]
  }
}

declare module '*.svg' {
  const content: any
  export default content
}

export {}
