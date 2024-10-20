<script lang="ts">
  import Chain from '@icons/Chain.svelte'
  import Cross from '@icons/Cross.svelte'
  import Link from '@icons/link.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app, closeWallet } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
  import { shortenAddress } from '@utils'
  import { debug } from '@utils'
  import { TON_KEY } from '@utils/const'
  import { getContext } from 'svelte'
  import { quartOut } from 'svelte/easing'
  import { fly, scale } from 'svelte/transition'

  const tonConnectUI = getContext<TonUI>(TON_KEY)

  async function handleWallet() {
    try {
      if (tonConnectUI.connected) {
        await tonConnectUI.disconnect()
      } else {
        await tonConnectUI.openModal()
      }
    } catch (error) {
      console.log('Wallet24', error)
      debug(error, 'error')
    }
  }
</script>

{#if app.isWalletOpened}
  <section
    transition:fly={{ y: 200, opacity: 0, duration: 250, easing: quartOut }}
    class="fixed bottom-[max(0px,_calc((var(--screen)_-_var(--height-limit))_/_2))] left-1/2 z-40
   mx-auto flex w-full max-w-limit -translate-x-1/2 justify-center bg-cdarkblue
     pb-10 pt-12 shadow-wallet maxheight:!left-0">
    <Chain />
    <div class="flex w-full max-w-[340px] flex-col items-center gap-y-4">
      {#if app.isWalletConnected}
        <span
          class="absolute top-[calc(3rem_+_13px)] flex gap-x-3"
          transition:scale={{ duration: 350, opacity: 0, start: 0.5, easing: quartOut }}>
          <button class="outline-none transition-transform active:scale-90"><Link /></button>
          {shortenAddress(user.address)}
        </span>
      {/if}
      <button
        onclick={closeWallet}
        class="-mr-2 flex items-center justify-center self-end outline-none transition-transform active:scale-95">
        <Cross />
      </button>
      <button
        onclick={handleWallet}
        class="relative outline-none transition-transform will-change-transform active:scale-95">
        <WalletBtn isConnected={app.isWalletConnected} />
        <span class="absolute left-0 top-0 flex size-full items-center justify-center">
          {#if app.isWalletConnected}
            Отключить
          {:else}
            Подключить
          {/if} TON кошелек
        </span>
      </button>
    </div>
  </section>
{/if}
