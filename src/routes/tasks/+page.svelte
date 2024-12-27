<script lang="ts">
  import InviteFriends from '@components/InviteFriends.svelte'
  import ModalTasks from '@components/ModalTasks.svelte'
  import Chain from '@icons/Chain.svelte'
  import CheckSuccess from '@icons/checkSuccess.svg?component'
  import Cigarette from '@icons/cigarette.svg?component'
  import Done from '@icons/done.svg?component'
  import Spinner from '@icons/Spinner.svelte'
  import { app, openModal } from '@state/app.svelte'
  import { user } from '@state/user.svelte'
  import { sortTasks, w8 } from '@utils'
  import { postCheckSubscription, postTaskStatus } from '@utils/api'
  import { iconsComponents, TASK_CODE, TASK_CTX, TASK_INVITE, taskStatus } from '@utils/const'
  import { getContext, untrack } from 'svelte'
  import { flip } from 'svelte/animate'
  import toast from 'svelte-hot-french-toast'

  import data from '@/messages.json'

  let isDrawerOpened = $state(false)
  let taskId: number | null = $state(null)

  function closeDrawer() {
    isDrawerOpened = false
  }

  let tasks: (SocialItemCode | SocialItemInvite | SocialItemSubscribe)[] = getContext(TASK_CTX)
  let selectedTaskCheck: SocialItem | null = $state(null)

  $effect(() => {
    const isModalOpened = app.isModalOpened
    if (!isModalOpened) {
      selectedTaskCheck = null
    }
  })

  $effect(() => {
    if (taskId === null) return
    const intervalId = setInterval(async () => {
      try {
        const item = untrack(() => tasks.find((el) => el.id === taskId))
        if (!item?.link) return
        const response = await postCheckSubscription(`@${item.link.split('/').at(-1)}`)
        const data = response ? await response.json() : null
        if (data && data.ok) {
          clearInterval(intervalId)
          item.status = taskStatus.claim
          taskId = null
        }
      } catch (error) {
        console.error('+page54', error)
      }
    }, 5000)

    return () => {
      clearInterval(intervalId)
    }
  })

  async function handleTaskClick(item: SocialItemCode | SocialItemInvite | SocialItemSubscribe) {
    if (item.status === taskStatus.done) return
    if (item.status === taskStatus.loading) {
      if (item.link) window.open(item.link, '_blank')
      return
    }
    if (item.status === taskStatus.claim) {
      toastSuccess(item.reward)
      await setDoneTask(item)
    } else if (item.status === taskStatus.start) {
      if (item.type === TASK_INVITE) {
        if (item.invites > user.invites) {
          isDrawerOpened = true
        } else {
          toastSuccess(item.reward)
          await setDoneTask(item)
        }
      } else {
        item.status = item.type === TASK_CODE ? taskStatus.check : taskStatus.loading
        if (item.type === TASK_CODE) {
          await postTaskStatus(item.id, taskStatus.check)
        }
        window.open(item.link, '_blank')
        if (item.delay) {
          await w8(item.delay)
          item.status = taskStatus.claim
          await postTaskStatus(item.id, taskStatus.claim)
        } else {
          if (taskId !== null) {
            const task = tasks.find((el) => el.id === taskId)
            if (task) {
              task.status = taskStatus.start
            }
          }
          taskId = item.id
        }
      }
    } else if (item.status === taskStatus.check) {
      selectedTaskCheck = item
      openModal()
    }
  }

  function toastSuccess(reward: number) {
    toast.success(`${data.toaster_msg} ${reward} ${data.boost_cig}!`, {
      class: 'toast-success',
      icon: CheckSuccess,
    })
  }

  async function setDoneTask(item: SocialItem) {
    item.status = taskStatus.done
    sortTasks(tasks)
    await postTaskStatus(item.id, taskStatus.done)
  }
</script>

<svelte:head>
  <title>{data.tasks_title}</title>
  <meta name="description" content={data.tasks_content} />
</svelte:head>

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pt-4">
  <div class="page-circle relative mb-5">
    <Cigarette width="64" height="64" class="relative" />
  </div>
  <h1 class="shadow-heading mb-2.5 text-xl">{data.available_tasks}</h1>
  <p class="roboto mb-4 max-w-sm text-center text-xs tracking-wide text-textgrey">
    {data.tasks_desc}
  </p>
  <div class="relative mb-7 h-9 w-[calc(100%_+_2rem)]">
    <Chain classes="absolute w-full top-0 left-0 rotate-180" />
  </div>
  <ul class="flex w-full list-none flex-col">
    {#each tasks as socialItem (socialItem)}
      {@const isDone = socialItem.status === taskStatus.done}
      {@const Icon = socialItem.Icon in iconsComponents ? iconsComponents[socialItem.Icon] : socialItem.Icon}
      <li
        animate:flip={{ duration: 280 }}
        class="flex flex-1 items-center gap-x-3 border-b border-solid border-cborder py-2">
        {#if typeof Icon === 'string'}
          <img src={Icon} alt={socialItem.name} width="32" />
        {:else}
          <Icon />
        {/if}
        <span class="flex flex-1 flex-col gap-y-2.5 text-sm {isDone ? 'text-cborder' : ''}">
          {socialItem.name}
          <span class="text-xs {isDone ? 'text-cborder' : 'text-textgrey'}">
            {#if socialItem.type === TASK_INVITE}
              {user.invites}/{socialItem.invites} {data.task_friends},
            {/if}
            {socialItem.reward}
          </span>
        </span>
        <button
          onclick={() => handleTaskClick(socialItem)}
          class="relative ml-auto flex h-[40px] w-[68px] items-center justify-center overflow-hidden rounded-lg outline-none transition-transform active:scale-90">
          <svg class="absolute left-0 top-0 will-change-transform">
            <use
              href="#social-chain"
              color={socialItem.status === taskStatus.done
                ? 'rgb(var(--c-text-grey))'
                : socialItem.status === taskStatus.claim
                  ? 'rgb(var(--c-green))'
                  : socialItem.status === taskStatus.check
                    ? 'rgb(var(--c-brown))'
                    : 'rgb(var(--c-yellow))'}>
            </use>
          </svg>
          <span class="relative text-sm">
            {#if socialItem.status === taskStatus.start}
              {data.start}
            {:else if socialItem.status === taskStatus.claim}
              {data.take}
            {:else if socialItem.status === taskStatus.check}
              {data.check}
            {:else if socialItem.status === taskStatus.loading}
              <Spinner />
            {:else}
              <Done />
            {/if}
          </span>
        </button>
      </li>
    {/each}
  </ul>
</div>

<ModalTasks task={selectedTaskCheck} {toastSuccess} {setDoneTask} />
<InviteFriends isOpened={isDrawerOpened} {closeDrawer} />
