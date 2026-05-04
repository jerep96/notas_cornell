'use client'

import { useState, useMemo } from 'react'
import { NotaArchivo, MateriaNode } from '@/lib/types'
import { getMateriaColor } from '@/lib/utils'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import NoteCard from '@/components/NoteCard'
import IngestPanel from '@/components/IngestPanel'
import { useIsLocal } from '@/lib/useIsLocal'

function buildTree(notas: NotaArchivo[]): MateriaNode[] {
  const materiaMap = new Map<string, Map<string, Map<string, NotaArchivo[]>>>()
  for (const nota of notas) {
    const mat = nota.materiaDetectada || 'General'
    const mod = nota.moduloDetectado || 'Módulo 1'
    const tem = nota.tematicaDetectada || 'General'
    if (!materiaMap.has(mat)) materiaMap.set(mat, new Map())
    const modMap = materiaMap.get(mat)!
    if (!modMap.has(mod)) modMap.set(mod, new Map())
    const temMap = modMap.get(mod)!
    if (!temMap.has(tem)) temMap.set(tem, [])
    temMap.get(tem)!.push(nota)
  }
  const sortNum = (s: string) => parseInt(s.replace(/[^\d]/g, ''), 10) || 0
  return Array.from(materiaMap.entries()).map(([nombre, modMap]) => ({
    nombre,
    color: getMateriaColor(nombre),
    modulos: Array.from(modMap.entries())
      .sort(([a], [b]) => sortNum(a) - sortNum(b))
      .map(([modNombre, temMap]) => ({
        nombre: modNombre,
        tematicas: Array.from(temMap.entries())
          .sort(([a], [b]) => a.localeCompare(b, 'es'))
          .map(([temNombre, notasArr]) => ({ nombre: temNombre, notas: notasArr })),
      })),
  }))
}

interface NotasClientProps {
  notas: NotaArchivo[]
}

export default function NotasClient({ notas }: NotasClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ingestOpen, setIngestOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null)
  const [selectedModulo, setSelectedModulo] = useState<string | null>(null)
  const [selectedTematica, setSelectedTematica] = useState<string | null>(null)
  const isLocal = useIsLocal()

  const materias = useMemo(() => buildTree(notas), [notas])

  const filtered = useMemo(() => {
    const mat = (n: NotaArchivo) => n.materiaDetectada || 'General'
    const mod = (n: NotaArchivo) => n.moduloDetectado || 'Módulo 1'
    const tem = (n: NotaArchivo) => n.tematicaDetectada || 'General'

    let result = notas
    if (selectedTematica && selectedModulo && selectedMateria) {
      result = result.filter(
        (n) =>
          mat(n) === selectedMateria &&
          mod(n) === selectedModulo &&
          tem(n) === selectedTematica,
      )
    } else if (selectedModulo && selectedMateria) {
      result = result.filter(
        (n) => mat(n) === selectedMateria && mod(n) === selectedModulo,
      )
    } else if (selectedMateria) {
      result = result.filter((n) => mat(n) === selectedMateria)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (n) =>
          n.titulo.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.notas.some((item) => item.text.toLowerCase().includes(q)) ||
          n.preguntas.some((p) => p.toLowerCase().includes(q)) ||
          n.resumen.toLowerCase().includes(q),
      )
    }
    return result
  }, [notas, selectedMateria, selectedModulo, selectedTematica, searchQuery])

  function handleSelectMateria(nombre: string | null) {
    setSelectedMateria(nombre)
    setSelectedModulo(null)
    setSelectedTematica(null)
    setSidebarOpen(false)
  }

  function handleSelectModulo(matNombre: string, modNombre: string | null) {
    setSelectedMateria(matNombre)
    setSelectedModulo(modNombre)
    setSelectedTematica(null)
    setSidebarOpen(false)
  }

  function handleSelectTematica(matNombre: string, modNombre: string, temNombre: string) {
    setSelectedMateria(matNombre)
    setSelectedModulo(modNombre)
    setSelectedTematica(temNombre)
    setSidebarOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar
        onMenuClick={() => setSidebarOpen((v) => !v)}
        onIngestClick={() => setIngestOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="body-wrap">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onIngestClick={() => setIngestOpen(true)}
          materias={materias}
          selectedMateria={selectedMateria}
          selectedModulo={selectedModulo}
          selectedTematica={selectedTematica}
          onSelectMateria={handleSelectMateria}
          onSelectModulo={handleSelectModulo}
          onSelectTematica={handleSelectTematica}
        />

        <main className="main-content">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--ink-4)' }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {searchQuery ? 'No se encontraron notas' : 'No hay notas todavía'}
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                {searchQuery ? 'Intentá con otro término' : 'Todavía no hay notas guardadas'}
              </p>
              {!searchQuery && isLocal && (
                <button
                  className="btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setIngestOpen(true)}
                >
                  Importar apunte
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="notes-count" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)', fontWeight: 400 }}>
                  {filtered.length} nota{filtered.length !== 1 ? 's' : ''}
                  {searchQuery && ` para "${searchQuery}"`}
                </h2>
              </div>

              <div className="notes-grid">
                {filtered.map((nota) => (
                  <NoteCard key={nota.id} nota={nota} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {ingestOpen && <IngestPanel onClose={() => setIngestOpen(false)} />}
    </div>
  )
}
