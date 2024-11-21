<script lang="ts">
  import * as Carousel from '@components/carousel/'
  import { type CarouselAPI } from '@components/carousel/context'
  import Cross from '@icons/Cross.svelte'
  import Lock from '@icons/lock.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { closeModal } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
  import { onDestroy } from 'svelte'
  import { sineInOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'

  import data from '@/messages.json'
  import * as Dialog from '$lib/components/dialog/'

  let carouselApi = $state<CarouselAPI>()
  let current = $state(0)
  let isLocked = $derived(current > user.level + 1)
  const items = Array.from({ length: 5 }, () => ({ src: 'src/lib/images/dudka.webp', level: 1 }))

  function handleCodeCheck() {
    closeModal()
  }

  const selectItem = (index: number) => carouselApi?.scrollTo(index)

  $effect(() => {
    if (carouselApi) {
      current = carouselApi.selectedScrollSnap()
      carouselApi.on('select', () => {
        current = carouselApi!.selectedScrollSnap()
      })
    }
  })

  onDestroy(() => {
    closeModal()
  })
</script>

<Dialog.Content
  withMargin
  class="card-shadow flex w-[calc(100%_-_20px)] flex-col items-center overflow-hidden bg-ccard sm:max-w-[425px]">
  <Carousel.Root class="relative w-full max-w-[344px]" setApi={(emblaApi) => (carouselApi = emblaApi)}>
    <div class="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2f2f2] blur-2xl">
    </div>
    <Carousel.Content>
      <div class="absolute right-0 top-0"><Cross isChoice /></div>
      {#each items as item, i (i)}
        <Carousel.Item class="relative  ">
          <figure class="relative mb-2 flex flex-col items-center p-4 text-center">
            <img class="relative z-10 mb-9" src={item.src} width="180" alt="Alt text" />
            {#if isLocked}{/if}
            <figcaption>{data.level} {item.level + i}</figcaption>
          </figure>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    {#if isLocked}
      <div
        transition:fade={{ duration: 240, easing: sineInOut }}
        class="pointer-events-none fixed left-0 top-0 z-30 size-full select-none bg-black opacity-30">
      </div>
      <div
        in:fade={{ duration: 240, easing: sineInOut }}
        out:fly={{ duration: 240, x: '150', easing: sineInOut }}
        class="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 select-none">
        <Lock />
      </div>
    {/if}
  </Carousel.Root>
  <div class="absolute -bottom-10 flex gap-x-2 p-1">
    {#each items as _, i}
      {@const bg = i === current ? 'bg-cyellow' : 'bg-textgrey'}
      <button aria-label="Carousel dot" onclick={() => selectItem(i)} class="size-2 rounded-full outline-none {bg}">
      </button>
    {/each}
  </div>
  <button
    class="absolute -bottom-32 self-center outline-none transition-transform will-change-transform active:scale-95"
    onclick={handleCodeCheck}>
    <WalletBtn
      classes="w-full"
      height={54}
      fill={user.level + 1 === current ? 'rgb(var(--c-yellow))' : 'rgb(var(--c-lightblue))'}
      stroke={user.level + 1 === current ? 'var(--dark-yellow)' : undefined} />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-sm">
      {data.select}!
    </span>
  </button>
</Dialog.Content>
