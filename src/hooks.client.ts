import Bugsnag from '@bugsnag/js'
import type { HandleClientError } from '@sveltejs/kit'

import { PUBLIC_BUGSNAG_KEY } from '$env/static/public'

if (PUBLIC_BUGSNAG_KEY) {
  Bugsnag.start({ apiKey: PUBLIC_BUGSNAG_KEY })
}

export const handleError: HandleClientError = async ({ event, error, message }) => {
  if (PUBLIC_BUGSNAG_KEY) {
    Bugsnag.notify(error instanceof Error ? error : { name: String(event), message })
  }

  return {
    message,
  }
}
