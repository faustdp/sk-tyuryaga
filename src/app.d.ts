import '@poppanator/sveltekit-svg/dist/svg'

import { type TonConnectUI } from '@tonconnect/ui'
import { BOOST } from '@utils/const'
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

  interface User {
    address: string
    id: number | null
    first_name: string | null
    direct_invites: number
    indirect_invites: number
    cigs: number
    level: number
    username?: string | null
  }

  type Status = 0 | 1 | 2 | 3 | 4

  type BoostValue = (typeof BOOST)[number]

  interface SocialItem {
    id: number
    Icon: Component
    task: string
    reward: string
    status: Status
    link: string
    delay?: number
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
