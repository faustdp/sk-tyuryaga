<script>
  import data from '@lib/messages.json'

  import { page } from '$app/stores'

  console.log('+error4', $page.error)
</script>

<div class="flex size-full items-center justify-center">
  <h1>{$page.status}: {$page.error?.message || data.error_msg}</h1>
</div>
