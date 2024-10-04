<script>
  import Header from './Header.svelte'
  import '../app.css'
  // import bg from '$lib/images/bg.webp'

  const { children } = $props()
</script>

<div class="relative h-full w-full overflow-y-auto overflow-x-hidden bg-slate-900">
  <Header></Header>
  <main
    class="perspective relative mx-auto flex size-full max-w-[556px] flex-col items-center justify-center
      overflow-hidden bg-[url('$lib/images/bg.webp')] bg-auto bg-fixed bg-center bg-no-repeat">
    {@render children()}
  </main>
</div>
