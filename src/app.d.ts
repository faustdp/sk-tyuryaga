import '@poppanator/sveltekit-svg/dist/svg'

import { type TonConnectUI } from '@tonconnect/ui'
import { AMOUNT, COMBO, TIME } from '@utils/const'
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

  type Status = 0 | 1 | 2 | 3 | 4

  type BoostValue = typeof TIME | typeof AMOUNT | typeof COMBO

  type BonusIndexes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

  interface SocialItem {
    id: number
    Icon: Component
    task: string
    reward: string
    status: Status
    link: string
    delay?: number
  }

  type ShopTabs = 0 | 1 | 2

  interface Window {
    _tonConnectUI?: TonConnectUI
  }
}

declare module '*.svg' {
  const content: any
  export default content
}

export {}
