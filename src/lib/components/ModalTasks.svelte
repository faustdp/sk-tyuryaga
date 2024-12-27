<script lang="ts">
  import CheckLink from '@icons/checkLink.svg?component'
  import InputClear from '@icons/InputClear.svelte'
  import Spinner from '@icons/Spinner.svelte'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import Spider from '@images/Spider.svelte'
  import { closeModal } from '@state/app.svelte'
  import { w8 } from '@utils'
  import { postCheckCode } from '@utils/api'
  import { SECOND } from '@utils/const'
  import { onDestroy, tick } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'

  import data from '@/messages.json'
  import * as Dialog from '$lib/components/dialog/'

  let {
    task,
    setDoneTask,
    toastSuccess,
  }: {
    task: SocialItem | null
    setDoneTask: (item: SocialItem) => void
    toastSuccess: (reward: number) => void
  } = $props()

  const errorTO = 2400
  const minCodeLength = 1

  let inputEl = $state<HTMLInputElement>()
  let isFetchingCode = $state(false)
  let codeIsWrong = $state(false)
  let codeIsRight = $state(false)
  let inputValue = $state('')
  let lastWrongCode = $state('')
  let wrongTO: NodeJS.Timeout

  async function handleCodeCheck() {
    const value = inputValue.trim()
    if (value.length < minCodeLength || isFetchingCode || codeIsRight || value === lastWrongCode || !task) return
    clearTimeout(wrongTO)
    isFetchingCode = true
    const res = await postCheckCode(task.id, value)
    const data = res ? await res.json() : null
    isFetchingCode = false
    if (data?.ok) {
      codeIsWrong = false
      codeIsRight = true
      toastSuccess(task.reward)
      await w8(SECOND)
      codeIsRight = false
      inputValue = ''
      if (data.done) {
        await setDoneTask(task)
        closeModal()
      }
    } else {
      codeIsWrong = true
      lastWrongCode = value
      wrongTO = setTimeout(() => {
        codeIsWrong = false
      }, errorTO)
    }
  }

  $effect(() => {
    if (inputEl) {
      tick().then(() => {
        inputEl?.focus()
      })
    }
  })

  onDestroy(() => {
    clearTimeout(wrongTO)
    closeModal()
  })
</script>

<Dialog.Content isAbsolute class="card-shadow flex flex-col overflow-hidden bg-ccard sm:max-w-[425px]">
  <Spider withTransform classes="absolute -left-8 -top-2" />
  <Dialog.Header class="mx-auto mb-4 w-full max-w-[344px]">
    <Dialog.Title class="shadow-heading !mb-3.5 !mt-0 text-center text-xl">{data.code_phrase}</Dialog.Title>
    <a
      href={task?.link}
      target="_blank"
      class="!mb-3.5 flex gap-x-2 self-center text-sm text-cyellow outline-0 transition-transform will-change-transform active:scale-95">
      {data.watch_video}
      <CheckLink />
    </a>
    <Dialog.Description class="!mt-0">{data.watch_desc}</Dialog.Description>
  </Dialog.Header>
  <div class="relative w-full max-w-[344px] self-center">
    <input
      type="text"
      bind:value={inputValue}
      bind:this={inputEl}
      placeholder={data.insert_code}
      class="roboto {codeIsWrong
        ? 'border-cinputred'
        : codeIsRight
          ? 'border-clightgreen'
          : 'border-cdarkblue'} mb-7 w-full rounded-xl border-2 py-2 pl-4 pr-8 text-sm text-black outline-0 transition-all" />
    <InputClear
      show={codeIsWrong}
      class="absolute right-3.5 top-2.5 cursor-pointer"
      onclick={() => {
        inputValue = ''
        codeIsWrong = false
      }} />
    {#if codeIsWrong || codeIsRight}
      <span
        transition:scale={{ duration: 240, easing: cubicOut }}
        class="absolute bottom-2 left-0 text-xs {codeIsWrong ? 'text-cinputred' : 'text-clightgreen'} ">
        {codeIsWrong ? data.wrong_code : data.correct_code}
      </span>
    {/if}
  </div>
  <button
    class="self-center outline-none transition-transform will-change-transform active:scale-95"
    onclick={handleCodeCheck}>
    <WalletBtn
      height={40}
      fill={inputValue.length < minCodeLength || (lastWrongCode && lastWrongCode === inputValue)
        ? 'rgb(var(--c-darkblue))'
        : 'rgb(var(--c-green))'}
      stroke={inputValue.length < minCodeLength || (lastWrongCode && lastWrongCode === inputValue)
        ? 'black'
        : 'var(--dark-green)'} />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-sm">
      {#if isFetchingCode}
        <Spinner />
      {:else}
        {data.take}!
      {/if}
    </span>
  </button>
</Dialog.Content>
