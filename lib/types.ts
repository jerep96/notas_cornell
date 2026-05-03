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

export interface NotaArchivo extends Nota {
  materiaDetectada: string
  moduloDetectado: string
  tematicaDetectada: string
}

export interface TematicaNode { nombre: string; notas: NotaArchivo[] }
export interface ModuloNode   { nombre: string; tematicas: TematicaNode[] }
export interface MateriaNode  { nombre: string; color: string; modulos: ModuloNode[] }
