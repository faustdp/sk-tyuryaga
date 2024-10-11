<script lang="ts">
  import { type Component } from 'svelte'

  interface Props {
    Icon: Component
    url?: string
    width?: string
    height?: string
    children: Children
  }

  const { Icon, url = '', children, width = 'w-[50px]', height = 'h-[50px]', ...rest }: Props = $props()

  let classes = $derived(`bg-cgrey flex justify-center items-center relative rounded-md ${width} ${height}`)

  // $effect(() => {
  //   classes = `bg-cgrey ${width} ${height}`
  // })
</script>

<svelte:element this={url ? 'a' : 'button'} href={url || null} class="flex flex-col items-center gap-x-1.5" {...rest}>
  <span class={classes}>
    <Icon />
    <svg class="absolute left-[-3px] top-[-2.5px] h-[55px] w-[56px]">
      <use href="#chain"></use>
    </svg></span>
  {#if children}
    <span>{@render children()}</span>
  {/if}
</svelte:element>
