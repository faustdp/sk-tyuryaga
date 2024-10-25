<script lang="ts">
  import { type Component } from 'svelte'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  interface Props {
    Icon: Component
    url?: string
    isBig?: boolean
    isBlue?: boolean
    isHeader?: boolean
    children?: Children
    onclick?: any
  }

  const { Icon, url = '', isBig = false, isBlue = false, isHeader = false, children, ...rest }: Props = $props()

  let isActive = $state(false)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      isActive = true

      if (url) event.preventDefault()
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      isActive = false
      if (url) goto(url, { keepFocus: true })
    }
  }

  function handleTouchStart() {
    if (url && url === $page.url.pathname) return
    isActive = true
  }

  let rootClasses = $derived(
    `${isActive ? '!scale-95' : 'scale-100'} flex select-none flex-col gap-y-[2px]
     items-center outline-none transition will-change-transform relative`,
  )

  let isCurrPath = $derived(url && url === $page.url.pathname)
</script>

<svelte:element
  this={url ? 'a' : 'button'}
  href={url || null}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
  ontouchstart={handleTouchStart}
  ontouchend={() => (isActive = false)}
  onmousedown={() => (isActive = true)}
  onmouseup={() => (isActive = false)}
  onmouseleave={() => (isActive = false)}
  role={url ? 'link' : 'button'}
  class={rootClasses}
  {...rest}>
  <span
    class="{isHeader ? 'bg-cwallet' : 'bg-cgrey'} {isBig ? '-mt-[20px] h-[70px] w-[70px]' : 'h-[50px] w-[50px]'}
     relative flex items-center justify-center rounded-md">
    <Icon class="absolute block" />
    <svg
      class="absolute {isBig
        ? 'left-[-3.5px] top-[-3px] h-[77px] w-[78px]'
        : 'left-[-3px] top-[-2.5px] h-[55px] w-[56px]'}">
      <use href="#chain"></use>
    </svg>
  </span>
  {#if children}
    <span
      class="{isBlue ? 'z-10 mt-[-3px] bg-cblue pt-1' : 'pt-0.5'} {isCurrPath ? 'text-cyellow' : 'text-textgrey'}
      inline-block rounded-md px-1.5 pb-1 text-sm smallscreen:px-0.5">
      {@render children()}
    </span>
  {/if}
  {#if isBlue}
    <svg class="absolute -top-2.5 right-1.5 h-5 w-5"><use href="#ton"></use></svg>
  {/if}
</svelte:element>
