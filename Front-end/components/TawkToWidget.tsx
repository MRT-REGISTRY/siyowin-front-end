'use client'

import { useEffect } from 'react'

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }

export default function TawkToWidget() {
  useEffect(() => {
    if (document.getElementById('tawk-to-script')) return

    const idleWindow = window as IdleWindow
    let idleId: number | null = null
    let timeoutId: number | null = null

    const loadWidget = () => {
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
    }

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(loadWidget, { timeout: 4000 })
    } else {
      timeoutId = window.setTimeout(loadWidget, 2500)
    }

    return () => {
      if (idleId !== null) {
        idleWindow.cancelIdleCallback?.(idleId)
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  return null
}

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>
    Tawk_LoadStart?: Date
  }
}
