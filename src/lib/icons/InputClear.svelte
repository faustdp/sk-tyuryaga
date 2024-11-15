<script lang="ts">
  import { fade } from 'svelte/transition'

  let { class: className = '', show = false, ...restProps } = $props()
</script>

{#if show}
  <svg
    class={className}
    {...restProps}
    transition:fade
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666M12.5 7.5l-5 5m0-5 5 5"
      stroke="rgb(var(--input-red))"
      stroke-linecap="round"
      stroke-linejoin="round" />
  </svg>
{/if}
