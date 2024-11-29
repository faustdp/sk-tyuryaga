<script lang="ts">
  import { user } from '@state/user.svelte'
  import { CLAIMED, FARMED, FARMING } from '@utils/const'
  import { onMount } from 'svelte'

  import { keyframes } from './steamKeyframes'

  const animations: Animation[] = []

  const applyAnimations = () => {
    const childs = document.getElementById('steam')?.children
    if (!childs || childs.length <= 0) return
    keyframes.forEach((frame, index) => {
      const element = childs[index] as SVGPathElement
      if (element) {
        const animation = element.animate(frame, {
          duration: 4000,
          fill: 'forwards',
          composite: 'replace',
          iterations: Infinity,
        })
        animation.playbackRate = 0
        animations.push(animation)
      }
    })
  }

  onMount(() => {
    applyAnimations()
  })

  function changeAnimSpeed(faster = false) {
    const speedInterval = setInterval(() => {
      if (faster) {
        animations.forEach((anim) => {
          if (anim.playbackRate < 1) {
            anim.playbackRate += 0.1
          } else {
            anim.playbackRate = 1
            clearInterval(speedInterval)
          }
          if (anim.playState !== 'running') {
            anim.play()
          }
        })
      } else {
        animations.forEach((anim) => {
          if (anim.playbackRate > 0.1) {
            anim.playbackRate *= 0.9
          } else {
            anim.playbackRate = 0
            anim.pause()
            clearInterval(speedInterval)
          }
        })
      }
    }, 85)
    return speedInterval
  }

  $effect(() => {
    const farm = user.farm
    if (farm === CLAIMED || animations.length === 0) return
    let interval: NodeJS.Timeout
    if (farm === FARMING) {
      interval = changeAnimSpeed(true)
    } else {
      interval = changeAnimSpeed(false)
    }
    return () => {
      if (farm !== FARMED) clearInterval(interval)
    }
  })
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1000 1000"
  class="fixed left-[calc(50%_+_50px)] top-[calc(50%_-_86px)]"
  id="steam"
  style="width:120px;height:120px;transform:translate3d(0,0,0);">
  <path
    transform="translate(386.122 226.442)scale(.06853)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(369.305 266.685)scale(.09025)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(530.096 363.525)scale(.1125)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(513.526 443.044)scale(.13418)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(391.483 441.982)scale(.15334)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(392 448)scale(.164)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(368.854 509.445)scale(.15334)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(383.851 546.235)scale(.13418)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(422.902 625.82)scale(.1125)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(520.566 663.162)scale(.09025)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(507.755 704.645)scale(.06853)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(501.371 754.468)scale(.04817)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(454.791 796.889)scale(.02998)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(477.654 830.775)scale(.0149)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(499.963 849.724)scale(.00423)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    fill="rgb(240,240,240)"
    transform="matrix(0 0 0 0 498 858)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    fill="rgb(240,240,240)"
    transform="translate(616.656 211.785)scale(.00423)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(512.761 215.964)scale(.0149)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(471.963 256.515)scale(.02998)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(495.622 282.01)scale(.04817)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(386.122 226.442)scale(.06853)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(369.305 266.685)scale(.09025)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(530.096 363.525)scale(.1125)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(513.526 443.044)scale(.13418)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(391.483 441.982)scale(.15334)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(392 448)scale(.164)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(368.854 509.445)scale(.15334)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(383.851 546.235)scale(.13418)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(422.902 625.82)scale(.1125)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(520.566 663.162)scale(.09025)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(507.755 704.645)scale(.06853)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(501.371 754.468)scale(.04817)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(454.791 796.889)scale(.02998)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(477.654 830.775)scale(.0149)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
  <path
    transform="translate(499.963 849.724)scale(.00423)"
    fill="rgb(240,240,240)"
    d="M500 0c275.947 0 500 224.053 500 500s-224.053 500-500 500S0 775.947 0 500 224.053 0 500 0" />
</svg>
