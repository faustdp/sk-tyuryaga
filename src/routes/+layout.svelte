<script lang="ts">
  import '../app.css'
  import '@fontsource/russo-one/400.css'
  import '@fontsource/arbutus/400.css'

  // import { initData, restoreInitData , retrieveLaunchParams } from '@telegram-apps/sdk'
  import BottomNav from '@lib/BottomNav.svelte'
  import Header from '@lib/Header.svelte'
  import { setIsMounted } from '@state/app.svelte'
  import { init, miniAppReady, mountMiniApp } from '@telegram-apps/sdk'
  import { fixTouch } from '@utils/fixTouch'
  import { onMount } from 'svelte'

  console.clear()

  onMount(() => {
    setIsMounted()
    try {
      init()
      mountMiniApp()
      miniAppReady()
      fixTouch()
    } catch (_err) {}
  })

  // restoreInitData()
  // console.log('+layout7', initData.user())
  // const params = retrieveLaunchParams()
  // console.log('+layout11', params?.initData?.user)

  // const initData = parseInitData(
  //   'user=%7B%22id%22%3A883729040%2C%22first_name%22%3A%22Denis%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22paskodenis%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8084724315231179358&chat_type=private&auth_date=1728214924&hash=34ed36bf7e67585d9d78c6d07bae62c8d59902d22cd24cb119c180cda909ff5d',
  // )

  let { children } = $props()
</script>

<div class="relative size-full overflow-y-auto overflow-x-hidden bg-slate-900">
  <Header />
  {@render children()}
  <BottomNav />
</div>
