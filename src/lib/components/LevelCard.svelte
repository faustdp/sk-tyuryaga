<script lang="ts">
  import CardLevel from '@icons/cardLevel.svg?component'
  import { getImgUrl } from '@utils'

  import data from '@/messages.json'

  let { level, index }: { level: number; index: number } = $props()
</script>

<div class="flex flex-col items-center justify-between gap-y-2">
  <p class="card-level-clip relative z-20">
    <CardLevel />
    <span class="card-level-shadow absolute -top-0.5 flex size-full items-center justify-center text-sm text-cyellow">
      {data.shop_level}.{level + 1}
    </span>
  </p>
  <img src={getImgUrl(index, level)} alt={`${level} image`} class="h-[100px] object-contain" width="100" height="100" />
</div>
