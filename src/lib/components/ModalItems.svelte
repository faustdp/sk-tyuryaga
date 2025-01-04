<script lang="ts">
  import * as Carousel from '@components/carousel/'
  import { type CarouselAPI } from '@components/carousel/context'
  import Cross from '@icons/Cross.svelte'
  import Lock from '@icons/lock.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app, closeModal } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
  import { postSelectImage } from '@utils/api'
  import { onDestroy } from 'svelte'
  import { sineInOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'

  import data from '@/messages.json'
  import * as Dialog from '$lib/components/dialog/'

  let { selectedIdx, selectImage } = $props()

  let carouselApi = $state<CarouselAPI>()
  let current = $state(0)
  let prev = $state(-1)
  let isLocked = $derived(current > user.level - 1 + (user.bonuses.includes(selectedIdx) ? 1 : 0))
  let items = $derived.by(() => {
    if (selectedIdx === null) return prevItems?.length > 0 ? prevItems : []
    return Array.from({ length: 10 }, (_, i) => `/imgs/${selectedIdx}/${i + 1}.webp`)
  })

  async function handleSelect() {
    if (isLocked || current === user.selected_images[selectedIdx]) return
    user.selected_images[selectedIdx] = current
    await postSelectImage(selectedIdx, current)
    closeModal()
    selectImage(null)
  }

  const selectItem = (index: number, jump?: boolean) => carouselApi?.scrollTo(index, jump)

  let prevItems: string[]

  $effect(() => {
    prevItems = items
  })

  $effect(() => {
    if (carouselApi) {
      current = carouselApi.selectedScrollSnap()
      carouselApi.on('select', () => {
        prev = current
        current = carouselApi!.selectedScrollSnap()
      })
    }
  })

  $effect(() => {
    if (!app.isModalOpened) {
      prev = -1
    }
  })

  $effect(() => {
    const idx = selectedIdx
    if (idx !== null && user.selected_images[idx] > 0) {
      selectItem(user.selected_images[idx], true)
    }
  })

  onDestroy(() => {
    closeModal()
  })
</script>

<Dialog.Content
  withMargin
  class="card-shadow flex w-[calc(100%_-_20px)] max-w-[344px] flex-col items-center overflow-hidden bg-ccard">
  <Carousel.Root class="relative w-full max-w-[344px]" setApi={(emblaApi) => (carouselApi = emblaApi)}>
    <div class="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-textlight blur-2xl">
    </div>
    <Carousel.Content>
      {#each items as item, i (i)}
        <Carousel.Item class="relative">
          <figure class="relative mb-2 flex flex-col items-center p-4 text-center">
            <img class="relative z-10" src={item} width="180" alt="Alt text" />
            <figcaption class="mt-10">{data.level} {i + 1}</figcaption>
          </figure>
          {#if current === user.selected_images[selectedIdx] && current === i}
            <div
              in:fade={{ duration: 220, easing: sineInOut }}
              out:fade={{ delay: 160, duration: 60, easing: sineInOut }}
              class="absolute right-0 top-0">
              <Cross isChoice />
            </div>
          {/if}
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    {#if isLocked}
      <div
        transition:fade={{ duration: prev >= 0 ? 240 : 0, easing: sineInOut }}
        class="pointer-events-none fixed left-0 top-0 z-30 size-full select-none rounded-xl bg-black opacity-30">
      </div>
      <div
        in:fade={{ duration: prev >= 0 ? 240 : 0, easing: sineInOut }}
        out:fly={{ duration: prev >= 0 ? 240 : 0, x: '150', easing: sineInOut }}
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
    onclick={handleSelect}>
    <WalletBtn
      classes="w-full"
      height={54}
      fill={isLocked || current === user.selected_images[selectedIdx]
        ? 'rgb(var(--c-lightblue))'
        : 'rgb(var(--c-yellow))'}
      stroke={isLocked || current === user.selected_images[selectedIdx] ? undefined : 'var(--dark-yellow)'} />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-sm">
      {data.select}!
    </span>
  </button>
</Dialog.Content>
