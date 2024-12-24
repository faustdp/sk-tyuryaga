<script lang="ts">
  import ItemsCard from '@components/ItemsCard.svelte'
  import ModalItems from '@components/ModalItems.svelte'
  import { IMG_NAMES } from '@utils/const'

  import data from '@/messages.json'

  let selectedIdx = $state<null | number>(null)

  function selectItem(index: number | null) {
    selectedIdx = index
  }
</script>

<svelte:head>
  <title>{data.items_title}</title>
  <meta name="description" content={data.items_content} />
</svelte:head>

<div class="mx-auto flex max-w-limit flex-col items-center justify-center px-4 pb-2 pt-4">
  <h1 class="shadow-heading mb-2.5 text-xl">{data.items_title}</h1>
  <p class="roboto mb-4 max-w-sm text-center text-xs tracking-wide text-textgrey">
    {data.items_desc}
  </p>
  <div class="grid w-full max-w-96 grid-cols-2 gap-x-3 gap-y-4">
    {#each IMG_NAMES as img}
      <ItemsCard idx={img.idx} onclick={selectItem} />
    {/each}
  </div>
</div>

<ModalItems {selectedIdx} selectImage={selectItem} />
