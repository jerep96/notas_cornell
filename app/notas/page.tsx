'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Materia, Nota } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import NoteCard from '@/components/NoteCard'
import IngestPanel from '@/components/IngestPanel'

function findNotaMeta(materias: Materia[], notaId: string) {
  for (const mat of materias) {
    for (const mod of mat.modulos) {
      for (const tem of mod.tematicas) {
        if (tem.notas.find((n) => n.id === notaId)) {
          return { materia: mat, modulo: mod, tematica: tem }
        }
      }
    }
  }
  return null
}

export default function NotasPage() {
  const { materias, searchQuery, getContextNotas } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ingestOpen, setIngestOpen] = useState(false)

  const contextNotas: Nota[] = getContextNotas()

  const filtered = searchQuery.trim()
    ? contextNotas.filter((n) => {
        const q = searchQuery.toLowerCase()
        return (
          n.titulo.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.notas.some((item) => item.text.toLowerCase().includes(q)) ||
          n.preguntas.some((p) => p.toLowerCase().includes(q)) ||
          n.resumen.toLowerCase().includes(q)
        )
      })
    : contextNotas

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

        <main style={{ flex: 1, padding: '1.5rem', minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--ink-4)' }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {searchQuery ? 'No se encontraron notas' : 'No hay notas todavía'}
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                {searchQuery ? 'Intentá con otro término' : 'Ingresá un PDF para empezar'}
              </p>
              {!searchQuery && (
                <button
                  className="btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setIngestOpen(true)}
                >
                  + Ingresar PDF
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)', fontWeight: 400 }}>
                  {filtered.length} nota{filtered.length !== 1 ? 's' : ''}
                  {searchQuery && ` para "${searchQuery}"`}
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {filtered.map((nota) => {
                  const meta = findNotaMeta(materias, nota.id)
                  return (
                    <NoteCard
                      key={nota.id}
                      nota={nota}
                      materiaColor={meta?.materia.color}
                      materiaName={meta?.materia.nombre}
                    />
                  )
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {ingestOpen && <IngestPanel onClose={() => setIngestOpen(false)} />}
    </div>
  )
}
