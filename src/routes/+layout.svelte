<script lang="ts">
  import '../app.css'
  import '@fontsource/russo-one/400.css'
  import '@fontsource/arbutus/400.css'
  import '@fontsource/roboto/400.css'

  import ProgressBar from '@components/ProgressBar.svelte'
  // import CheckError from '@icons/checkError.svg?component'
  // toast.error(`${data.toaster_msg} Ошибка ${data.boost_cig}!`, { class: 'toast-error', icon: CheckError })
  import Ig from '@icons/socials/ig.svg?component'
  import Tg from '@icons/socials/tg.svg?component'
  import Tt from '@icons/socials/tt.svg?component'
  import Vk from '@icons/socials/vk.svg?component'
  import Yt from '@icons/socials/yt.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app, setError, setIsLoaded } from '@state/app.svelte'
  import { setUser } from '@state/user.svelte'
  import {
    closeMiniApp,
    init,
    isTMA,
    miniAppReady,
    mountMiniApp,
    parseInitData,
    // retrieveLaunchParams,
  } from '@telegram-apps/sdk'
  import { noop, sortTasks, w8 } from '@utils'
  import { meUrl, TASK_CODE, TASK_CTX, TASK_INVITE, TASK_SUBSCRIBE, taskStatus } from '@utils/const'
  import { fixTouch } from '@utils/fixTouch'
  import { useTonConnect } from '@utils/useTonConnect'
  import { onMount, setContext } from 'svelte'
  import { sineInOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'
  import { fade } from 'svelte/transition'
  import { Toaster } from 'svelte-hot-french-toast'

  import BottomNav from '@/BottomNav.svelte'
  import data from '@/messages.json'
  import { page } from '$app/stores'
  import * as Dialog from '$lib/components/dialog/'

  console.clear()

  let tasks: SocialItem[] = $state(
    sortTasks([
      {
        id: 1,
        Icon: Yt,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.check,
        link: 'https://google.com',
        type: TASK_CODE,
      },
      {
        id: 7,
        Icon: Ig,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.start,
        link: 'https://google.com',
        type: TASK_CODE,
      },
      {
        id: 6,
        Icon: Tg,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.start,
        link: 'https://x.com/intent/follow?screen_name=NASA',
        type: TASK_SUBSCRIBE,
        delay: 5000,
      },
      {
        id: 5,
        Icon: Tt,
        task: 'Позови 100 корешей',
        reward: '200 USDT',
        status: taskStatus.start,
        link: 'https://google.com',
        type: TASK_INVITE,
        invites: 10,
      },
      {
        id: 3,
        Icon: Yt,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.check,
        link: 'https://google.com',
        type: TASK_CODE,
      },
      {
        id: 2,
        Icon: Ig,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.claim,
        link: 'https://google.com',
        type: TASK_CODE,
      },
      {
        id: 4,
        Icon: Vk,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.loading,
        link: 'https://google.com',
        type: TASK_CODE,
      },
    ]),
  )

  setContext(TASK_CTX, tasks)

  let progressDefDur = 1400
  const progressShortDur = 130
  let progress = tweened(0, {
    duration: progressShortDur,
    easing: sineInOut,
  })

  let interval: number | null = null

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
      const ind = treshholds.findIndex((numb) => $progress < numb)
      const nextProgress = ind >= 0 ? $progress + values[ind] : $progress < 100 ? $progress : 100
      progress.set(nextProgress, { duration: nextProgress === 100 ? progressDefDur : progressShortDur })
      if ($progress === 100) stopProgress()
    }, 80)
  }

  async function initTgApp() {
    const isTG = await isTMA()

    const initData =
      'user=%7B%22id%22%3A883729040%2C%22first_name%22%3A%22Denis%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22paskodenis%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8084724315231179358&chat_type=private&auth_date=1728214924&hash=34ed36bf7e67585d9d78c6d07bae62c8d59902d22cd24cb119c180cda909ff5d'
    if (!isTG) {
      // return setError('tg_app')
      const user = parseInitData(initData).user
      if (!user) return
      const { id: tg_id, username, firstName: first_name } = user
      setUser({
        tg_id,
        first_name,
        username,
        direct_invites: 0,
        indirect_invites: 0,
      })
      // return setIsLoaded()
    }

    try {
      const reqStart = performance.now()
      // const params = retrieveLaunchParams()
      const response = await fetch(meUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: initData }), //params.initDataRaw
      })

      stopProgress()
      const reqDiff = performance.now() - reqStart
      progressDefDur = reqDiff < progressDefDur - 50 ? progressDefDur - reqDiff : 50
      progress.set(100, { duration: progressDefDur })

      const result: ValidationResponse = await response.json()

      if (!result.valid) {
        const error = result.error
        if (error === undefined) throw new Error(data.data_error)

        const errorMsg =
          error === undefined ? data.data_error : error in data ? (data[error as keyof typeof data] as string) : error

        throw new Error(errorMsg)
      }

      const { tg_id, first_name, username, direct_invites, indirect_invites } = result.userData

      setUser({
        tg_id,
        first_name,
        username,
        direct_invites,
        indirect_invites,
      })
    } catch (err) {
      if (err instanceof Error) {
        const error = err as TypedError
        if (error.type === 'ERR_RETRIEVE_LP_FAILED' || err.message === 'Data is outdated') {
          closeMiniApp()
        }
        setError(err.message)
      } else if (typeof err === 'string') {
        setError(err)
      } else {
        setError(data.error_msg)
      }
    } finally {
      await w8(progressDefDur + 25)
      setIsLoaded()
    }
  }

  initTgApp()
  useTonConnect()

  onMount(() => {
    let removeListeners = noop
    startProgress()

    try {
      init()
      mountMiniApp()
      miniAppReady()
      removeListeners = fixTouch()
      // setIsMounted()
      // mountBackButton()
      // showBackButton()
    } catch (_err) {}

    return () => {
      removeListeners()
      stopProgress()
    }
  })

  let { children } = $props()

  $effect(() => {
    const isDark = !!app.error || !!app.isLoading
    document.body.classList.add(isDark ? 'bg-cdarkblue' : 'bg-main')
    document.body.classList.remove(isDark ? 'bg-main' : 'bg-cdarkblue')
  })
</script>

<div
  class="relative w-full overflow-y-auto overflow-x-hidden {$page.url.pathname === '/'
    ? 'h-full'
    : 'h-[calc(100%_-_var(--nav-height))]'} ">
  <Dialog.Root bind:open={app.isModalOpened}>
    {#if app.error}
      <div class="flex h-full flex-col items-center justify-center gap-y-5">
        {data.error_msg}
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
      <div out:fade={{ duration: 250, easing: sineInOut }} class="fixed z-50 size-full">
        <img
          height="100vh"
          alt="Prison loading"
          class="aspect-[2/3] size-full max-h-full lg:object-contain"
          src="/load.webp" />
        <div class="absolute bottom-[5%] left-0 flex w-full flex-col items-center justify-center gap-y-1">
          <span class="after:dots order-2 block text-2xl font-semibold text-[#ffb901] after:content-['.']">
            {data.loading}
          </span>
          <ProgressBar progress={$progress} />
        </div>
      </div>
    {:else}
      {@render children()}
      <BottomNav />
    {/if}
  </Dialog.Root>
</div>

<Toaster />
