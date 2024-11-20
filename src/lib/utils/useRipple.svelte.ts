function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (!Number.isFinite(val)) return 0
  if (val <= inMin || val >= inMax) return val <= inMin ? outMin : outMax
  const percent = (val - inMin) / (inMax - inMin)
  const result = (outMax - outMin) * percent + outMin
  return Number.isFinite(result) ? result : 0
}

/** @type {import('svelte/action').Action} */
export default function useRipple(node: HTMLElement, data?: { color: string }) {
  const color = data?.color || 'currentColor'

  function handleClick(e: PointerEvent | MouseEvent) {
    if ((e.clientX !== 0 && e.clientY !== 0) || (<PointerEvent>e).pointerType !== '') (<HTMLElement>e.target).blur()
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!e.repeat && (e.code === 'Enter' || e.code === 'Space')) createRipple(e, true)
  }

  function createRipple(e: PointerEvent | KeyboardEvent, isKeyboard = false) {
    if (
      ((<PointerEvent>e).pointerType === 'mouse' && (<PointerEvent>e).button !== 0) ||
      (((<PointerEvent>e).pointerType === 'touch' || (<PointerEvent>e).pointerType === 'pen') &&
        !(<PointerEvent>e).isPrimary)
    )
      return
    const el = <HTMLElement>e.target
    const rect = el.getBoundingClientRect()
    const elW = rect.width
    const elH = rect.height
    const centerX = elW / 2
    const centerY = elH / 2
    const clickX = isKeyboard ? centerX : (<PointerEvent>e).clientX - rect.left
    const clickY = isKeyboard ? centerY : (<PointerEvent>e).clientY - rect.top
    const cornerX = isKeyboard || clickX >= centerX ? 0 : elW
    const cornerY = isKeyboard || clickY >= centerY ? 0 : elH
    const radius = Math.sqrt((cornerX - clickX) ** 2 + (cornerY - clickY) ** 2)
    const borderDiff = mapRange(parseFloat(getComputedStyle(el).borderRadius), 0, 20, 0, 10)
    const rip = document.createElement('span')
    rip.style.cssText = `width: ${radius * 2 - borderDiff}px; height: ${radius * 2 - borderDiff}px; left: ${
      clickX - radius + borderDiff / 2
    }px; top: ${
      clickY - radius + borderDiff / 2
    }px; position: absolute; border-radius: 50%; pointer-events: none; background-color: ${color};opacity: 0; transform: scale(0);`
    el.prepend(rip)
    rip.animate(
      {
        opacity: ['0.03', '0.25'],
        transform: ['scale(0)', 'scale(1)'],
      },
      { duration: 280, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' },
    )
    function removeRipple(evt: PointerEvent | KeyboardEvent | FocusEvent) {
      if (
        (evt.type === 'pointerup' &&
          (((<PointerEvent>evt).pointerType === 'mouse' && (<PointerEvent>evt).button !== 0) ||
            ((<PointerEvent>evt).pointerType === 'touch' && !(<PointerEvent>evt).isPrimary))) ||
        (evt.type === 'keyup' && (<KeyboardEvent>evt).code !== (<KeyboardEvent>e).code)
      )
        return

      const anim = rip.animate(
        {
          opacity: [getComputedStyle(rip).opacity, '0'],
        },
        {
          duration: 200,
          easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
          fill: 'forwards',
        },
      )
      anim.onfinish = () => {
        el.removeChild(rip)
      }

      if (isKeyboard) {
        el.removeEventListener('keyup', removeRipple)
        el.removeEventListener('blur', removeRipple)
      } else {
        el.removeEventListener('pointerout', removeRipple)
        document.documentElement.removeEventListener('pointerup', removeRipple)
      }
    }

    if (isKeyboard) {
      el.addEventListener('keyup', removeRipple)
      el.addEventListener('blur', removeRipple)
    } else {
      el.addEventListener('pointerout', removeRipple)
      document.documentElement.addEventListener('pointerup', removeRipple)
    }
  }

  function handleDragStart(e: DragEvent) {
    e.preventDefault()
    return false
  }

  function handleContextMenu(e: MouseEvent | PointerEvent) {
    if ((<PointerEvent>e).pointerType === 'touch' || (<PointerEvent>e).pointerType === 'pen') e.preventDefault()
  }

  function addEvents() {
    node.addEventListener('keydown', handleKeyDown)
    node.addEventListener('pointerdown', createRipple)
    node.addEventListener('click', handleClick)
    node.addEventListener('dragstart', handleDragStart)
    node.addEventListener('contextmenu', handleContextMenu)
  }

  function removeEvents() {
    node.removeEventListener('keydown', handleKeyDown)
    node.removeEventListener('pointerdown', createRipple)
    node.removeEventListener('click', handleClick)
    node.removeEventListener('dragstart', handleDragStart)
    node.removeEventListener('contextmenu', handleContextMenu)
  }

  $effect(() => {
    removeEvents()
    addEvents()
    return () => {
      removeEvents()
    }
  })
}
