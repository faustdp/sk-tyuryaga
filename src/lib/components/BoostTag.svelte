<script lang="ts">
  import Flash from '@icons/flash.svg?component'
  import Timesand from '@icons/timesand.svg?component'
  import data from '@lib/messages.json'
  import { BOOST } from '@utils/const'

  let { boost, amount = 123 }: { boost: BoostValue; amount?: number } = $props()
</script>

<span class="flex items-center gap-x-0.5 rounded bg-ccardboost px-1 pb-0.5 pt-[3px] text-sm">
  {#if boost !== BOOST[1]}
    <Timesand />
  {:else}
    <Flash />
  {/if} +{amount}
  {boost === BOOST[0] ? data.boost_time : data.boost_cig}
</span>
