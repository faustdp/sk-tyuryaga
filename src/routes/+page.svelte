<script lang="ts">
  // let {data} = $props() $effect(() => {console.log('+page12', data)})
  import Steam from '@images/Steam.svelte'
  import Tv from '@images/Tv.svelte'
  import { user } from '@state/user.svelte'
  import { cn, getImgUrl } from '@utils'
  import { IMG_NAMES } from '@utils/const'

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
    src={getImgUrl(0, user.level)}
    alt={IMG_NAMES[0].name[user.level]}
    width="90"
    class="absolute left-[calc(50%_-_185px)] top-[calc(50%_+_5px)]" />
  <img
    src={getImgUrl(1, user.level)}
    alt={IMG_NAMES[1].name[user.level]}
    width="85"
    class="absolute left-[calc(50%_-_180px)] top-[calc(50%_+_88px)]" />
  <img
    src={getImgUrl(2, user.level)}
    alt={IMG_NAMES[2].name[user.level]}
    width="80"
    class="trans-z-40 absolute left-[calc(50%_+_109px)] top-[calc(50%_+_96px)]" />
  <img
    src={getImgUrl(3, user.level)}
    alt={IMG_NAMES[3].name[user.level]}
    width="110"
    class="absolute left-[calc(50%_+_95px)] top-[calc(50%_-_29px)]" />
  <img
    src={getImgUrl(4, user.level)}
    alt={IMG_NAMES[4].name[user.level]}
    width="100"
    class={cn(
      'absolute left-[calc(50%_+_76px)]',
      user.level === 1 ? 'top-[calc(50%_-_160px)]' : 'top-[calc(50%_-_192px)]',
    )} />
  <img src={getImgUrl(5, user.level)} alt={IMG_NAMES[5].name[user.level]} width="100" class="right-wall-img absolute" />
  <img src={getImgUrl(6, user.level)} alt={IMG_NAMES[6].name[user.level]} width="90" class="left-wall-img absolute" />
  <img
    src={getImgUrl(7, user.level)}
    alt={IMG_NAMES[7].name[user.level]}
    width="60"
    class="absolute left-[calc(50%_-_164px)] top-[calc(50%_-_142px)]" />
  <img
    src={getImgUrl(8, user.level)}
    alt={IMG_NAMES[8].name[user.level]}
    width="60"
    class="trans-z-40 absolute left-[calc(50%_-_170px)] top-[calc(50%_-_57px)]" />

  <Farming />
  <Steam />
</main>

<Wallet />
