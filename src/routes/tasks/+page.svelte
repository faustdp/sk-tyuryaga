<script lang="ts">
  import Chain from '@icons/Chain.svelte'
  import Cigarette from '@icons/cigarette.svg?component'
  import Done from '@icons/done.svg?component'
  // import Spinner from '@icons/Spinner.svelte'
  import data from '@lib/messages.json'
  import { sortTasks, w8 } from '@utils'
  import { TASK_CTX, taskStatus } from '@utils/const'
  import { getContext } from 'svelte'
  import { flip } from 'svelte/animate'

  let tasks: SocialItem[] = getContext(TASK_CTX)

  async function handleClick(item: SocialItem) {
    if (item.status === taskStatus.done) return
    if (item.status === taskStatus.claim) {
      item.status = taskStatus.done
      sortTasks(tasks)
    } else if (item.status === taskStatus.start) {
      item.status = taskStatus.loading
      window.open('https://x.com/intent/follow?screen_name=NASA', '_blank')
      if (item.delay) {
        await w8(item.delay)
        item.status = taskStatus.claim
      }
    }
  }
</script>

<svelte:head>
  <title>{data.tasks_title}</title>
  <meta name="description" content={data.tasks_content} />
</svelte:head>

{#snippet spinner()}
  <span class="spinner-arrows">
    <i></i>
    <i></i>
    <i></i>
    <i></i>
    <i></i>
    <i></i>
    <i></i>
    <i></i>
  </span>
{/snippet}

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pt-4">
  <div class="page-circle relative mb-5">
    <Cigarette width="64" height="64" class="relative" />
  </div>
  <h1 class="shadow-heading mb-2.5 text-xl">{data.available_tasks}</h1>
  <p class="roboto mb-4 max-w-sm text-center text-xs tracking-wide">
    {data.tasks_desc}
  </p>
  <div class="relative mb-7 h-9 w-[calc(100%_+_2rem)]">
    <Chain classes="absolute w-full top-0 left-0 rotate-180" />
  </div>
  <ul class="flex w-full list-none flex-col">
    {#each tasks as socialItem (socialItem)}
      {@const Icon = socialItem.Icon}
      <li
        animate:flip={{ duration: 250 }}
        class="flex flex-1 items-center gap-x-3 border-b border-solid border-cborder py-2">
        <Icon />
        <span class="flex flex-1 flex-col gap-y-2.5 text-sm">
          {socialItem.task}
          <span class="text-xs text-textgrey">{socialItem.reward}</span>
        </span>
        <button
          onclick={() => handleClick(socialItem)}
          class="relative ml-auto flex h-[40px] w-[68px] items-center justify-center overflow-hidden rounded-lg outline-none transition-transform active:scale-90">
          <svg class="absolute left-0 top-0 will-change-transform">
            <use
              href="#social-chain"
              color={socialItem.status === taskStatus.start || socialItem.status === taskStatus.loading
                ? 'rgb(var(--c-brown))'
                : socialItem.status === taskStatus.claim
                  ? 'rgb(var(--c-green))'
                  : 'rgb(var(--c-text-grey))'}>
            </use>
          </svg>
          <span class="relative text-sm">
            {#if socialItem.status === 0}
              {data.start}
            {:else if socialItem.status === taskStatus.claim}
              {data.take}
            {:else if socialItem.status === taskStatus.loading}
              <!--  <Spinner /> -->
              {@render spinner()}
            {:else}
              <Done />
            {/if}
          </span>
        </button>
      </li>
    {/each}
  </ul>
</div>
