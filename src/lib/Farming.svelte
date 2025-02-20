<script lang="ts">
  import Cigarette from '@icons/cigarette.svg?component'
  import cigarette from '@icons/cigarette.svg?url'
  import FarmBtn from '@icons/FarmBtn.svelte'
  import { app } from '@state/app.svelte'
  import { setCigs, setEndTime, setFarm, user } from '@state/user.svelte'
  import { formatTime } from '@utils'
  import { postEndTime, postFarmCigs } from '@utils/api'
  import { CLAIMED, FARMED, FARMING, MINUTE, SECOND } from '@utils/const'
  import { onDestroy, onMount } from 'svelte'
  import { linear, sineOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'
  import Confetti from 'svelte-confetti'

  import data from '@/messages.json'

  function getProgress(time: number) {
    if (time === 0) return 1
    const now = app.now
    if (now > time) {
      if (user.farm === FARMING) {
        setFarm(FARMED)
      }
      return 1
    }
    return Math.max(0, (time - now) / user.current_farm_time)
  }

  let showConfetti = $state(false)
  let time = $state('')

  let timeInterval: NodeJS.Timeout

  let prevProgress = getProgress(user.end_time)
  let wasFarming = user.end_time !== 0 && prevProgress !== 0
  const progress = new Tween(prevProgress, {
    duration: () =>
      user.farm !== FARMING ? 200 : wasFarming ? prevProgress * user.current_farm_time : user.current_farm_time,
    easing: (t) => (user.farm === FARMING ? linear(t) : sineOut(t)),
  })

  function startInterval() {
    if (!progress) return
    progress.target = 0
    time = formatTime(progress.current * user.current_farm_time)
    timeInterval = setInterval(() => {
      time = formatTime(progress.current * user.current_farm_time)
    }, SECOND)
  }

  function stopInterval() {
    clearInterval(timeInterval)
  }

  $effect(() => {
    if (progress.current === 0) {
      setFarm(FARMED)
      stopInterval()
      progress.target = 1
      wasFarming = false
    }
  })

  onMount(() => {
    if (prevProgress !== 1 || user.farm === FARMING) {
      startInterval()
    }
  })

  onDestroy(() => stopInterval())

  let cigs = $derived.by(() => {
    const val = progress.current
    if (wasFarming && val === 1) return user.current_farm_amount
    return Math.trunc((1 - val) * user.current_farm_amount)
  })

  async function handleClick() {
    if (user.farm === FARMING) return
    if (user.farm === CLAIMED) {
      showConfetti = false
      const now = app.now
      const time = now + user.farm_time * MINUTE
      user.current_farm_amount = user.farm_time * user.farm_amount
      user.current_farm_time = user.farm_time * MINUTE
      prevProgress = getProgress(time)
      const result = await postEndTime(
        new Date(time).toISOString(),
        Math.round(user.farm_time * user.farm_amount),
        Math.round(user.farm_time * MINUTE),
      )
      if (typeof result?.data === 'object' && result?.data?.end_time) {
        const dbTime = new Date(result.data.end_time).getTime()
        setEndTime(dbTime, Number(result.data.farmed_time), Number(result.data.farmed_amount))
        if (dbTime !== time) {
          wasFarming = true
          prevProgress = getProgress(dbTime)
          progress.set(prevProgress, { duration: 0 })
        }
        const isFarming = dbTime > now
        if (isFarming) {
          setFarm(FARMING)
          startInterval()
        } else {
          setFarm(FARMED)
        }
      } else if (result?.data === 'OK') {
        setEndTime(time)
        setFarm(FARMING)
        startInterval()
      }
    } else if (user.farm === FARMED) {
      const result = await postFarmCigs(user.current_farm_amount)
      showConfetti = true
      setFarm(CLAIMED)
      if (result?.data?.farm_cigs) {
        const cigs = Number(result.data.farm_cigs)
        setCigs(cigs - user.farm_cigs)
      } else {
        setCigs(user.current_farm_amount)
      }
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
  <FarmBtn progress={progress.current} />
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
      {data.take} {user.current_farm_amount} <Cigarette class="mb-1" />
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
