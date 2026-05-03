'use client'

import { useState } from 'react'
import { NotaArchivo } from '@/lib/types'
import Topbar from '@/components/Topbar'
import CornellView from '@/components/CornellView'
import IngestPanel from '@/components/IngestPanel'
import Link from 'next/link'

interface NotaPageClientProps {
  nota: NotaArchivo
}

export default function NotaPageClient({ nota }: NotaPageClientProps) {
  const [ingestOpen, setIngestOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar onIngestClick={() => setIngestOpen(true)} />

      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        <div style={{ padding: '0.75rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/notas"
            style={{
              fontSize: '0.8rem',
              color: 'var(--ink-3)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cuaderno
          </Link>
          <span style={{ color: 'var(--ink-4)', fontSize: '0.8rem' }}>›</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>{nota.titulo}</span>
        </div>
        <CornellView nota={nota} />
      </main>

      {ingestOpen && <IngestPanel onClose={() => setIngestOpen(false)} />}
    </div>
  )
}
