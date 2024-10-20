import {
  disableVerticalSwipes,
  expandViewport,
  isSwipeBehaviorSupported,
  isViewportExpanded,
  mountSwipeBehavior,
  on,
  postEvent,
} from '@telegram-apps/sdk'
import { debug } from '@utils'
import { onMount } from 'svelte'

export function fixTouch() {
  mountSwipeBehavior()
  if (!isSwipeBehaviorSupported()) return

  let shouldExpand = false
  let lastTouchEnd = 0

  function updateWindowHeight() {
    document.documentElement.style.setProperty('--screen', `${window.innerHeight}px`)
  }

  function handleViewportChange({ is_state_stable }: { is_state_stable: boolean }) {
    updateWindowHeight()

    if (!isViewportExpanded) expandViewport()

    if (is_state_stable) {
      expandViewport()
      disableVerticalSwipes()
    } else {
      shouldExpand = true
    }
  }

  function findScrollableElement(el: HTMLElement): HTMLElement | null {
    let currentElement: HTMLElement | null = el
    while (currentElement) {
      const overflowY = window.getComputedStyle(currentElement).overflowY
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll'
      if (isScrollable && currentElement.scrollHeight > currentElement.clientHeight) {
        return currentElement
      }
      currentElement = currentElement.parentElement
    }
    return null
  }

  function handleTouchStart(e: TouchEvent) {
    const target = findScrollableElement(e.target as HTMLElement)
    if (!target) return
    ;(target as any).dataset.touchStartY = String(e.touches[0].clientY)
  }

  function preventTouchMove(e: TouchEvent) {
    if (!e.cancelable) return
    const target = findScrollableElement(e.target as HTMLElement)
    if (!target) {
      e.preventDefault()
      return
    }
    const startY = parseFloat((target as any).dataset.touchStartY || '0')
    const currentY = e.touches[0].clientY
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight
    const atTop = scrollTop === 0
    const atBottom = scrollTop + clientHeight >= scrollHeight
    if ((atTop && currentY > startY) || (atBottom && currentY < startY)) {
      e.preventDefault()
    }
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  function handleDoubleTapIOS(e: TouchEvent) {
    const now = new Date().getTime()
    const timeSinceLastTouch = now - lastTouchEnd
    if (timeSinceLastTouch <= 300 && timeSinceLastTouch > 0) {
      e.preventDefault()
    }
    lastTouchEnd = now
  }

  function handleAppMaximize() {
    if (shouldExpand) {
      expandViewport()
      disableVerticalSwipes()
      shouldExpand = false
    }
  }

  onMount(() => {
    expandViewport()
    disableVerticalSwipes()
    postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })
    const removeListener = on('viewport_changed', handleViewportChange)

    const html = document.documentElement
    html.addEventListener('touchstart', handleAppMaximize, { passive: true })

    debug('test')
    if (isIOS || isSafari) {
      html.addEventListener('touchstart', handleTouchStart, { passive: false })
      html.addEventListener('touchmove', preventTouchMove, { passive: false })
      html.addEventListener('touchend', handleDoubleTapIOS, { passive: false })
    }

    return () => {
      removeListener()
      html.removeEventListener('touchstart', handleAppMaximize)
      if (isIOS || isSafari) {
        html.removeEventListener('touchstart', handleTouchStart)
        html.removeEventListener('touchmove', preventTouchMove)
        html.removeEventListener('touchend', handleDoubleTapIOS)
      }
    }
  })
}
