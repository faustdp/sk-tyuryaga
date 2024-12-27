<script lang="ts">
  import InviteFriends from '@components/InviteFriends.svelte'
  import Cigarette from '@icons/cigarette.svg?component'
  import cigarette from '@icons/cigarette.svg?url'
  import FriendsIcon from '@icons/friends.svg?component'
  import FriendsAmount from '@icons/friendsAmount.svg?component'
  import Inmates from '@icons/inmates.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { setClaimFriends, user } from '@state/user.svelte'
  import { formatTime } from '@utils'
  import { postClaimFriends } from '@utils/api'
  import { DAY, SECOND } from '@utils/const'
  import { onDestroy } from 'svelte'
  import { SvelteDate } from 'svelte/reactivity'
  import { Confetti } from 'svelte-confetti'

  import data from '@/messages.json'

  let { data: pageData } = $props()

  $effect(() => {
    console.log('+page22', pageData)
  })

  let confettiTO: NodeJS.Timeout
  let date = new SvelteDate()
  let isDrawerOpened = $state(false)
  let showConfetti = $state(false)

  function closeDrawer() {
    isDrawerOpened = false
  }

  interface FriendStat {
    name: string
    invites: number
    cigs: number
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

  $effect(() => {
    const interval = setInterval(() => {
      date.setTime(Date.now())
    }, SECOND)

    return () => {
      clearInterval(interval)
    }
  })

  let isReady = $derived(user.claim_friends - date.getTime() < 0)

  async function handleClick() {
    if (!isReady) return
    showConfetti = true
    const time = DAY + date.getTime()
    setClaimFriends(time)
    confettiTO = setTimeout(() => {
      showConfetti = false
    }, SECOND * 10)
    await postClaimFriends(new Date(time).toISOString())
  }

  onDestroy(() => {
    clearTimeout(confettiTO)
  })
</script>

<svelte:head>
  <title>{data.nav_frens}</title>
  <meta name="description" content={data.friends_content} />
</svelte:head>

{#snippet frens({ name, invites, cigs }: FriendStat)}
  <div class="flex flex-1 items-center gap-x-3 py-2">
    <div class="flex size-8 select-none items-center justify-center rounded-full bg-cblue pt-0.5">
      {name[0].toUpperCase()}
    </div>
    <span class="flex flex-1 flex-col gap-y-2.5 text-sm">
      {name}
      <span class="roboto flex gap-x-1 text-xs text-textgrey"><FriendsIcon />+{invites}</span>
    </span>
    <p class="relative ml-auto flex items-center">
      {cigs.toLocaleString()}
      <Cigarette class="-mt-0.5 ml-1" width="36" height="19" />
    </p>
  </div>
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
        {user.amount_friends}
      </span>
      <button
        onclick={handleClick}
        class="relative h-[37px] min-w-[165px] px-3 outline-none transition-transform will-change-transform active:scale-95">
        <WalletBtn
          height={37}
          stroke={isReady ? 'var(--dark-green)' : 'black'}
          fill={isReady ? 'rgb(var(--c-green))' : 'rgb(var(--c-darkblue))'}
          classes={'absolute left-0 top-0 w-full'} />
        <span class="relative z-20 flex items-center justify-center text-xs">
          {#if isReady}
            {data.take}
          {:else}
            {data.friends_take} {formatTime(user.claim_friends - date.getTime(), true)}
          {/if}
        </span>
      </button>
      {#if showConfetti}
        <span class="absolute left-1/2 top-0">
          <Confetti y={[0.2, 0.5]} x={[-0.7, 0.7]} amount={25} size={25} colorArray={[`url(${cigarette})`]} />
        </span>
      {/if}
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
  <button
    class="sticky -bottom-px outline-none transition-transform will-change-transform active:scale-95"
    onclick={() => (isDrawerOpened = true)}>
    <WalletBtn fill="rgb(var(--c-yellow))" stroke="var(--dark-yellow)" />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-xl">{data.friends_call}</span>
  </button>
</div>

<InviteFriends isOpened={isDrawerOpened} {closeDrawer} />
