<script lang="ts">
  import CheckLink from '@icons/checkLink.svg?component'
  import InputClear from '@icons/InputClear.svelte'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import Spider from '@images/Spider.svelte'
  import { closeModal } from '@state/app.svelte'
  import { onDestroy } from 'svelte'

  import data from '@/messages.json'
  import * as Dialog from '$lib/components/dialog/'

  let { task }: { task: SocialItem | null } = $props()

  let codeIsWrong = $state(false)
  let inputValue = $state('')
  let TO: NodeJS.Timeout

  function handleCodeCheck() {
    clearTimeout(TO)
    if (task?.code && inputValue !== task.code) {
      codeIsWrong = true
      TO = setTimeout(() => {
        codeIsWrong = false
      }, 2000)
    } else {
      codeIsWrong = false
      closeModal()
    }
  }

  onDestroy(() => {
    clearTimeout(TO)
  })
</script>

<Dialog.Content class="card-shadow flex flex-col overflow-hidden bg-ccard sm:max-w-[425px]">
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
      placeholder={data.insert_code}
      class="roboto {codeIsWrong
        ? 'border-cinputred'
        : 'border-cdarkblue'} mb-7 w-full rounded-xl border-2 py-2 pl-4 pr-8 text-sm text-black outline-0 transition-all" />
    <InputClear
      show={codeIsWrong}
      class="absolute right-3.5 top-2.5 cursor-pointer"
      onclick={() => {
        inputValue = ''
        codeIsWrong = false
      }} />
  </div>
  <button
    class="self-center outline-none transition-transform will-change-transform active:scale-95"
    onclick={handleCodeCheck}>
    <WalletBtn
      height={40}
      fill={task?.code && inputValue.length >= task.code.length ? 'rgb(var(--c-green))' : 'rgb(var(--c-darkblue))'}
      stroke={task?.code && inputValue.length >= task.code.length ? 'var(--dark-green)' : 'black'} />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-sm">
      {data.take}!
    </span>
  </button>
</Dialog.Content>
