'use client'

import { useStore } from '@/lib/store'
import { Materia, Modulo, Tematica } from '@/lib/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const isLocal =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost')

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onIngestClick: () => void
}

function CollapseIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.15s',
        flexShrink: 0,
      }}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Sidebar({ isOpen, onClose, onIngestClick }: SidebarProps) {
  const { materias, selectedMateriaId, selectedModuloId, selectedTematicaId, setSelection } = useStore()
  const [openMaterias, setOpenMaterias] = useState<Record<string, boolean>>({})
  const [openModulos, setOpenModulos] = useState<Record<string, boolean>>({})
  const router = useRouter()

  function toggleMateria(id: string) {
    setOpenMaterias((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleModulo(id: string) {
    setOpenModulos((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleTematicaClick(mat: Materia, mod: Modulo, tem: Tematica) {
    setSelection(mat.id, mod.id, tem.id)
    router.push('/notas')
    onClose()
  }

  function handleMateriaClick(mat: Materia) {
    setSelection(mat.id, null, null)
    toggleMateria(mat.id)
    router.push('/notas')
  }

  function handleModuloClick(mat: Materia, mod: Modulo) {
    setSelection(mat.id, mod.id, null)
    toggleModulo(mod.id)
    router.push('/notas')
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside className={`sidebar${isOpen ? ' open' : ''}`} style={{ position: 'relative' }}>
        <div style={{ padding: '0.75rem 0.75rem 0.5rem' }}>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-4)', marginBottom: '0.5rem', fontFamily: 'var(--font-ibm-plex)' }}>
            Materias
          </p>
          {isLocal && (
            <button
              className="btn-primary"
              style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.8rem' }}
              onClick={() => { onIngestClick(); onClose() }}
            >
              Importar apunte
            </button>
          )}
        </div>

        <nav>
          {materias.map((mat) => {
            const isMatOpen = openMaterias[mat.id] ?? false
            const isMatActive = selectedMateriaId === mat.id

            return (
              <div key={mat.id}>
                <div
                  className="sidebar-materia"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isMatActive ? mat.color : 'var(--ink)',
                  }}
                  onClick={() => handleMateriaClick(mat)}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: mat.color,
                      flexShrink: 0,
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mat.nombre}
                  </span>
                  <CollapseIcon open={isMatOpen} />
                </div>

                {isMatOpen && mat.modulos.map((mod) => {
                  const isModOpen = openModulos[mod.id] ?? false
                  const isModActive = selectedModuloId === mod.id

                  return (
                    <div key={mod.id}>
                      <div
                        className="sidebar-modulo"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: isModActive ? 'var(--ink)' : 'var(--ink-2)',
                        }}
                        onClick={() => handleModuloClick(mat, mod)}
                      >
                        <CollapseIcon open={isModOpen} />
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {mod.nombre}
                        </span>
                      </div>

                      {isModOpen && mod.tematicas.map((tem) => {
                        const isTemActive = selectedTematicaId === tem.id
                        return (
                          <div
                            key={tem.id}
                            className={`sidebar-tematica${isTemActive ? ' active' : ''}`}
                            onClick={() => handleTematicaClick(mat, mod, tem)}
                          >
                            {tem.nombre}
                            <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)' }}>
                              {tem.notas.length}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
