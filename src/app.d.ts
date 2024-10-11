// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import '@poppanator/sveltekit-svg/dist/svg'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

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
