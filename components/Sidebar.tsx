'use client'

import { MateriaNode } from '@/lib/types'
import { useState } from 'react'
import { useIsLocal } from '@/lib/useIsLocal'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onIngestClick: () => void
  materias: MateriaNode[]
  selectedMateria: string | null
  selectedModulo: string | null
  selectedTematica: string | null
  onSelectMateria: (nombre: string | null) => void
  onSelectModulo: (matNombre: string, modNombre: string | null) => void
  onSelectTematica: (matNombre: string, modNombre: string, temNombre: string) => void
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

export default function Sidebar({
  isOpen,
  onClose,
  onIngestClick,
  materias,
  selectedMateria,
  selectedModulo,
  selectedTematica,
  onSelectMateria,
  onSelectModulo,
  onSelectTematica,
}: SidebarProps) {
  const [openMaterias, setOpenMaterias] = useState<Record<string, boolean>>({})
  const [openModulos, setOpenModulos] = useState<Record<string, boolean>>({})
  const isLocal = useIsLocal()

  function toggleMateria(nombre: string) {
    setOpenMaterias((prev) => ({ ...prev, [nombre]: !prev[nombre] }))
  }

  function toggleModulo(nombre: string) {
    setOpenModulos((prev) => ({ ...prev, [nombre]: !prev[nombre] }))
  }

  function handleMateriaClick(matNombre: string) {
    onSelectMateria(matNombre)
    toggleMateria(matNombre)
    onClose()
  }

  function handleModuloClick(matNombre: string, modNombre: string) {
    onSelectModulo(matNombre, modNombre)
    toggleModulo(modNombre)
    onClose()
  }

  function handleTematicaClick(matNombre: string, modNombre: string, temNombre: string) {
    onSelectTematica(matNombre, modNombre, temNombre)
    onClose()
  }

  return (
    <>
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
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
            const isMatOpen = openMaterias[mat.nombre] ?? false
            const isMatActive = selectedMateria === mat.nombre

            return (
              <div key={mat.nombre}>
                <div
                  className="sidebar-materia"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isMatActive ? mat.color : 'var(--ink)',
                  }}
                  onClick={() => handleMateriaClick(mat.nombre)}
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
                  const isModOpen = openModulos[mod.nombre] ?? false
                  const isModActive = selectedModulo === mod.nombre && selectedMateria === mat.nombre

                  return (
                    <div key={mod.nombre}>
                      <div
                        className="sidebar-modulo"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: isModActive ? 'var(--ink)' : 'var(--ink-2)',
                        }}
                        onClick={() => handleModuloClick(mat.nombre, mod.nombre)}
                      >
                        <CollapseIcon open={isModOpen} />
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {mod.nombre}
                        </span>
                      </div>

                      {isModOpen && mod.tematicas.map((tem) => {
                        const isTemActive = selectedTematica === tem.nombre && selectedModulo === mod.nombre
                        return (
                          <div
                            key={tem.nombre}
                            className={`sidebar-tematica${isTemActive ? ' active' : ''}`}
                            onClick={() => handleTematicaClick(mat.nombre, mod.nombre, tem.nombre)}
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
