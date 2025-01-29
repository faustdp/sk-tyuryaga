<script lang="ts">
  import Amount from '@icons/Amount.svelte'
  import Cigarette from '@icons/cigarette.svg?component'
  import { user } from '@state/user.svelte'
  import { sineOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'

  let cigs = new Tween(user.farm_cigs, {
    duration: 400,
    easing: sineOut,
  })

  $effect(() => {
    cigs.target = user.farm_cigs
  })
</script>

<section class="stats fixed left-1/2 z-30 mx-auto flex -translate-x-1/2 items-center justify-center gap-x-3.5">
  <Amount class="stats-amount absolute" />
  <Cigarette class="mb-[3px] basis-8" />
  <h1 class="arbutus text-xl text-textlight">{Math.trunc(cigs.current)}</h1>
</section>
