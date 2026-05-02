'use client'

import { useEffect } from 'react'

export default function TawkToWidget() {
  useEffect(() => {
    if (document.getElementById('tawk-to-script')) return

    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    const firstScript = document.getElementsByTagName('script')[0]
    script.id = 'tawk-to-script'
    script.async = true
    script.src = 'https://embed.tawk.to/69f51a3182a2b91c3a6303f6/1jnimsl2h'
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    firstScript.parentNode?.insertBefore(script, firstScript)
  }, [])

  return null
}

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>
    Tawk_LoadStart?: Date
  }
}
