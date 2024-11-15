<script lang="ts">
  import { cn } from '@utils'
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title bind:ref class={cn('text-lg leading-none tracking-wide', className)} {...restProps} />
