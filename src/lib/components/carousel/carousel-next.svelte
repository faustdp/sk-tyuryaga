<script lang="ts">
  import { cn } from '@utils'

  import { getEmblaContext } from './context.js'

  let { ref = $bindable(null), class: className }: { ref?: HTMLElement | null | undefined; class?: string } = $props()

  const emblaCtx = getEmblaContext('<Carousel.Next/>')
</script>

<button
  class={cn(
    'absolute size-8 touch-manipulation rounded-full',
    emblaCtx.orientation === 'horizontal'
      ? '-right-12 top-1/2 -translate-y-1/2'
      : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    className,
  )}
  disabled={!emblaCtx.canScrollNext}
  onclick={emblaCtx.scrollNext}
  onkeydown={emblaCtx.handleKeyDown}
  bind:this={ref}>
  {'>'}
  <span class="sr-only">Next slide</span>
</button>
