<script lang="ts">
  import Flash from '@icons/flash.svg?component'
  import Timesand from '@icons/timesand.svg?component'
  import { TIME } from '@utils/const'

  import data from '@/messages.json'

  let { boost, amount }: { boost: BoostValue; amount: number } = $props()
</script>

<span class="flex items-center gap-x-0.5 rounded bg-ccardboost px-1 pb-0.5 pt-[3px] text-sm">
  {#if boost === TIME}
    <Timesand />
  {:else}
    <Flash />
  {/if}
  +{boost !== TIME ? amount : Math.round((amount / 60) * 100) / 100}
  {boost === TIME ? data.boost_time : `${data.boost_cig}/${data.boost_time}`}
</span>
