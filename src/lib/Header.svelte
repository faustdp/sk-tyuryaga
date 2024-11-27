<script lang="ts">
  import NavBtn from '@components/NavBtn.svelte'
  import User from '@icons/user.svg?component'
  import Wallet from '@icons/wallet.svg?component'
  import { openWallet } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
</script>

<header
  class="fixed top-0 z-30 flex
   w-full justify-center maxheight:!left-0 maxheight:!-z-10">
  <section class="bg-header flex w-full max-w-limit justify-between px-4 pt-2.5">
    <p class="flex items-center justify-center gap-x-1">
      <User />
      <span>{user.first_name}</span>
    </p>
    <NavBtn onclick={openWallet} Icon={Wallet} isHeader />
  </section>
</header>
