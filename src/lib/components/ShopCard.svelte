<script lang="ts">
  import CardLevel from '@icons/cardLevel.svg?component'
  import Flash from '@icons/flash.svg?component'
  import Timesand from '@icons/timesand.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import Spider from '@images/spider.svg?component'
  import dudka from '@lib/images/dudka.webp'
  import data from '@lib/messages.json'
  import { noop } from '@utils'
  import { BOOST } from '@utils/const'

  type BoostValue = (typeof BOOST)[number]
  let {
    title = 'Советское шампанское',
    level = 1,
    amount = 123,
    boostType = BOOST[1],
    onclick,
  }: { title?: string; level?: number; amount?: number; boostType?: BoostValue; onclick: typeof noop } = $props()
</script>

{#snippet boost({ boost }: { boost: BoostValue })}
  <span class="bg-ccardboost flex items-center gap-x-0.5 rounded px-1 py-0.5 text-sm">
    {#if boost !== BOOST[1]}
      <Timesand class="-mt-px" />
    {:else}
      <Flash class="-mt-px" />
    {/if} +{amount}
    {boost === BOOST[0] ? data.boost_time : data.boost_cig}
  </span>
{/snippet}

<section class="card-shadow relative w-full overflow-hidden rounded-md pb-4 pl-4 pr-2 pt-3 [&:not(:last-of-type)]:mb-4">
  <Spider class="absolute left-1/2 top-0 -translate-x-1/3" />
  <p class="card-level-clip absolute right-0.5 top-0.5 z-20 outline-none">
    <CardLevel />
    <span class="card-level-shadow absolute -top-0.5 flex size-full items-center justify-center text-sm text-cyellow">
      {data.shop_level}.{level}
    </span>
  </p>
  <picture
    class="absolute right-3 top-[10%] h-[80%] w-auto before:absolute before:left-0 before:top-0 before:size-full before:bg-slate-300 before:blur-2xl before:content-empty">
    <img src={dudka} alt="Text" class="relative z-10 h-full" />
  </picture>
  <h2 class="relative mb-3 max-w-44 text-base leading-5 tracking-wider">{title}</h2>
  <div class="relative mb-2 flex min-h-[52px] flex-col items-start gap-y-1">
    {@render boost({ boost: boostType })}
    {#if boostType === BOOST[2]}
      {@render boost({ boost: boostType })}
    {/if}
  </div>
  <button class="relative outline-none transition-transform will-change-transform active:scale-95" {onclick}>
    <WalletBtn width={165} height={37} fill="rgb(var(--c-yellow))" stroke="#95804C" />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center">
      {data.shop_upgrade}
    </span>
  </button>
</section>
