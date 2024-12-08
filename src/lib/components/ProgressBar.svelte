<script lang="ts">
  let { progress }: { progress: number } = $props()
</script>

<div class="my-auto h-6 w-72 overflow-hidden rounded-full bg-[#343A32] p-1" style="--progress: {progress}%">
  <div class="h-full rounded-full bg-[#ffb901]" style:width="var(--progress)"></div>
</div>
