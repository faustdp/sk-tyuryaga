<script lang="ts">
  import CardLevel from '@icons/cardLevel.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { openModal } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
  import { getImgUrl } from '@utils'
  import useRipple from '@utils/useRipple.svelte'

  import data from '@/messages.json'

  let { idx, onclick } = $props()

  function handleClick() {
    onclick(idx)
    openModal()
  }
</script>

<section class="relative w-full">
  <div class="pb-4">
    <p class="card-level-clip absolute right-0.5 top-0.5 z-20">
      <CardLevel />
      <span class="card-level-shadow absolute -top-0.5 flex size-full items-center justify-center text-sm text-cyellow">
        {data.shop_level}.{user.selected_images[idx] < 0 ? 1 : user.selected_images[idx] + 1}
      </span>
    </p>
    <picture
      class="card-shadow relative mb-2 flex flex-wrap justify-center overflow-hidden rounded-md
        pb-5 pt-6 before:absolute before:left-0 before:top-0 before:size-full before:bg-slate-300 before:blur-2xl before:content-empty">
      <img
        src={getImgUrl(idx, user.selected_images[idx] < 0 ? 0 : user.selected_images[idx])}
        width="100"
        height="100"
        alt="Text"
        class="relative z-10 h-full" />
    </picture>
  </div>
  <button use:useRipple onclick={handleClick} class="absolute -bottom-1 w-full overflow-hidden rounded-xl outline-none">
    <WalletBtn width={165} height={37} classes="w-full" fill="rgb(var(--c-yellow))" stroke="var(--dark-yellow)" />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center">
      {data.select}
    </span>
  </button>
</section>
