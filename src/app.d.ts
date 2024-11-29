import '@poppanator/sveltekit-svg/dist/svg'

import { type TonConnectUI } from '@tonconnect/ui'
import { AMOUNT, COMBO, TASK_CODE, TASK_INVITE, TASK_SUBSCRIBE, TIME } from '@utils/const'
import type { Snippet } from 'svelte'

declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  type Children = Snippet

  type TonUI = TonConnectUI

  interface TypedError extends Error {
    type: string
    code?: number
    details?: any
  }

  interface Images {
    name: string[]
    type: BoostValue
    idx: number
  }

  type BoostValue = typeof TIME | typeof AMOUNT | typeof COMBO
  type BonusIndexes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

  type TaskStatus = 0 | 1 | 2 | 3 | 4
  type TaskType = typeof TASK_INVITE | typeof TASK_CODE | typeof TASK_SUBSCRIBE

  interface SocialItem {
    id: number
    Icon: Component
    task: string
    reward: string
    status: TaskStatus
    type: TaskType
    invites?: number
    delay?: number
    link?: string
  }

  interface SocialItemInvite extends SocialItem {
    type: typeof TASK_INVITE
    invites: number
  }

  interface SocialItemSubscribe extends SocialItem {
    type: typeof TASK_SUBSCRIBE
    delay: number
  }

  interface SocialItemCode extends SocialItem {
    type: typeof TASK_CODE
    link: string
  }

  interface Window {
    _tonConnectUI?: TonConnectUI
  }
}

declare module '*.svg' {
  const content: any
  export default content
}

export {}
