export interface Nota {
  id: string
  titulo: string
  fecha: string
  fuente?: string
  preguntas: string[]
  notas: { text: string; hl: boolean }[]
  resumen: string
  tags: string[]
}

export interface Tematica { id: string; nombre: string; notas: Nota[] }
export interface Modulo   { id: string; nombre: string; tematicas: Tematica[] }
export interface Materia  { id: string; nombre: string; color: string; modulos: Modulo[] }

export interface NotaGenerada extends Nota {
  materiaDetectada:  string
  moduloDetectado:   string
  tematicaDetectada: string
  confirmada: boolean
}

export interface AppStore {
  materias: Materia[]
  selectedMateriaId: string | null
  selectedModuloId: string | null
  selectedTematicaId: string | null
  searchQuery: string
  notasPendientes: NotaGenerada[]
  addNota: (nota: NotaGenerada) => void
  dismissPendiente: (id: string) => void
  setSearch: (q: string) => void
  setSelection: (matId: string | null, modId: string | null, temId: string | null) => void
  getContextNotas: () => Nota[]
}
