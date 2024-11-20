<script lang="ts">
  import { cn } from '@utils'

  import { getEmblaContext } from './context.js'

  let { ref = $bindable(null), class: className }: { ref?: HTMLElement | null | undefined; class?: string } = $props()

  const emblaCtx = getEmblaContext('<Carousel.Previous/>')
</script>

<button
  class={cn(
    'absolute size-8 touch-manipulation rounded-full',
    emblaCtx.orientation === 'horizontal'
      ? '-left-12 top-1/2 -translate-y-1/2'
      : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    className,
  )}
  disabled={!emblaCtx.canScrollPrev}
  onclick={emblaCtx.scrollPrev}
  onkeydown={emblaCtx.handleKeyDown}
  bind:this={ref}>
  {'<'}
  <span class="sr-only">Previous slide</span>
</button>
