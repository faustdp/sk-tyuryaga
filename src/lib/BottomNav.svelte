<script>
  import NavBtn from '@components/NavBtn.svelte'
  import Brass from '@icons/brass.svg?component'
  import Cell from '@icons/cell.svg?component'
  import Inmates from '@icons/inmates.svg?component'
  import Pack from '@icons/Pack.svelte'
  import Quest from '@icons/quest.svg?component'

  import data from '@/messages.json'
</script>

<footer
  class="bg-nav fixed bottom-0 z-30 flex w-full
   justify-center shadow-menu maxheight:!left-0 maxheight:!-z-10">
  <nav
    class="flex w-full max-w-limit justify-around gap-x-1.5 px-3 pb-5 pt-8 maxheightSm:pb-1 maxheightSm:pt-5 smallscreen:justify-center"
    data-sveltekit-keepfocus>
    <NavBtn url="/friends" Icon={Inmates}>{data.nav_frens}</NavBtn>
    <NavBtn url="/tasks" Icon={Quest}>{data.nav_tasks}</NavBtn>
    <NavBtn url="/" Icon={Cell} isBig>{data.nav_cell}</NavBtn>
    <NavBtn url="/shop" Icon={Pack}>{data.nav_shop}</NavBtn>
    <NavBtn url="/items" Icon={Brass} isBlue>{data.nav_inventory}</NavBtn>
  </nav>
</footer>
