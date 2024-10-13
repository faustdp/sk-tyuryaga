<script lang="ts">
  import FarmBtn from '@icons/FarmBtn.svelte'
  import { onMount } from 'svelte'
  // import { sineInOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'

  const progress = tweened(1, {
    duration: 5000,
    // easing: sineInOut,
  })

  onMount(() => {
    // $progress = 0
  })
</script>

<section class="farm fixed left-1/2 z-30 mx-auto flex max-w-xs -translate-x-1/2 items-center justify-center gap-x-4">
  <FarmBtn {progress} />
  <h2 class="text-xl">Начать фармить</h2>
</section>

<style>
  .farm {
    bottom: calc(50% - ((min(var(--height-limit), var(--screen)) / 2) - 160px)); /* bot nav height + ~btn */
    border-radius: 12px;
    width: 256px;
    height: 50px;
  }
</style>
