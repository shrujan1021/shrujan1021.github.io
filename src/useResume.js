import { useEffect, useState } from 'react'
import { profile } from './data.js'

/**
 * Résumé availability is checked once per load with a HEAD request.
 *
 * If public/resume.pdf is missing the button is not rendered at all, rather
 * than showing an action that goes nowhere.
 */
export default function useResume() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(profile.resumeUrl, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || ''
        if (!cancelled && res.ok && type.includes('pdf')) setAvailable(true)
      })
      .catch(() => {
        /* file not configured — stay hidden */
      })

    return () => {
      cancelled = true
    }
  }, [])

  return available
}
