<script lang="ts">
  import ModalTasks from '@components/ModalTasks.svelte'
  import Chain from '@icons/Chain.svelte'
  import Cigarette from '@icons/cigarette.svg?component'
  import Done from '@icons/done.svg?component'
  import Spinner from '@icons/Spinner.svelte'
  import { app, openModal } from '@state/app.svelte'
  import { sortTasks, w8 } from '@utils'
  import { TASK_CTX, taskStatus } from '@utils/const'
  import { getContext } from 'svelte'
  import { flip } from 'svelte/animate'
  import toast from 'svelte-hot-french-toast'

  import data from '@/messages.json'

  let tasks: SocialItem[] = getContext(TASK_CTX)
  let selectedTaskCheck: SocialItem | null = $state(null)

  async function handleClick(item: SocialItem) {
    if (item.status === taskStatus.done || item.status === taskStatus.loading) return
    if (item.status === taskStatus.claim) {
      item.status = taskStatus.done
      toast.success(`${data.toaster_msg} ${item.reward} ${data.boost_cig}!`)
      sortTasks(tasks)
    } else if (item.status === taskStatus.start) {
      item.status = taskStatus.loading
      window.open(item.link, '_blank')
      if (item.delay) {
        await w8(item.delay)
        item.status = taskStatus.claim
      }
    } else if (item.status === taskStatus.check) {
      selectedTaskCheck = item
      openModal()
    }
  }

  $effect(() => {
    const isModalOpened = app.isModalOpened
    if (!isModalOpened) {
      selectedTaskCheck = null
    }
  })

  function setTask(id: number, status: Status) {
    const task = tasks.find((el) => el.id === id)
    if (task) {
      task.status = status
      sortTasks(tasks)
    }
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
      {@const Icon = socialItem.Icon}
      <li
        animate:flip={{ duration: 280 }}
        class="flex flex-1 items-center gap-x-3 border-b border-solid border-cborder py-2">
        <Icon />
        <span class="flex flex-1 flex-col gap-y-2.5 text-sm {isDone ? 'text-cborder' : ''}">
          {socialItem.task}
          <span class="text-xs {isDone ? 'text-cborder' : 'text-textgrey'}">{socialItem.reward}</span>
        </span>
        <button
          onclick={() => handleClick(socialItem)}
          class="relative ml-auto flex h-[40px] w-[68px] items-center justify-center overflow-hidden rounded-lg outline-none transition-transform active:scale-90">
          <svg class="absolute left-0 top-0 will-change-transform">
            <use
              href="#social-chain"
              color={socialItem.status === taskStatus.start || socialItem.status === taskStatus.loading
                ? 'rgb(var(--c-yellow))'
                : socialItem.status === taskStatus.claim
                  ? 'rgb(var(--c-green))'
                  : socialItem.status === taskStatus.check
                    ? 'rgb(var(--c-brown))'
                    : 'rgb(var(--c-text-grey))'}>
            </use>
          </svg>
          <span class="relative text-sm">
            {#if socialItem.status === 0}
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

<ModalTasks task={selectedTaskCheck} {setTask} />
