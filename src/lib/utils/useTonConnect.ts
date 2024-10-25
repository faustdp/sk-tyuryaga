import { connectWallet, disconnectWallet } from '@state/app.svelte'
import { setAddress } from '@state/user.svelte'
// import { getHttpEndpoint } from "@orbs-network/ton-access";
// import { TonClient } from "@ton/ton";
// import { toNano } from '@ton/ton'
import { THEME, TonConnectUI } from '@tonconnect/ui'
// import { logServer } from '@utils'
import { TON_KEY } from '@utils/const'
import { convertAddress } from '@utils/ton'
import { onMount, setContext } from 'svelte'

import { PUBLIC_BOT_NAME, PUBLIC_NODE_ENV, PUBLIC_SITE_URL } from '$env/static/public'

export function useTonConnect(disconnect = false) {
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

  let tonConnectUI: TonUI

  if (PUBLIC_NODE_ENV !== 'production') {
    if (!window._tonConnectUI) {
      window._tonConnectUI = createTonConnectUI()
    }
    tonConnectUI = window._tonConnectUI
  } else {
    tonConnectUI = createTonConnectUI()
  }

  if (disconnect) {
    async function removeWallet() {
      if (tonConnectUI.connected) {
        await tonConnectUI.disconnect()
        disconnectWallet()
        setAddress('')
      }
    }
    removeWallet()
  }

  setContext(TON_KEY, tonConnectUI)

  onMount(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        const address = convertAddress(wallet.account.address)
        if (!address) return
        connectWallet()
        setAddress(address)
        // const transaction = {
        //   validUntil: Math.floor(Date.now() / 1000) + 360,
        //   messages: [
        //     {
        //       address: TEST_ADDRESS,
        //       amount: toNano('0.02').toString(),
        //     },
        //   ],
        // }
        // await tonConnectUI.sendTransaction(transaction)
      } else {
        disconnectWallet()
        setAddress('')
      }
    })
    return () => unsubscribe()
  })

  return tonConnectUI
}
