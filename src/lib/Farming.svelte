<script lang="ts">
  import Cigarette from '@icons/cigarette.svg?component'
  import cigarette from '@icons/cigarette.svg?url'
  import FarmBtn from '@icons/FarmBtn.svelte'
  import {
    addBonus,
    setCigs,
    setCurrentFarmAmount,
    setCurrentFarmTime,
    setEndTime,
    setFarm,
    upLevel,
    user,
  } from '@state/user.svelte'
  import { formatTime } from '@utils'
  import { CLAIMED, FARMED, FARMING, SECOND } from '@utils/const'
  import { onDestroy, onMount } from 'svelte'
  import { linear, sineOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'
  import { Confetti } from 'svelte-confetti'

  import data from '@/messages.json'

  function getProgress(time: number) {
    if (time === 0) return 1
    const now = Date.now()
    if (now > time) {
      if (user.farm === FARMING) setFarm(FARMED)
      return 1
    }
    return Math.max(0, (time - now) / user.currentFarmTime)
  }

  const prevProgress = getProgress(user.endTime)
  let wasFarming = user.endTime !== 0 && prevProgress !== 0

  let showConfetti = $state(false)
  let time = $state('')

  let timeInterval: NodeJS.Timeout
  let isMounted = false

  const progress = tweened(prevProgress, {
    duration: () =>
      user.farm !== FARMING ? 200 : wasFarming ? prevProgress * user.currentFarmTime : user.currentFarmTime,
    easing: (t) => (user.farm === FARMING ? linear(t) : sineOut(t)),
  })

  function startInterval() {
    time = formatTime($progress * user.currentFarmTime)
    timeInterval = setInterval(() => {
      time = formatTime($progress * user.currentFarmTime)
    }, SECOND)
  }

  function stopInterval() {
    clearInterval(timeInterval)
  }

  $effect(() => {
    if ($progress === 0) {
      setFarm(FARMED)
      stopInterval()
      $progress = 1
      wasFarming = false
    }
  })

  onMount(() => {
    if (prevProgress !== 1) {
      $progress = 0
      startInterval()
    }
  })

  onDestroy(() => stopInterval())

  let cigs = $derived.by(() => {
    const val = $progress
    if (wasFarming && val === 1) return user.currentFarmAmount
    return Math.trunc((1 - val) * user.currentFarmAmount)
  })

  $effect(() => {
    const farm = user.farm
    if (!isMounted) {
      isMounted = true
      return
    }
    if (farm === CLAIMED) {
      showConfetti = true
    } else if (farm === FARMED) {
      showConfetti = false
    }
  })

  async function handleClick() {
    if (user.farm === FARMING) return
    if (user.farm === CLAIMED) {
      const now = Date.now()
      setEndTime(now + user.farmTime)
      setCurrentFarmTime()
      setCurrentFarmAmount()
      setFarm(FARMING)
      startInterval()
      $progress = 0
    } else if (user.farm === FARMED) {
      setFarm(CLAIMED)
      setCigs(user.currentFarmAmount)
    }
  }

  let isActive = $state(false)

  const setActive = () => (isActive = true)
  const removeActive = () => (isActive = false)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') setActive()
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') removeActive()
  }
</script>

<section
  class="farming-btn fixed left-1/2 z-30
    mx-auto flex h-14 w-full max-w-xs -translate-x-1/2 {isActive ? 'scale-95' : 'scale-100'} items-center
    justify-center gap-x-4 rounded-xl transition-transform">
  <button class="absolute top-0 -mt-40 ml-5" onclick={() => addBonus(5)}>+time bonus</button>
  <button class="absolute top-10 -mt-40 ml-5" onclick={() => addBonus(1)}>+amount bonus</button>
  <button class="absolute top-20 -mt-40 ml-5" onclick={() => upLevel()}>levelUp</button>
  <FarmBtn {progress} />
  <button
    class="flex size-full items-center justify-center gap-x-2 text-xl outline-none"
    onclick={handleClick}
    onkeydown={handleKeyDown}
    onkeyup={handleKeyUp}
    ontouchstart={setActive}
    ontouchend={removeActive}
    onmousedown={setActive}
    onmouseup={removeActive}
    onmouseleave={removeActive}>
    {#if user.farm === FARMED}
      {data.take} {user.currentFarmAmount} <Cigarette class="mb-1" />
    {:else if user.farm === FARMING}
      {data.farming}
      <span>{cigs}</span>
      <span class="mb-[-3px] text-xs">{time}</span>
    {:else}
      {data.start_farm}
    {/if}
  </button>
  {#if showConfetti}
    <div class="absolute left-1/2 top-0">
      <Confetti y={[0.5, 1.3]} x={[-0.75, 0.75]} amount={25} size={28} colorArray={[`url(${cigarette})`]} />
    </div>
  {/if}
</section>
