<script lang="ts">
  import Cigarette from '@icons/cigarette.svg?component'
  import cigarette from '@icons/cigarette.svg?url'
  import FarmBtn from '@icons/FarmBtn.svelte'
  import { app, setEndTime, setFarm } from '@state/app.svelte'
  import { formatTime } from '@utils'
  import { CLAIMED, FARM_TIME, FARMED, FARMING } from '@utils/const'
  import { onDestroy, onMount } from 'svelte'
  import { linear, sineOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'
  import { Confetti } from 'svelte-confetti'

  function getProgress(time: number) {
    const now = Date.now()
    if (now > time) {
      if (app.farm === FARMING) setFarm(FARMED)
      return 1
    }
    return Math.max(0, (time - now) / FARM_TIME)
  }

  const CIGS_NUM = 100

  const prevProgress = app.endTime === 0 ? 1 : getProgress(app.endTime)
  let wasFarming = app.endTime !== 0 && prevProgress !== 0

  let isActive = $state(false)
  let showConfetti = $state(false)
  let time = $state('')

  let timeInterval: NodeJS.Timeout
  let isMounted = false

  const progress = tweened(prevProgress, {
    duration: () => (app.farm !== FARMING ? 200 : wasFarming ? prevProgress * FARM_TIME : FARM_TIME),
    easing: (t) => (app.farm === FARMING ? linear(t) : sineOut(t)),
  })

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
    if (wasFarming && val === 1) return CIGS_NUM
    return Math.round((1 - val) * CIGS_NUM)
  })

  $effect(() => {
    const farm = app.farm
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

  function setActive() {
    isActive = true
  }

  function removeActive() {
    isActive = false
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') setActive()
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') removeActive()
  }

  async function handleClick() {
    if (app.farm === FARMING) return
    if (app.farm === CLAIMED) {
      setFarm(FARMING)
      setEndTime(Date.now() + FARM_TIME)
      startInterval()
      $progress = 0
    } else if (app.farm === FARMED) {
      setFarm(CLAIMED)
    }
  }

  function startInterval() {
    time = formatTime($progress * FARM_TIME)
    timeInterval = setInterval(() => {
      time = formatTime($progress * FARM_TIME)
    }, 1000)
  }

  function stopInterval() {
    clearInterval(timeInterval)
  }
</script>

<section
  class="fixed bottom-[calc(50%_-_((min(var(--height-limit),_var(--screen))_/_2)_-_160px))] left-1/2 z-30
    mx-auto flex h-14 w-full max-w-xs -translate-x-1/2 {isActive ? 'scale-95' : 'scale-100'} items-center
    justify-center gap-x-4 rounded-xl transition-transform">
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
    {#if app.farm === FARMED}
      Сюда 100 <Cigarette class="mb-1" />
    {:else if app.farm === FARMING}
      Фарминг <span>{cigs}</span>
      <span class="mb-[-3px] text-xs">{time}</span>
    {:else}
      Начать фармить
    {/if}
  </button>
  {#if showConfetti}
    <div class="absolute left-1/2 top-0">
      <Confetti y={[0.5, 1.3]} x={[-0.75, 0.75]} amount={25} size={28} colorArray={[`url(${cigarette})`]} />
    </div>
  {/if}
</section>
