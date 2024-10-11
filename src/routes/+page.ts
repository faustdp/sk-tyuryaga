// import { error } from '@sveltejs/kit'
// import { retrieveLaunchParams } from '@telegram-apps/sdk' //mockTelegramEnv

// import { browser } from '$app/environment'

// import type { PageLoad } from './$types'

// export const load: PageLoad = async () => {
// if (browser) {
//   try {
//     const params = retrieveLaunchParams()
//     console.log('+page14', params.initData?.user)
//   } catch (_err) {
//     console.log('+page18', _err)
//     if ((_err as Error).message.includes('outside Telegram')) {
//       error(401, 'App requires Telegram to work')
//     }
//   }
// }
// return { fetched: true }
// }
