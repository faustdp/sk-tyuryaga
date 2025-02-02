import CheckError from '@icons/checkError.svg?component'
import { connectWallet, disconnectWallet } from '@state/app.svelte'
import { setAddress, user } from '@state/user.svelte'
// import {  toNano } from "@ton/ton";
import { THEME, TonConnectUI } from '@tonconnect/ui'
import { postSetAddress } from '@utils/api'
import { TON_KEY } from '@utils/const'
import { convertAddress } from '@utils/ton'
import { onMount, setContext } from 'svelte'
import toast from 'svelte-hot-french-toast'

import data from '@/messages.json'
import { PUBLIC_BOT_NAME, PUBLIC_NODE_ENV, PUBLIC_TEST_URL } from '$env/static/public'

export function useTonConnect(disconnect = false) {
  const manifestUrl = `${PUBLIC_TEST_URL}/tonconnect-manifest.json`
  const twaReturnUrl = `https://t.me/${PUBLIC_BOT_NAME}` as `${string}://${string}`

  const createTonConnectUI = () => {
    try {
      return new TonConnectUI({
        manifestUrl,
        uiPreferences: {
          theme: THEME.DARK,
        },
        language: user.language === 'en' ? 'en' : 'ru',
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
      }
    }
    removeWallet()
  }

  setContext(TON_KEY, tonConnectUI)

  onMount(() => {
    const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
      if (wallet) {
        const address = convertAddress(wallet.account.address)
        if (!address || !user.id) return
        const res = await postSetAddress(address)
        if (res && res.success) {
          connectWallet()
          setAddress(address)
        } else {
          toast.error(data.errors.wallet_error, { class: 'toast-error', icon: CheckError })
          await tonConnectUI.disconnect()
        }
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
      }
    })
    return () => unsubscribe()
  })

  return tonConnectUI
}
