<script lang="ts">
  // let {data} = $props() $effect(() => {console.log('+page12', data)})
  import Steam from '@images/Steam.svelte'
  import Tv from '@images/Tv.svelte'
  import { user } from '@state/user.svelte'
  import { getImgUrl } from '@utils'
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
  {#each IMG_NAMES as img}
    {@const currImg = user.bonuses.includes(img.idx)}
    {#if currImg || user.level > 0}
      <img
        src={getImgUrl(img.idx, currImg ? user.level : user.level - 1)}
        alt={IMG_NAMES[img.idx].name[currImg ? user.level : user.level - 1]}
        width={IMG_NAMES[img.idx].width}
        class="absolute {IMG_NAMES[img.idx].class}" />
    {/if}
  {/each}
  <Farming />
  <Steam />
</main>

<Wallet />
