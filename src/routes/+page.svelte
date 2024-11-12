<script lang="ts">
  // let {data} = $props() $effect(() => {console.log('+page12', data)})
  import Basket from '@images/basket.svg?component'
  import Box from '@images/Box.svelte'
  import Cigarette from '@images/cigarette.svg?component'
  import Portrait from '@images/Portrait.svelte'
  import Steam from '@images/Steam.svelte'
  import Trash from '@images/trash.svg?component'
  import Tv from '@images/Tv.svelte'
  import Farming from '@lib/Farming.svelte'
  import Header from '@lib/Header.svelte'
  import data from '@lib/messages.json'
  import Stats from '@lib/Stats.svelte'
  import Wallet from '@lib/Wallet.svelte'
  import { iconsState } from '@state/icons.svelte'
</script>

<svelte:head>
  <title>{data.home_title}</title>
  <meta name="description" content={data.home_content} />
</svelte:head>

<main
  class="perspective mx-auto h-full max-w-limit flex-col items-center justify-center
       overflow-hidden bg-[url('@images/bg.webp')] bg-half bg-center bg-no-repeat">
  <Header />
  <Stats />

  {#if iconsState.trash}
    <Trash class="absolute left-[calc(50%_-_157px)] top-[calc(50%_-_59px)] w-14" />
  {:else}
    <Box />
  {/if}
  {#if iconsState.cig}
    <Cigarette class="absolute left-[calc(50%_-_152px)] top-[calc(50%_-_172px)] w-14 rotate-[33deg]" />
  {:else}
    <Tv />
  {/if}
  <Portrait />
  <Farming />
  <Steam />
  <Basket class="absolute left-[calc(50%_-_202px)] top-[calc(50%_+_0px)] h-28 w-28" />
</main>

<Wallet />
