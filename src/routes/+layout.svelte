<script lang="ts">
  import '../app.css'
  import '@fontsource/russo-one/400.css'
  import '@fontsource/arbutus/400.css'
  import '@fontsource/roboto/400.css'

  import ProgressBar from '@components/ProgressBar.svelte'
  import CheckSuccess from '@icons/checkSuccess.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app, setError, setIsLoaded } from '@state/app.svelte'
  import { tasks } from '@state/tasks.svelte'
  import {
    setBaseFarm,
    setCigs,
    setClaimFriends,
    setEndTime,
    setFarm,
    setRefCigs,
    setSelectedImages,
    setUser,
    user,
  } from '@state/user.svelte'
  import {
    closeMiniApp,
    ERR_RETRIEVE_LP_FAILED,
    init,
    isTMA,
    miniAppReady,
    mountMiniApp,
    retrieveLaunchParams,
  } from '@telegram-apps/sdk'
  import { noop, sortTasks, w8 } from '@utils'
  import { sseUrl } from '@utils/api'
  import { CLIENT_ID, FARMED, FARMING, meUrl, MINUTE, taskStatus } from '@utils/const'
  import { fixTouch } from '@utils/fixTouch'
  import { useTonConnect } from '@utils/useTonConnect'
  import { onMount } from 'svelte'
  import { sineInOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'
  import { fade } from 'svelte/transition'
  import toast, { Toaster } from 'svelte-hot-french-toast'

  import BottomNav from '@/BottomNav.svelte'
  import data from '@/messages.json'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/state'
  import { PUBLIC_SITE_URL } from '$env/static/public'
  import * as Dialog from '$lib/components/dialog/'

  // console.clear()

  let progressDefDur = 1400
  const progressShortDur = 130
  let progress = new Tween(0, {
    duration: progressShortDur,
    easing: sineInOut,
  })

  let interval: number | null = null
  let eventSource: EventSource | null = null

  function stopProgress() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function startProgress() {
    if (interval) return
    const treshholds = [20, 50, 70, 86, 95, 98.5, 99.99]
    const values = [4, 2, 1.1, 0.5, 0.15, 0.025, 0.006]
    interval = window.setInterval(() => {
      const ind = treshholds.findIndex((numb) => progress.current < numb)
      const nextProgress = ind >= 0 ? progress.current + values[ind] : progress.current < 100 ? progress.current : 100
      progress.set(nextProgress, { duration: nextProgress === 100 ? progressDefDur : progressShortDur })
      if (progress.current === 100) stopProgress()
    }, 80)
  }

  function connectSSE() {
    eventSource = new EventSource(`${PUBLIC_SITE_URL}${sseUrl}${user.id}?clientId=${CLIENT_ID}`)

    eventSource.onmessage = (event) => {
      const msg = JSON.parse(event.data) as EventMessage | ConnectionInfo
      if (msg.type === 'invite') {
        toast.success(`${data.new_invite} ${msg.data.name} ${msg.data.username || ''}!`, {
          class: 'toast-success',
          icon: CheckSuccess,
          duration: 3000,
        })
      }
    }
  }

  async function initTgApp() {
    const isTG = await isTMA()
    const initData =
      'query_id=AAGQoqw0AAAAAJCirDTR49X6&user=%7B%22id%22%3A883729040%2C%22first_name%22%3A%22Denis%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22paskodenis%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FPZp_j8q1EwiqyrZYJ_D1D9aqUwujRQ5FHKWz4i20l6M.svg%22%7D&auth_date=1733681189&signature=VJ959-6RmChdCsoTU7qwutF-rIEvClKvwV4amcdYeTbgSseO_CAsLbKmZVKrOArFwhYP0aUlfZoU6Rl_V_kWAA&hash=c57aaccbc063e5f40364e362ba27129ab0043015b9f0b7431a66a6abb3cd8559'
    if (!isTG) {
      // return setError(data.errors.telegram_error)
      //TODO: QRCODE
      /*       const user = parseInitData(initData).user
      if (!user) return
      const { id: tg_id, username, firstName: first_name } = user
      setUser({
        id: 14,
        tg_id,
        first_name,
        username,
        invites: 0,
      }) */
    }

    let params
    try {
      params = retrieveLaunchParams()
    } catch {}

    try {
      const reqStart = performance.now()
      const response = await fetch(meUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: params?.initDataRaw ? params.initDataRaw : initData }),
      })

      if (response.ok === false) {
        throw new Error(response.statusText)
      }

      stopProgress()
      const reqDiff = performance.now() - reqStart
      progressDefDur = reqDiff < progressDefDur - 50 ? progressDefDur - reqDiff : 50
      progress.set(100, { duration: progressDefDur })

      const result: ValidationResponse = await response.json()

      if (!result.valid) {
        const error = result.error
        if (error === undefined) throw new Error(data.errors.data_error)
        const errorMsg = error in data.errors ? (data.errors[error as keyof typeof data.errors] as string) : error
        throw new Error(errorMsg)
      }

      const {
        id,
        tg_id,
        first_name,
        username,
        invites,
        level,
        language,
        bonuses,
        ref_cigs,
        farm_cigs,
        end_time,
        claim_friends,
        activity_days,
        selected_images,
        farmed_amount,
        farmed_time,
        tasks: fetchedTasks,
      } = result.userData

      let tasks_completed = 0
      ;(fetchedTasks as (SocialItem & { iconType: string; iconName: string | null; iconUrl: string | null })[]).forEach(
        (el) => {
          if (el.status === taskStatus.done) {
            tasks_completed += 1
          }
          el.reward = Number(el.reward)
          el.Icon = el.iconType === 'custom' && el.iconUrl ? el.iconUrl : el.iconName ? el.iconName : 'tg'
          if (el.delay) {
            el.delay = Number(el.delay)
          }
          if (el.invites) {
            el.invites = Number(el.invites)
          }
        },
      )

      setSelectedImages(selected_images)
      setClaimFriends(new Date(claim_friends).getTime())
      setCigs(Number(farm_cigs))
      setRefCigs(Number(ref_cigs))
      setUser({
        id,
        first_name,
        username,
        bonuses,
        language,
        tasks_completed,
        tg_id: Number(tg_id),
        invites: Number(invites),
        level: Number(level),
        activity_days: Number(activity_days),
      })

      setBaseFarm(Number(level), bonuses)

      if (end_time) {
        const value = new Date(end_time).getTime()
        const now = Date.now()
        setEndTime(value, Number(farmed_time), Number(farmed_amount))
        setFarm(value > now ? FARMING : FARMED)
      }

      tasks.data = sortTasks(fetchedTasks as SocialItem[])

      connectSSE()

      invalidate('app:friends')
    } catch (err) {
      if (err instanceof Error) {
        const error = err as TypedError
        if (error.type === ERR_RETRIEVE_LP_FAILED || err.message === data.errors.outdated_error) {
          closeMiniApp()
        }
        setError(err.message)
      } else if (typeof err === 'string') {
        setError(err)
      } else {
        setError(data.errors.error_msg)
      }
    } finally {
      await w8(progressDefDur + 25)
      setIsLoaded()
    }
  }

  initTgApp()
  useTonConnect()

  onMount(() => {
    let removeListeners: null | typeof noop = null
    startProgress()
    try {
      init()
      mountMiniApp()
      miniAppReady()
      fixTouch().then((listener: typeof noop) => {
        removeListeners = listener
      })
    } catch (_err) {}

    const friendsInterval = setInterval(() => {
      invalidate('app:friends')
    }, MINUTE * 20)

    return () => {
      if (removeListeners) removeListeners()
      if (eventSource) eventSource.close()
      stopProgress()
      clearInterval(friendsInterval)
    }
  })

  let { children } = $props()

  $effect(() => {
    const isDark = !!app.error || !!app.isLoading
    const body = document.body
    if (!body) return
    body.classList.add(isDark ? 'bg-cdarkblue' : 'bg-main')
    body.classList.remove(isDark ? 'bg-main' : 'bg-cdarkblue')
  })
