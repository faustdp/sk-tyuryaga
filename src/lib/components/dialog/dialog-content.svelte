<script lang="ts">
  import Cross from '@icons/Cross.svelte'
  import { cn } from '@utils'
  import { Dialog as DialogPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import * as Dialog from './index.js'

  let {
    ref = $bindable(null),
    class: className,
    isAbsolute,
    withMargin = false,
    children,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    children: Snippet
    isAbsolute?: boolean
    withMargin?: boolean
  } = $props()

  const classes = isAbsolute ? 'right-0.5 top-1.5' : '-top-20 -right-2.5'
</script>

<Dialog.Portal>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    bind:ref
    class={cn(
      `fixed left-1/2 top-1/2 z-50 grid w-full max-w-sm -translate-x-1/2 -translate-y-1/2 !overflow-visible rounded-xl border px-4 pb-5 pt-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`,
      className,
      withMargin && '-mt-16',
    )}
    {...restProps}>
    <DialogPrimitive.Close class="absolute {classes} outline-none transition-transform hover:scale-95">
      <Cross />
      <span class="sr-only">Close</span>
    </DialogPrimitive.Close>
    {@render children?.()}
  </DialogPrimitive.Content>
</Dialog.Portal>
