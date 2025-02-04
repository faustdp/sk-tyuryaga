<script>
  import data from '@/messages.json'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'

  if (page.status === 404 && page.error?.message === 'Not Found') goto('/')
</script>

<div class="flex size-full items-center justify-center">
  <h1>{page.status}: {page.error?.message || data.errors.error_msg}</h1>
</div>
