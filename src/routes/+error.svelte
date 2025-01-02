<script>
  import data from '@/messages.json'
  import { page } from '$app/state'

  console.log('+error4', page.error)
</script>

<div class="flex size-full items-center justify-center">
  <h1>{page.status}: {page.error?.message || data.errors.error_msg}</h1>
</div>
