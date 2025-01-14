import React from 'react'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomComponent<T = any> = (props: T) => React.ReactNode

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnalyticsLink: CustomComponent = (_props: any) => {
  return (
    <span>
      <Link href="/admin/analytics" style={{ fontSize: '15px' }}>
        Статистика
      </Link>
    </span>
  )
}

export default AnalyticsLink
