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
  <Amount class="absolute -top-[7px]" />
  <Cigarette class="mb-[3px]" />
  <h1 class="arbutus text-xl text-textlight">{Math.trunc($cigs)}</h1>
</section>

<style>
  .stats {
    top: calc(50% - (var(--height-limit) / 2.9));
    border-radius: 12px;
    width: 256px;
    height: 50px;
    background: linear-gradient(
      87.46deg,
      rgba(138, 120, 88, 0.7) 3.68%,
      rgba(184, 180, 174, 0.7) 53.35%,
      rgba(138, 120, 88, 0.7) 98.92%
    );
    backdrop-filter: blur(4px);
  }

  @media screen and (max-height: 800px) {
    .stats {
      top: calc(50% - (var(--screen) / 2.6));
    }
  }
</style>
