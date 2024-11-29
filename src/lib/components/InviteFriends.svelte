<script lang="ts">
  import CheckSuccess from '@icons/checkSuccess.svg?component'
  import WalletBtn from '@icons/WalletBtn.svelte'
  import { user } from '@state/user.svelte'
  import { openTelegramLink } from '@telegram-apps/sdk'
  import toast from 'svelte-hot-french-toast'

  import Drawer from '@/Drawer.svelte'
  import data from '@/messages.json'
  import { PUBLIC_BOT_APPNAME, PUBLIC_BOT_NAME } from '$env/static/public'

  let { isOpened, closeDrawer } = $props()

  let tgLink = $derived(`https://t.me/${PUBLIC_BOT_NAME}/${PUBLIC_BOT_APPNAME}?startapp=${user.username ?? user.tg_id}`)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(tgLink)
      toast.success(data.copied_link, {
        class: 'toast-success',
        icon: CheckSuccess,
      })
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  function inviteFriends() {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(tgLink)}&text=${encodeURIComponent(data.invite_text)}`
    openTelegramLink(shareUrl)
  }
</script>

{#snippet btn({ text, onclick, classes = '' }: { text: string; onclick: () => void; classes?: string })}
  <button class="{classes} outline-none transition-transform will-change-transform active:scale-95" {onclick}>
    <WalletBtn fill="rgb(var(--c-yellow))" stroke="var(--dark-yellow)" />
    <span class="absolute left-0 top-0 flex size-full items-center justify-center text-xl">{text}</span>
  </button>
{/snippet}

<Drawer {isOpened} handleClose={closeDrawer}>
  {@render btn({ text: data.send_tg, onclick: inviteFriends, classes: 'mb-0.5 mt-4' })}
  {@render btn({ text: data.copy_link, onclick: copyLink, classes: 'mt-4' })}
</Drawer>
