<script>
  import { page } from '$app/stores'

  console.log('+error4', $page.error)
</script>

<div class="flex h-full items-center justify-center">
  <h1>{$page.status}: {$page.error?.message || 'Oopsie, sorry!'}</h1>
</div>
