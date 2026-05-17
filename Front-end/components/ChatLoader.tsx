'use client'

import dynamic from 'next/dynamic'

const TawkToWidget = dynamic(() => import('./TawkToWidget'), {
  ssr: false,
  loading: () => null,
})

export default function ChatLoader() {
  if (process.env.NEXT_PUBLIC_ENABLE_CHAT !== 'true') return null
  return <TawkToWidget />
}
