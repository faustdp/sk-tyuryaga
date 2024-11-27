import { setError, setIsLoaded } from '@state/app.svelte'
import { setUser } from '@state/user.svelte'
import { closeMiniApp, isTMA, parseInitData, retrieveLaunchParams } from '@telegram-apps/sdk'
import { meUrl } from '@utils/const'

import data from '@/messages.json'

interface ValidationResponse {
  valid: boolean
  userData?: any
  error?: string
}

export async function initTgApp() {
  const isTG = await isTMA()
  if (!isTG) {
    // return setError('tg_app')
    const initData =
      'user=%7B%22id%22%3A883729040%2C%22first_name%22%3A%22Denis%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22paskodenis%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8084724315231179358&chat_type=private&auth_date=1728214924&hash=34ed36bf7e67585d9d78c6d07bae62c8d59902d22cd24cb119c180cda909ff5d'

    const user = parseInitData(initData).user
    if (!user) return
    const { id: tg_id, username, firstName: first_name } = user
    setUser({
      tg_id,
      first_name,
      username,
      direct_invites: 0,
      indirect_invites: 0,
    })
    return setIsLoaded()
  }
  try {
    const params = retrieveLaunchParams()

    const response = await fetch(meUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: params.initDataRaw }),
    })

    const result: ValidationResponse = await response.json()

    if (!result.valid) {
      const error = result.error
      throw new Error(error === undefined ? 'Invalid data' : error in data ? data[error as keyof typeof data] : error)
    }

    const { tg_id, first_name, username, direct_invites, indirect_invites } = result.userData

    setUser({
      tg_id,
      first_name,
      username,
      direct_invites,
      indirect_invites,
    })
  } catch (err) {
    if (err instanceof Error) {
      const error = err as TypedError
      if (error.type === 'ERR_RETRIEVE_LP_FAILED' || err.message === 'Data is outdated') {
        closeMiniApp()
      }
      setError(err.message)
    } else if (typeof err === 'string') {
      setError(err)
    } else {
      setError('Unexpected Error')
    }
  } finally {
    setIsLoaded()
  }
}
