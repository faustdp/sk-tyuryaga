<script lang="ts">
  import Box from '@lib/images/Box.svelte'
  import Cigarette from '@lib/images/cigarette.svg?component'
  import Trash from '@lib/images/trash.svg?component'
  import Tv from '@lib/images/Tv.svelte'
  import { iconsState, setCig, setTrash } from '@state/icons.svelte'
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="flex flex-col items-center justify-center pt-20">
  <div class="flex items-center">
    Click: <button class="ml-4 h-20 w-20" onclick={setTrash}>
      {#if iconsState.trash}
        <Trash />
      {:else}
        <Box classes="static" />
      {/if}
    </button>
  </div>
  <div class="flex items-center">
    Click: <button class="ml-4 h-20 w-20" onclick={setCig}>
      {#if iconsState.cig}
        <Cigarette />
      {:else}
        <Tv classes="static" />
      {/if}</button>
  </div>
</div>
