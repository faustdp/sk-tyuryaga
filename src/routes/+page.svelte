<script lang="ts">
  // let {data} = $props() $effect(() => {console.log('+page12', data)})
  import Steam from '@images/Steam.svelte'
  import Tv from '@images/Tv.svelte'
  import { user } from '@state/user.svelte'
  import { cn, getImgUrl } from '@utils'
  import { imgs } from '@utils/const'

  import Farming from '@/Farming.svelte'
  import Header from '@/Header.svelte'
  import data from '@/messages.json'
  import Stats from '@/Stats.svelte'
  import Wallet from '@/Wallet.svelte'
</script>

<svelte:head>
  <title>{data.home_title}</title>
  <meta name="description" content={data.home_content} />
</svelte:head>

<main
  class="perspective mx-auto h-full max-w-limit flex-col items-center justify-center
       overflow-hidden bg-[url('@images/bg.webp')] bg-half bg-center bg-no-repeat">
  <Header />
  <Stats />
  <Tv />
  <img
    src={getImgUrl(0, user.level + 3)}
    alt={imgs[0].name[user.level]}
    width="90"
    class="absolute left-[calc(50%_-_185px)] top-[calc(50%_+_5px)]" />
  <img
    src={getImgUrl(1, user.level)}
    alt={imgs[1].name[user.level]}
    width="85"
    class="absolute left-[calc(50%_-_180px)] top-[calc(50%_+_88px)]" />
  <img
    src={getImgUrl(2, user.level)}
    alt={imgs[2].name[user.level]}
    width="80"
    class="trans-z-40 absolute left-[calc(50%_+_109px)] top-[calc(50%_+_96px)]" />
  <img
    src={getImgUrl(3, user.level)}
    alt={imgs[3].name[user.level]}
    width="130"
    class="absolute left-[calc(50%_+_79px)] top-[calc(50%_-_39px)]" />
  <img
    src={getImgUrl(4, user.level)}
    alt={imgs[4].name[user.level]}
    width="100"
    class={cn(
      'absolute left-[calc(50%_+_71px)]',
      user.level === 1 ? 'top-[calc(50%_-_160px)]' : 'top-[calc(50%_-_180px)]',
    )} />
  <img src={getImgUrl(5, user.level)} alt={imgs[5].name[user.level]} width="100" class="right-wall-img absolute" />
  <img src={getImgUrl(6, user.level)} alt={imgs[6].name[user.level]} width="80" class="left-wallet-img absolute" />
  <img
    src={getImgUrl(7, user.level)}
    alt={imgs[7].name[user.level]}
    width="60"
    class="absolute left-[calc(50%_-_164px)] top-[calc(50%_-_142px)]" />
  <img
    src={getImgUrl(8, user.level)}
    alt={imgs[8].name[user.level]}
    width="60"
    class="trans-z-40 absolute left-[calc(50%_-_170px)] top-[calc(50%_-_57px)]" />

  <Farming />
  <Steam />
</main>

<Wallet />
