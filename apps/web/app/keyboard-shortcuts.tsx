'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Keyboard Shortcuts Handler
 *
 * Handles global keyboard shortcuts:
 * - "/" — Navigate to search page or focus search input if already there
 */
export function KeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if "/" was pressed
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger if user is typing in an input
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return
        }

        e.preventDefault()

        if (pathname === '/search') {
          // Already on search page, focus the input
          const searchInput = document.querySelector(
            'input[placeholder*="search"]'
          ) as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        } else {
          // Navigate to search page
          router.push('/search')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pathname, router])

  return null
}
