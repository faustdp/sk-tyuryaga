<script lang="ts">
  import CardLevel from '@icons/cardLevel.svg?component'

  import data from '@/messages.json'

  let { level = 1 }: { level?: number } = $props()
</script>

<div class="flex flex-col items-center justify-between gap-y-2">
  <p class="card-level-clip relative z-20">
    <CardLevel />
    <span class="card-level-shadow absolute -top-0.5 flex size-full items-center justify-center text-sm text-cyellow">
      {data.shop_level}.{level}
    </span>
  </p>
  <img src={`/imgs/1/1.webp`} alt={`${level} image`} width="100" height="100" />
</div>
