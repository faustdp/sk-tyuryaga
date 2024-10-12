<script lang="ts">
  import Amount from '@icons/Amount.svelte'
</script>

<header
  class="stats fixed z-30 flex
   w-full justify-center">
  <section class="flex w-limit border-2 border-solid border-red-600">
    <Amount />
    <h1>123,456,789</h1>
  </section>
</header>

<style>
  .stats {
    top: calc(50% - (var(--height-limit) / 2.9));
  }

  @media screen and (max-height: 800px) {
    .stats {
      top: calc(50% - (var(--screen) / 2.6));
    }
  }
</style>
