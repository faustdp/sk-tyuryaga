import { Address } from '@ton/core'

export function convertAddress(rawAddress: string): string | null {
  try {
    const address = Address.parse(rawAddress)
    return address.toString({
      urlSafe: true,
      bounceable: true,
    })
  } catch (error) {
    console.error('Error converting address:', error)
    return null
  }
}
