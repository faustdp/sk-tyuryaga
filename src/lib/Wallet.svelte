<script lang="ts">
  import Link from '@icons/link.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import Drawer from '@lib/Drawer.svelte'
  import data from '@lib/messages.json'
  import { app, closeWallet } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
  import { logServer, shortenAddress } from '@utils'
  import { TON_KEY } from '@utils/const'
  import { getContext } from 'svelte'
  import { quartOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'

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
      logServer(error, 'error')
    }
  }
</script>

<Drawer isOpened={app.isWalletOpened} handleClose={closeWallet}>
  {#key app.isWalletConnected}
    <span
      class="absolute top-[calc(3rem_+_13px)] flex gap-x-3"
      transition:scale={{ duration: 350, opacity: 0, start: 0.5, easing: quartOut }}>
      {#if app.isWalletConnected}
        <button class="outline-none transition-transform active:scale-90">
          <Link />
        </button>
        {shortenAddress(user.address)}
      {:else}
        {data.wallet_suggest}
      {/if}
    </span>
  {/key}

  <button
    onclick={handleWallet}
    class="relative mt-4 outline-none transition-transform will-change-transform active:scale-95">
    <WalletBtn fill={app.isWalletConnected ? '#728B97' : 'rgb(var(--c-blue))'} />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center">
      {#if app.isWalletConnected}
        {data.wallet_disconnect}
      {:else}
        {data.wallet_connect}
      {/if}
      {data.wallet_name}
    </span>
  </button>
</Drawer>
