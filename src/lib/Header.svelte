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
  <section class="bg-header flex w-full max-w-limit justify-between gap-x-3 pl-24 pr-20 pt-7">
    <p class="flex items-center justify-center gap-x-1 truncate">
      <User class="shrink-0 basis-11" />
      <span class="flex-shrink truncate">{user.first_name}</span>
    </p>
    <NavBtn onclick={openWallet} Icon={Wallet} isHeader />
  </section>
</header>