</script>

<div
  class="relative w-full overflow-y-auto overflow-x-hidden {page.url.pathname === '/'
    ? 'h-full'
    : 'h-[calc(100%_-_var(--nav-height))]'} ">
  <Dialog.Root bind:open={app.isModalOpened}>
    {#if app.error}
      <div class="flex h-full flex-col items-center justify-center gap-y-5 px-2 text-center">
        {data.errors.error_msg}
        <span>{app.error.split('. ')[0]}</span>
        <button
          onclick={() => window.location.reload()}
          class="relative outline-none transition-transform will-change-transform active:scale-95">
          <WalletBtn width={165} height={37} fill="rgb(var(--c-yellow))" stroke="var(--dark-yellow)" />
          <span class="absolute left-0 top-0 flex size-full items-center justify-center">
            {data.reload}
          </span>
        </button>
      </div>
    {:else if app.isLoading}
      <div
        in:fade={{ delay: 130, duration: 0 }}
        out:fade={{ duration: app.error ? 0 : 250, easing: sineInOut }}
        class="fixed z-50 size-full">
        <img
          height="100vh"
          alt="Prison loading"
          class="aspect-[2/3] size-full max-h-full lg:object-contain"
          src="/load.webp" />
        <div class="absolute bottom-[5%] left-0 flex w-full flex-col items-center justify-center gap-y-1">
          <span class="after:dots order-2 block text-2xl font-semibold text-cmediumyellow after:content-['.']">
            {data.loading}
          </span>
          <ProgressBar progress={progress.current} />
        </div>
      </div>
    {:else}
      {@render children()}
      <BottomNav />
    {/if}
  </Dialog.Root>
</div>

<Toaster />
