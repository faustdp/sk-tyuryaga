<script lang="ts">
  import Amount from '@icons/Amount.svelte'
  import Cigarette from '@icons/cigarette.svg?component'
  import { user } from '@state/user.svelte'
  import { sineOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'

  let cigs = tweened(user.cigs, {
    duration: 500,
    easing: sineOut,
  })

  $effect(() => {
    cigs.set(user.cigs)
  })
</script>

<section class="stats fixed left-1/2 z-30 mx-auto flex -translate-x-1/2 items-center justify-center gap-x-4">
  <Amount class="stats-amount absolute" />
  <Cigarette class="mb-[3px]" />
  <h1 class="arbutus text-xl text-textlight">{Math.trunc($cigs)}</h1>
</section>
