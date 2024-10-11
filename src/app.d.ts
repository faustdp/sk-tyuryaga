import '@poppanator/sveltekit-svg/dist/svg'

import type { Snippet } from 'svelte'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  type Children = Snippet

  interface IconsState {
    readonly icons: {
      cig: boolean
      trash: boolean
    }
    setCig: () => void
    setTrash: () => void
  }
}

declare module '*.svg' {
  const content: any
  export default content
}

export {}
