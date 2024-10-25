<script lang="ts">
  import Chain from '@icons/Chain.svelte'
  import Cigarette from '@icons/cigarette.svg?component'
  import Done from '@icons/done.svg?component'
  import Ig from '@icons/socials/Ig.svelte'
  import Tg from '@icons/socials/tg.svg?component'
  import Tt from '@icons/socials/tt.svg?component'
  import Vk from '@icons/socials/vk.svg?component'
  import Yt from '@icons/socials/yt.svg?component'
  import { type Component } from 'svelte'

  type Status = 'start' | 'claim' | 'done'

  interface SocialItem {
    Icon: Component
    task: string
    reward: string
    status: Status
  }

  const socials: SocialItem[] = [
    {
      Icon: Yt,
      task: 'Посмотри видео и впиши код',
      reward: '200 USDT',
      status: 'start',
    },
    {
      Icon: Tg,
      task: 'Позови 100 корешей',
      reward: '200 USDT',
      status: 'start',
    },
    {
      Icon: Tt,
      task: 'Посмотри видео и впиши код',
      reward: '200 USDT',
      status: 'claim',
    },
    {
      Icon: Ig,
      task: 'Посмотри видео и впиши код',
      reward: '200 USDT',
      status: 'claim',
    },
    {
      Icon: Vk,
      task: 'Посмотри видео и впиши код',
      reward: '200 USDT',
      status: 'done',
    },
  ]

  // function openUrl(url: Location) {
  //   window.location = url
  // }
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>

{#snippet social({ Icon, task, reward, status }: SocialItem)}
  <li class="flex flex-1 items-center gap-x-3 border-b border-solid border-cborder py-2">
    <Icon />
    <span class="flex flex-1 flex-col gap-y-2.5 text-sm">
      {task}
      <span class="text-xs text-textgrey">{reward}</span>
    </span>
    <button
      class="relative ml-auto flex h-[40px] w-[68px] items-center justify-center overflow-hidden rounded-lg outline-none transition-transform active:scale-90">
      <svg class="absolute left-0 top-0 will-change-transform">
        <use
          href="#social-chain"
          color={status === 'start'
            ? 'rgb(var(--c-brown))'
            : status === 'claim'
              ? 'rgb(var(--c-green))'
              : 'rgb(var(--c-text-grey))'}>
        </use>
      </svg>
      <span class="relative text-sm">
        {#if status === 'start'}
          Старт
        {:else if status === 'claim'}
          Сюда
        {:else}
          <Done />
        {/if}
      </span>
    </button>
  </li>
{/snippet}

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pt-4">
  <div class="page-circle relative mb-5">
    <Cigarette width="64" height="64" class="relative" />
  </div>
  <h1 class="shadow-heading mb-2.5 text-xl">Доступные задания</h1>
  <p class="roboto mb-4 max-w-sm text-center text-xs tracking-wide">
    Выполняй задания и зарабатывай выполняй задания и зарабатывай выполняй задания и зарабатывай
  </p>
  <div class="relative mb-7 h-9 w-[calc(100%_+_2rem)]">
    <Chain classes="absolute w-full top-0 left-0 rotate-180" />
  </div>
  <ul class="flex w-full list-none flex-col">
    {#each socials as socialItem}
      {@render social(socialItem)}
    {/each}
  </ul>
</div>
