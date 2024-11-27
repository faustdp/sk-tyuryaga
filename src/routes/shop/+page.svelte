<script lang="ts">
  import ArrowRight from '@icons/arrowRight.svg?component'
  import CheckDone from '@icons/checkDone.svg?component'
  import Cigarette from '@icons/cigarette.svg?component'
  import Pack from '@icons/Pack.svelte'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app, setActiveTab } from '@state/app.svelte'
  import { AMOUNT, COMBO, cubicOut, TIME } from '@utils/const'
  import useRipple from '@utils/useRipple.svelte'
  import { sineOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  import BoostTag from '@/components/BoostTag.svelte'
  import LevelCard from '@/components/LevelCard.svelte'
  import ShopCard from '@/components/ShopCard.svelte'
  import Drawer from '@/Drawer.svelte'
  import data from '@/messages.json'

  let tabCont: HTMLDivElement
  let activeTab: HTMLSpanElement
  let isMounted = false

  let isDrawerOpened = $state(false)
  let selectedItem = $state(100)
  let isTaskAllowed = $state(false)

  function closeDrawer() {
    isDrawerOpened = false
  }

  function openDrawer() {
    isDrawerOpened = true
  }

  const tabs: Map<ShopTabs, string> = new Map([
    [0, data[TIME]],
    [1, data[AMOUNT]],
    [2, data[COMBO]],
  ])

  function handleTab(tab: ShopTabs) {
    if (app.activeShopTab === tab) return
    setActiveTab(tab)
  }

  $effect(() => {
    const index = app.activeShopTab
    const tab = tabCont.children[index + 1] as HTMLButtonElement
    const left = tab.getBoundingClientRect().left - tabCont.getBoundingClientRect().left
    activeTab.animate(
      {
        transform: `translateX(${left}px)`,
      },
      { duration: isMounted ? 270 : 0, easing: cubicOut, fill: 'both' },
    )
    if (!isMounted) {
      isMounted = true
    }
  })

  function handleOutroStart(event: any) {
    if (!event.target) return
    event.target.style.position = 'absolute'
  }
</script>

<svelte:head>
  <title>{data.shop_title}</title>
  <meta name="description" content={data.shop_content} />
</svelte:head>

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pb-2 pt-4">
  <div class="page-circle relative mb-5">
    <Pack class="size-11" />
  </div>
  <h1 class="shadow-heading mb-5 text-xl">{data.shop_title}</h1>
  <p class="roboto mb-4 max-w-sm text-center text-xs tracking-wide text-textgrey">
    {data.shop_desc}
  </p>
  <div bind:this={tabCont} class="relative z-0 mb-4 flex w-full justify-center rounded-md bg-ctabs">
    <span
      bind:this={activeTab}
      class="pointer-events-none absolute left-0 -z-one h-full w-1/3 rounded-md bg-cgreen will-change-transform">
    </span>
    {#each tabs as [key, value]}
      <button
        use:useRipple={{ color: 'currentColor' }}
        class="relative flex-1 overflow-hidden rounded-md py-3 tracking-wide"
        onclick={() => handleTab(key)}>
        <span class="pointer-events-none">{value}</span>
      </button>
    {/each}
  </div>
  <div class="relative w-full">
    {#key app.activeShopTab}
      <div
        out:fly={{ duration: 220, x: 200, easing: sineOut }}
        in:fly={{ duration: 220, x: -200, easing: sineOut }}
        onoutrostart={handleOutroStart}
        class="flex w-full flex-col">
        <ShopCard onclick={openDrawer} />
        <ShopCard onclick={openDrawer} />
      </div>
    {/key}
  </div>
  <Drawer isOpened={isDrawerOpened} handleClose={closeDrawer}>
    <div class="mb-2 mt-3 flex items-center gap-x-2">
      <LevelCard />
      <ArrowRight class="mt-[22px]" />
      <LevelCard level={2} />
    </div>
    <h2 class="shadow-heading mb-2 text-base">{data.cig_1}</h2>
    <p class="roboto mb-4 max-w-sm text-xs leading-5 tracking-wide text-textgrey">
      Описание предмета описание предмета nbnjkkkgедмета описание предмета описание премета описание предмета qwertyui
    </p>
    <div class="mb-4 flex gap-x-6"><BoostTag boost={TIME} /> <BoostTag boost={COMBO} /></div>
    <h3 class="shadow-heading mb-2 text-base text-cyellow">{data.shop_requirements}</h3>
    <p class="roboto mb-4 max-w-sm text-xs leading-5 tracking-wide text-textgrey">
      Чтобы прокачать элемент для следующего уровня необходимо выполнить следующие условия:
    </p>
    <ul class="mb-3 flex flex-col gap-y-3">
      <li class="flex w-full items-center gap-x-2.5">
        {#if true}
          <CheckDone />
        {:else}
          <div class=" ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
        {/if}
        <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
          Прокачать все эелементы до 1 уровня
        </span>
      </li>
      <li class="flex w-full items-center gap-x-2.5">
        {#if false}
          <CheckDone />
        {:else}
          <div class=" ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
        {/if}
        <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
          Прокачать все эелементы до 1 уровня Прокачать все эелементы до 1 уровня
        </span>
      </li>
    </ul>

    <button class="outline-none transition-transform will-change-transform active:scale-95">
      <WalletBtn
        fill={isTaskAllowed ? 'rgb(var(--c-yellow))' : 'rgb(var(--c-lightblue))'}
        stroke={isTaskAllowed ? 'var(--dark-yellow)' : undefined} />
      <span class="absolute left-0 top-0 flex size-full items-center justify-center text-xl">
        {data.shop_upgrade}
        <Cigarette class="mr-1" width="38" height="23" />
        {selectedItem}
      </span>
    </button>
  </Drawer>
</div>
