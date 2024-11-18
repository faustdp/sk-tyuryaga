<script lang="ts">
  import '../app.css'
  import '@fontsource/russo-one/400.css'
  import '@fontsource/arbutus/400.css'
  import '@fontsource/roboto/400.css'

  import Ig from '@icons/socials/ig.svg?component'
  import Tg from '@icons/socials/tg.svg?component'
  import Tt from '@icons/socials/tt.svg?component'
  import Vk from '@icons/socials/vk.svg?component'
  import Yt from '@icons/socials/yt.svg?component'
  import CheckSuccess from '@icons/checkSuccess.svg?component'
  import { app, setIsLoaded } from '@state/app.svelte' //setError
  import {} from '@sveltejs/kit'
  import { init, isTMA, miniAppReady, mountMiniApp } from '@telegram-apps/sdk' //closeMiniApp
  import { noop, sortTasks } from '@utils'
  import { TASK_CTX, taskStatus } from '@utils/const'
  import { fixTouch } from '@utils/fixTouch'
  import { useTonConnect } from '@utils/useTonConnect'
  import { validate } from '@utils/verifyUser'
  import { onMount, setContext } from 'svelte'
  import { Toaster } from 'svelte-hot-french-toast'

  import BottomNav from '@/BottomNav.svelte'
  import data from '@/messages.json'
  import { page } from '$app/stores'
  import * as Dialog from '$lib/components/dialog/'

  console.clear()

  async function initApp() {
    const isTG = await isTMA()
    if (!isTG) {
      // setError('Tg app')
    }
    try {
      await validate()
    } catch (_err) {
      // if (err instanceof Error) {
      //   if (err.message === 'Data is outdated') {
      //     closeMiniApp()
      //   }
      //   setError(err.message)
      // } else if (typeof err === 'string') {
      //   setError(err)
      // } else {
      //   setError('Unexpected Error')
      // }
    } finally {
      setIsLoaded()
    }
  }

  initApp()
  useTonConnect()

  let tasks: SocialItem[] = $state(
    sortTasks([
      {
        id: 1,
        Icon: Yt,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.check,
        link: 'https://google.com',
      },
      {
        id: 6,
        Icon: Tg,
        task: 'Позови 100 корешей',
        reward: '200 USDT',
        status: taskStatus.start,
        link: 'https://x.com/intent/follow?screen_name=NASA',
        delay: 5000,
      },
      {
        id: 5,
        Icon: Tt,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.done,
        link: 'https://google.com',
      },
      {
        id: 3,
        Icon: Yt,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.check,
        link: 'https://google.com',
      },
      {
        id: 2,
        Icon: Ig,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.claim,
        link: 'https://google.com',
      },
      {
        id: 4,
        Icon: Vk,
        task: 'Посмотри видео и впиши код',
        reward: '200 USDT',
        status: taskStatus.loading,
        link: 'https://google.com',
      },
    ]),
  )

  setContext(TASK_CTX, tasks)

  onMount(() => {
    let removeListeners = noop

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
    }
  })

  let { children } = $props()
</script>

<div
  class="relative w-full overflow-x-hidden {$page.url.pathname === '/'
    ? 'h-full'
    : 'h-[calc(100%_-_var(--nav-height))]'} overflow-y-auto bg-cdarkblue">
  <Dialog.Root bind:open={app.isModalOpened}>
    {#if app.error}
      {data.error_msg} {app.error}
    {:else if !app.isLoading}
      {@render children()}
      <BottomNav />
    {/if}
  </Dialog.Root>
</div>

<Toaster
  toastOptions={{
    duration: 3000,
    icon: CheckSuccess,
  }} />
