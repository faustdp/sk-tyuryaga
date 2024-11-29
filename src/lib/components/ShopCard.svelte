<script lang="ts">
  import BoostTag from '@components/BoostTag.svelte'
  import CardLevel from '@icons/cardLevel.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import Spider from '@images/Spider.svelte'
  import { getImgUrl, noop } from '@utils'
  import { AMOUNT, BONUSES, COMBO, TIME } from '@utils/const'

  import data from '@/messages.json'

  let {
    title = 'Советское шампанское',
    level = 0,
    boostType = AMOUNT,
    index,
    onclick,
  }: { title?: string; level?: number; boostType?: BoostValue; index: number; onclick: typeof noop } = $props()
</script>

<section class="card-shadow relative w-full overflow-hidden rounded-md pb-4 pl-4 pr-2 pt-3 [&:not(:last-of-type)]:mb-4">
  <Spider classes="absolute left-1/2 top-0 -translate-x-1/3" />
  <p class="card-level-clip absolute right-0.5 top-0.5 z-20">
    <CardLevel />
    <span class="card-level-shadow absolute -top-0.5 flex size-full items-center justify-center text-sm text-cyellow">
      {data.shop_level}.{level + 1}
    </span>
  </p>
  <picture
    class="absolute right-3 top-[10%] h-[82%] w-auto py-1.5 before:absolute before:left-0 before:top-0 before:size-full before:bg-slate-300 before:blur-2xl before:content-empty">
    <img src={getImgUrl(index, level)} alt="Text" class="relative z-10 h-full" />
  </picture>
  <h2 class="relative mb-3 max-w-44 text-base leading-5 tracking-wider">{title}</h2>
  <div class="relative mb-2 flex min-h-[52px] flex-col items-start gap-y-1">
    <BoostTag
      boost={boostType}
      amount={boostType === COMBO
        ? BONUSES[COMBO][AMOUNT]
        : boostType === AMOUNT
          ? BONUSES[AMOUNT]
          : BONUSES[TIME][level]} />
    {#if boostType === COMBO}
      <BoostTag boost={TIME} amount={BONUSES[COMBO][TIME][level]} />
    {/if}
  </div>
  <button class="relative outline-none transition-transform will-change-transform active:scale-95" {onclick}>
    <WalletBtn width={165} height={37} fill="rgb(var(--c-yellow))" stroke="var(--dark-yellow)" />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center">
      {data.shop_upgrade}
    </span>
  </button>
</section>
