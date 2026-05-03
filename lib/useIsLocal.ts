'use client'

import { useEffect, useState } from 'react'

export function useIsLocal(): boolean {
  const [isLocal, setIsLocal] = useState(false)
  useEffect(() => {
    setIsLocal(
      process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost'
    )
  }, [])
  return isLocal
}
