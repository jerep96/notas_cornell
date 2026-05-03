'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Materia } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import CornellView from '@/components/CornellView'
import IngestPanel from '@/components/IngestPanel'
import Link from 'next/link'

interface NotaPageProps {
  params: { id: string }
}

function findNotaById(materias: Materia[], id: string) {
  for (const mat of materias) {
    for (const mod of mat.modulos) {
      for (const tem of mod.tematicas) {
        const nota = tem.notas.find((n) => n.id === id)
        if (nota) return { nota, materia: mat, modulo: mod, tematica: tem }
      }
    }
  }
  return null
}

export default function NotaPage({ params }: NotaPageProps) {
  const { id } = params
  const { materias } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ingestOpen, setIngestOpen] = useState(false)

  const result = findNotaById(materias, id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar
        onMenuClick={() => setSidebarOpen((v) => !v)}
        onIngestClick={() => setIngestOpen(true)}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onIngestClick={() => setIngestOpen(true)}
        />

        <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          {!result ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-4)' }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                Nota no encontrada
              </p>
              <Link href="/notas" style={{ color: 'var(--red)', fontSize: '0.875rem' }}>
                ← Volver al cuaderno
              </Link>
            </div>
          ) : (
            <>
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
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>{result.nota.titulo}</span>
              </div>
              <CornellView
                nota={result.nota}
                materiaColor={result.materia.color}
                materiaName={result.materia.nombre}
                moduloName={result.modulo.nombre}
                tematicaName={result.tematica.nombre}
              />
            </>
          )}
        </main>
      </div>

      {ingestOpen && <IngestPanel onClose={() => setIngestOpen(false)} />}
    </div>
  )
}
