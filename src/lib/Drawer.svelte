<script lang="ts">
  import Chain from '@icons/Chain.svelte'
  import Cross from '@icons/Cross.svelte'
  import { quartOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  let {
    isOpened = false,
    handleClose,
    children,
  }: { isOpened: boolean; handleClose: () => void; children: Children } = $props()
</script>

<!-- bottom-[max(0px,_calc((var(--screen)_-_var(--height-limit))_/_2))] -->
{#if isOpened}
  <section
    transition:fly={{ y: 200, opacity: 0, duration: 250, easing: quartOut }}
    class="fixed bottom-0 left-1/2 z-50 mx-auto flex max-h-[90vh] w-full -translate-x-1/2
     bg-cdarkblue pb-8 pt-12 shadow-wallet maxheight:!left-0">
    <Chain />
    <div class="flex w-full justify-center overflow-y-auto">
      <div class="flex w-full max-w-[360px] flex-col items-center px-2">
        <button
          onclick={handleClose}
          class="-mr-2 flex items-center justify-center self-end outline-none transition-transform active:scale-95">
          <Cross />
        </button>
        {@render children()}
      </div>
    </div>
  </section>
{/if}
