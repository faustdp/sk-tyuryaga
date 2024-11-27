<script lang="ts">
  import Flash from '@icons/flash.svg?component'
  import Timesand from '@icons/timesand.svg?component'
  import { AMOUNT, TIME } from '@utils/const'

  import data from '@/messages.json'

  let { boost, amount = 123 }: { boost: BoostValue; amount?: number } = $props()
</script>

<span class="flex items-center gap-x-0.5 rounded bg-ccardboost px-1 pb-0.5 pt-[3px] text-sm">
  {#if boost !== AMOUNT}
    <Timesand />
  {:else}
    <Flash />
  {/if} +{amount}
  {boost === TIME ? data.boost_time : `${data.boost_cig}/${data.boost_time}`}
</span>
