'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { AppStore, Nota, NotaGenerada } from './types'
import { initialData } from './data'

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      materias: initialData,
      selectedMateriaId: null,
      selectedModuloId: null,
      selectedTematicaId: null,
      searchQuery: '',
      notasPendientes: [],

      addNota: (nota: NotaGenerada) => {
        set((state) => {
          const materias = [...state.materias]
          let materia = materias.find((m) => m.nombre === nota.materiaDetectada)

          if (!materia) {
            materia = {
              id: nanoid(),
              nombre: nota.materiaDetectada,
              color: '#9b3a22',
              modulos: [],
            }
            materias.push(materia)
          } else {
            const idx = materias.indexOf(materia)
            materia = { ...materia, modulos: [...materia.modulos] }
            materias[idx] = materia
          }

          let modulo = materia.modulos.find((m) => m.nombre === nota.moduloDetectado)
          if (!modulo) {
            modulo = { id: nanoid(), nombre: nota.moduloDetectado, tematicas: [] }
            materia.modulos = [...materia.modulos, modulo]
          } else {
            const idx = materia.modulos.indexOf(modulo)
            modulo = { ...modulo, tematicas: [...modulo.tematicas] }
            materia.modulos = materia.modulos.map((m, i) => (i === idx ? modulo! : m))
          }

          let tematica = modulo.tematicas.find((t) => t.nombre === nota.tematicaDetectada)
          if (!tematica) {
            tematica = { id: nanoid(), nombre: nota.tematicaDetectada, notas: [] }
            modulo.tematicas = [...modulo.tematicas, tematica]
          } else {
            const idx = modulo.tematicas.indexOf(tematica)
            tematica = { ...tematica, notas: [...tematica.notas] }
            modulo.tematicas = modulo.tematicas.map((t, i) => (i === idx ? tematica! : t))
          }

          const notaLimpia: Nota = {
            id: nota.id,
            titulo: nota.titulo,
            fecha: nota.fecha,
            fuente: nota.fuente,
            preguntas: nota.preguntas,
            notas: nota.notas,
            resumen: nota.resumen,
            tags: nota.tags,
          }
          tematica.notas = [...tematica.notas, notaLimpia]

          const pendientes = state.notasPendientes.filter((n) => n.id !== nota.id)
          return { materias, notasPendientes: pendientes }
        })
      },

      dismissPendiente: (id: string) => {
        set((state) => ({
          notasPendientes: state.notasPendientes.filter((n) => n.id !== id),
        }))
      },

      setSearch: (q: string) => set({ searchQuery: q }),

      setSelection: (matId, modId, temId) =>
        set({ selectedMateriaId: matId, selectedModuloId: modId, selectedTematicaId: temId }),

      getContextNotas: () => {
        const state = get()
        const { materias, selectedMateriaId, selectedModuloId, selectedTematicaId } = state

        if (selectedTematicaId) {
          for (const mat of materias) {
            for (const mod of mat.modulos) {
              const tem = mod.tematicas.find((t) => t.id === selectedTematicaId)
              if (tem) return tem.notas
            }
          }
        }
        if (selectedModuloId) {
          for (const mat of materias) {
            const mod = mat.modulos.find((m) => m.id === selectedModuloId)
            if (mod) return mod.tematicas.flatMap((t) => t.notas)
          }
        }
        if (selectedMateriaId) {
          const mat = materias.find((m) => m.id === selectedMateriaId)
          if (mat) return mat.modulos.flatMap((m) => m.tematicas.flatMap((t) => t.notas))
        }
        return materias.flatMap((m) => m.modulos.flatMap((mod) => mod.tematicas.flatMap((t) => t.notas)))
      },
    }),
    {
      name: 'cornell-notas',
      skipHydration: true,
      partialize: (state) => ({
        materias: state.materias,
        selectedMateriaId: state.selectedMateriaId,
        selectedModuloId: state.selectedModuloId,
        selectedTematicaId: state.selectedTematicaId,
      }),
    }
  )
)
