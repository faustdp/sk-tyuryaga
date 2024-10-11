<script lang="ts">
  import Box from '@images/Box.svelte'
  import Cigarette from '@images/cigarette.svg?component'
  import Portrait from '@images/Portrait.svelte'
  import Trash from '@images/trash.svg?component'
  import Tv from '@images/Tv.svelte'
  import { iconsState } from '@state/icons.svelte'
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>
<!-- let {data} = $props() $effect(() => {console.log('+page12', data)}) -->
<main
  class="perspective relative mx-auto h-full max-w-[556px] flex-col items-center justify-center
       overflow-hidden bg-[url('@images/bg.webp')] bg-half bg-center bg-no-repeat">
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
</main>

<style>
</style>
