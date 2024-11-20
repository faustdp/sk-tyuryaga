<script lang="ts">
  import Cigarette from '@icons/cigarette.svg?component'
  import FriendsAmount from '@icons/friendsAmount.svg?component'
  import Inmates from '@icons/inmates.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { app } from '@state/app.svelte'
  import { FARMED } from '@utils/const'

  import Drawer from '@/Drawer.svelte'
  import data from '@/messages.json'

  interface FriendStat {
    name: string
    invites: number
    cigs: number
  }

  let isDrawerOpened = $state(false)

  function closeDrawer() {
    isDrawerOpened = false
  }

  const friends: FriendStat[] = [
    {
      name: 'Имя',
      invites: 3,
      cigs: 123123,
    },
    {
      name: 'ГИмя',
      invites: 13,
      cigs: 123,
    },
    {
      name: 'ВИмя',
      invites: 53,
      cigs: 999999999,
    },
    {
      name: 'Омя',
      invites: 33,
      cigs: 123123,
    },
    {
      name: 'Амя',
      invites: 3,
      cigs: 1231,
    },
    {
      name: 'Омя',
      invites: 33,
      cigs: 123123,
    },
    {
      name: 'Амя',
      invites: 3,
      cigs: 1231,
    },
  ]
</script>

<svelte:head>
  <title>{data.friends_title}</title>
  <meta name="description" content={data.friends_content} />
</svelte:head>

{#snippet frens({ name, invites, cigs }: FriendStat)}
  <div class="flex flex-1 items-center gap-x-3 py-2">
    <div class="flex size-8 select-none items-center justify-center rounded-full bg-[#0088cc] pt-0.5">
      {name[0].toUpperCase()}
    </div>
    <!-- <img src="" alt=""> -->
    <span class="flex flex-1 flex-col gap-y-2.5 text-sm">
      {name}
      <span class="text-xs text-textgrey">+{invites}</span>
    </span>
    <p class="relative ml-auto flex items-center">
      {cigs.toLocaleString()}
      <Cigarette class="-mt-0.5 ml-1" width="36" height="19" />
    </p>
  </div>
{/snippet}

{#snippet btn({ text, onclick, classes = '' }: { text: string; onclick: () => void; classes?: string })}
  <button class="{classes} outline-none transition-transform will-change-transform active:scale-95" {onclick}>
    <WalletBtn fill="rgb(var(--c-yellow))" stroke="var(--dark-yellow)" />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-xl">{text}</span>
  </button>
{/snippet}

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pt-4">
  <div class="page-circle relative mb-5">
    <Inmates class="relative" width="64" height="64" viewBox="0 0 37 32" />
  </div>
  <h1 class="shadow-heading mb-5 text-xl">{data.friends_call}</h1>
  <section class="relative mb-1">
    <FriendsAmount />
    <p class="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-y-3 py-4">
      <span class="arbutus flex items-center text-xl">
        <Cigarette class="mr-1" width="38" height="23" />
        0
      </span>
      <button class="relative outline-none transition-transform will-change-transform active:scale-95">
        <WalletBtn
          width={165}
          height={37}
          stroke={app.farm === FARMED ? 'var(--dark-green)' : 'black'}
          fill={app.farm === FARMED ? 'rgb(var(--c-green))' : 'rgb(var(--c-darkblue))'} />
        <span class="absolute left-0 top-0 flex size-full items-center justify-center text-xs">
          {#if app.farm === FARMED}
            {data.take}
          {:else}
            {data.friends_take} 01ч 01м
          {/if}
        </span>
      </button>
    </p>
  </section>
  <p class="roboto mb-3.5 max-w-[344px] text-center text-xs tracking-wide text-textgrey">
    {data.friends_desc}
  </p>
  <section class="mb-2 flex w-full max-w-[344px] flex-col">
    <h2 class="shadow-heading mb-3 self-start text-base">{data.friends_yours}</h2>
    {#each friends as friend}
      {@render frens(friend)}
    {/each}
  </section>
  {@render btn({ text: data.friends_call, onclick: () => (isDrawerOpened = true), classes: 'sticky -bottom-px' })}
</div>

<Drawer isOpened={isDrawerOpened} handleClose={closeDrawer}>
  {@render btn({ text: data.send_tg, onclick: () => null, classes: 'mb-0.5 mt-4' })}
  {@render btn({ text: data.copy_link, onclick: () => null, classes: 'mt-4' })}
</Drawer>
