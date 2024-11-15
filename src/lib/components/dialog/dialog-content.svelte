<script lang="ts">
  import Cross from '@icons/Cross.svelte'
  import { cn } from '@utils'
  import { Dialog as DialogPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import * as Dialog from './index.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    children: Snippet
  } = $props()
</script>

<Dialog.Portal>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    bind:ref
    class={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl border px-4 pb-5 pt-4 duration-200',
      className,
    )}
    {...restProps}>
    {@render children?.()}
    <DialogPrimitive.Close class="absolute right-0.5 top-1.5 outline-none transition-transform hover:scale-95">
      <Cross />
      <span class="sr-only">Close</span>
    </DialogPrimitive.Close>
  </DialogPrimitive.Content>
</Dialog.Portal>
