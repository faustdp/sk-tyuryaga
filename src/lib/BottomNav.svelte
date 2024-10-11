<script>
  //  import { page } from '$app/stores'
  //   <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
  //     <li aria-current={$page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>

  //  li[aria-current='page']::before {
  //   --size: 6px;
  //   content: '';
  //   width: 0;
  //   height: 0;
  //   position: absolute;
  //   top: 0;
  //   left: calc(50% - var(--size));
  //   border: var(--size) solid transparent;
  //   @apply border-t-red-500;
  // }

  // nav a {
  //   display: flex;
  //   height: 100%;
  //   align-items: center;
  //   padding: 0 0.5rem;
  //   color: var(--color-text);
  //   font-weight: 700;
  //   font-size: 0.8rem;
  //   text-transform: uppercase;
  //   letter-spacing: 0.1em;
  //   text-decoration: none;
  //   transition: color 0.2s linear;
  // }
  import NavBtn from '@components/NavBtn.svelte'
  import Inmate from '@icons/inmates.svg?component'
</script>

<footer
  class="maxheight:!-z-10 maxheight:!left-0 fixed bottom-[max(0px,_calc((var(--screen)_-_1000px)_/_2))] z-30 flex w-full justify-center">
  <nav class="bg-nav flex w-full max-w-limit justify-around bg-slate-300 px-3 py-5 pb-8">
    <NavBtn url="/" Icon={Inmate}>Кенты</NavBtn>
    <NavBtn url="/about" Icon={Inmate}>Задания</NavBtn>
  </nav>
</footer>
