import { connectWallet, disconnectWallet } from '@state/app.svelte'
import { setAddress } from '@state/user.svelte'
import { THEME, TonConnectUI } from '@tonconnect/ui'
import { TON_KEY } from '@utils/const'
import { convertAddress } from '@utils/ton'
import { onMount, setContext } from 'svelte'

import { PUBLIC_BOT_NAME, PUBLIC_NODE_ENV, PUBLIC_SITE_URL } from '$env/static/public'

export function useTonConnect() {
  const manifestUrl = `${PUBLIC_SITE_URL}/tonconnect-manifest.json`
  const twaReturnUrl = `https://t.me/${PUBLIC_BOT_NAME}` as `${string}://${string}`

  const createTonConnectUI = () => {
    try {
      return new TonConnectUI({
        manifestUrl,
        uiPreferences: {
          theme: THEME.DARK,
        },
        language: 'ru',
        actionsConfiguration: {
          twaReturnUrl,
        },
      })
    } catch (error) {
      console.error('Error creating TonConnectUI:', error)
      throw error
    }
  }

  let tonConnectUI

  if (PUBLIC_NODE_ENV !== 'production') {
    if (!window._tonConnectUI) {
      window._tonConnectUI = createTonConnectUI()
    }
    tonConnectUI = window._tonConnectUI
  } else {
    tonConnectUI = createTonConnectUI()
  }

  setContext(TON_KEY, tonConnectUI)

  onMount(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        const address = convertAddress(wallet.account.address)
        if (!address) return
        connectWallet()
        setAddress(address)
      } else {
        disconnectWallet()
        setAddress('')
      }
    })
    return () => unsubscribe()
  })

  return tonConnectUI
}
