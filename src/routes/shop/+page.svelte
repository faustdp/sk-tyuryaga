<script lang="ts">
  import ArrowRight from '@icons/arrowRight.svg?component'
  import CheckDone from '@icons/checkDone.svg?component'
  import Cigarette from '@icons/cigarette.svg?component'
  import Pack from '@icons/Pack.svelte'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app, setActiveTab } from '@state/app.svelte'
  import { addBonus, user } from '@state/user.svelte'
  import { getImgUrl, isEnglish, preloadImg } from '@utils'
  import { AMOUNT, BONUSES, COMBO, cubicOut, IMG_INDEXES, IMG_NAMES, LEVELS, TIME } from '@utils/const'
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
  let selectedItem = $state<Images | null>(null)

  function closeDrawer() {
    isDrawerOpened = false
    selectedItem = null
  }

  function openDrawer(img: Images) {
    isDrawerOpened = true
    selectedItem = img
  }

  const tabs: [BoostValue, string][] = [
    [TIME, data[TIME]],
    [AMOUNT, data[AMOUNT]],
    [COMBO, data[COMBO]],
  ]

  function handleTab(tab: BoostValue) {
    if (app.activeShopTab === tab) return
    setActiveTab(tab)
  }

  $effect(() => {
    if (!selectedItem || user.level >= LEVELS.length - 1) return
    preloadImg(getImgUrl(selectedItem.idx, user.level + 1))
  })

  $effect(() => {
    const currTab = app.activeShopTab
    const index = tabs.findIndex((el) => el[0] === currTab)
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

  let tabItems = $derived.by(() => {
    if (!app.activeShopTab) return []
    return IMG_NAMES.filter((el, i) => IMG_INDEXES[app.activeShopTab].includes(i as BonusIndexes))
  })

  function handleOutroStart(event: any) {
    if (!event.target) return
    event.target.style.position = 'absolute'
  }

  async function buyBoost(price: number, isAllowed: boolean) {
    if (user.farm_cigs < price || !selectedItem || !isAllowed) return
    await addBonus(selectedItem.idx, -price)
  }
</script>

<svelte:head>
  <title>{data.shop_title}</title>
  <meta name="description" content={data.shop_content} />
</svelte:head>

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pt-8">
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
        {#each tabItems as item}
          {@const level =
            user.bonuses.includes(item.idx) && user.level < LEVELS.length - 1 ? user.level + 1 : user.level}
          <ShopCard
            onclick={() => openDrawer(item)}
            {level}
            title={item.name[level]}
            index={item.idx}
            boostType={item.type} />
        {/each}
      </div>
    {/key}
  </div>
  <Drawer isOpened={isDrawerOpened} handleClose={closeDrawer}>
    {#if selectedItem}
      {@const hasBonus = user.bonuses.includes(selectedItem.idx)}
      {@const hasPrevItem =
        (user.level === 0 && hasBonus) ||
        (user.level > 0 && user.level < LEVELS.length - 1) ||
        (!hasBonus && user.level === LEVELS.length - 1)}
      {@const currLevel = hasBonus && user.level < LEVELS.length - 1 ? user.level + 1 : user.level}
      {@const prevLevel = hasBonus ? user.level : user.level - 1}
      {@const isEnoughCigs = user.farm_cigs >= LEVELS[currLevel][selectedItem.type]}
      {@const isTasksCompleted = LEVELS[currLevel].tasks ? LEVELS[currLevel].tasks <= user.tasks_completed : true}
      {@const isInvitesCompleted = LEVELS[currLevel].invites ? LEVELS[currLevel].invites <= user.invites : true}
      {@const isStreakCompleted = LEVELS[currLevel].streak ? LEVELS[currLevel].streak <= user.activity_days : true}
      {@const isTaskAllowed = isEnoughCigs && !hasBonus && isTasksCompleted && isInvitesCompleted && isStreakCompleted}
      {@const isLastItem = hasBonus && user.level === LEVELS.length - 1}
      <div class="mb-2 mt-3 flex items-center gap-x-2">
        {#if hasPrevItem && prevLevel !== currLevel}
          <LevelCard level={prevLevel} index={selectedItem.idx} />
          <ArrowRight class="mt-[22px]" />
        {/if}
        <LevelCard level={currLevel} index={selectedItem.idx} />
      </div>
      <h2 class="shadow-heading mb-2 text-base">{selectedItem.name[currLevel]}</h2>
      <p class="roboto mb-4 max-w-sm text-xs leading-5 tracking-wide text-textgrey">
        {selectedItem.desc}
      </p>
      <div class="mb-4 flex gap-x-6">
        <BoostTag
          boost={selectedItem.type}
          amount={selectedItem.type === COMBO
            ? BONUSES[COMBO][AMOUNT]
            : selectedItem.type === AMOUNT
              ? BONUSES[AMOUNT]
              : BONUSES[TIME][currLevel]} />
        {#if selectedItem.type === COMBO}
          <BoostTag boost={TIME} amount={BONUSES[COMBO][TIME][currLevel]} />
        {/if}
      </div>
      {#if !isLastItem}
        <h3 class="shadow-heading mb-2 text-base text-cyellow">{data.shop_requirements}</h3>
        <p class="roboto mb-4 max-w-sm text-xs leading-5 tracking-wide text-textgrey">
          {data.shop_requirements_desc}
        </p>
        <ul class="mb-3 flex flex-col gap-y-3">
          {#if currLevel > 0}
            <li class="flex w-full items-center gap-x-2.5">
              {#if !hasBonus}
                <CheckDone />
              {:else}
                <div class="ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
              {/if}
              <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
                {data.requirement_level}
                {currLevel}
                {data.requirement_level_name}
              </span>
            </li>
          {/if}
          {#if LEVELS[currLevel].tasks}
            <li class="flex w-full items-center gap-x-2.5">
              {#if isTasksCompleted}
                <CheckDone />
              {:else}
                <div class="ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
              {/if}
              <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
                {data.requirement_tasks}
                {LEVELS[currLevel].tasks}
                {data.tasks_title.toLowerCase()}
              </span>
            </li>
          {/if}
          {#if LEVELS[currLevel].invites}
            <li class="flex w-full items-center gap-x-2.5">
              {#if isInvitesCompleted}
                <CheckDone />
              {:else}
                <div class="ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
              {/if}
              <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
                {data.requirement_invites}
                {LEVELS[currLevel].invites}
                {isEnglish(data.task_friends)
                  ? LEVELS[currLevel].invites > 1
                    ? data.task_friends
                    : data.task_friends.slice(0, -1)
                  : LEVELS[currLevel].invites > 4
                    ? data.task_friends
                    : data.task_friends.replace('ов', 'а')}
              </span>
            </li>
          {/if}
          {#if LEVELS[currLevel].streak}
            <li class="flex w-full items-center gap-x-2.5">
              {#if isStreakCompleted}
                <CheckDone />
              {:else}
                <div class="ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
              {/if}
              <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
                {data.requirement_streak}
                {LEVELS[currLevel].streak}
                {data.requirement_streak_date}
              </span>
            </li>
          {/if}
          <li class="flex w-full items-center gap-x-2.5">
            {#if isEnoughCigs}
              <CheckDone />
            {:else}
              <div class="ml-0.5 size-[20px] rounded border-2 border-solid border-textgrey"></div>
            {/if}
            <span class="roboto flex h-full flex-1 items-center text-xs tracking-wider">
              {data.requirement_cigs}
              <Cigarette class="mr-1" width="38" height="23" />
              ({LEVELS[currLevel][selectedItem.type].toLocaleString()})
            </span>
          </li>
        </ul>
        <button
          onclick={() => buyBoost(LEVELS[currLevel][selectedItem!.type], isTaskAllowed)}
          class="outline-none transition-transform will-change-transform active:scale-95">
          <WalletBtn
            fill={isTaskAllowed ? 'rgb(var(--c-yellow))' : 'rgb(var(--c-lightblue))'}
            stroke={isTaskAllowed ? 'var(--dark-yellow)' : undefined} />
          <span class="absolute left-0 top-0 flex size-full items-center justify-center text-xl">
            {#if !isEnoughCigs}
              {data.not_enough}
            {:else}
              {data.shop_upgrade}
              <Cigarette class="mr-1" width="38" height="23" />
              {LEVELS[currLevel][selectedItem.type].toLocaleString()}
            {/if}
          </span>
        </button>
      {/if}
    {/if}
  </Drawer>
</div>
