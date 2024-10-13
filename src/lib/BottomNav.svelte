<script>
  import NavBtn from '@components/NavBtn.svelte'
  import Brass from '@icons/brass.svg?component'
  import Cell from '@icons/cell.svg?component'
  import Inmates from '@icons/inmates.svg?component'
  import Pack from '@icons/Pack.svelte'
  import Quest from '@icons/quest.svg?component'
</script>

<footer
  class="fixed bottom-[max(0px,_calc((var(--screen)_-_var(--height-limit))_/_2))] z-30 flex
   w-full justify-center maxheight:!left-0 maxheight:!-z-10">
  <nav
    class="bg-nav smallscreen:justify-center flex w-full max-w-limit justify-around bg-slate-300 px-3 pb-9 pt-8"
    data-sveltekit-keepfocus>
    <NavBtn url="/" Icon={Inmates}>Кенты</NavBtn>
    <NavBtn url="/about" Icon={Quest}>Задания</NavBtn>
    <NavBtn url="/" Icon={Cell} isBig>Камера</NavBtn>
    <NavBtn url="/about" Icon={Pack}>Магазин</NavBtn>
    <NavBtn url="/" Icon={Brass} isBlue>Бусты</NavBtn>
  </nav>
</footer>
