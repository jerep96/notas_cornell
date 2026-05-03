export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const MATERIA_COLORS: Record<string, string> = {
  'Computación Aplicada': '#9b3a22',
  'Curso de Nivelación de Matemática': '#2a4a6b',
  'Derecho Aplicado a la Informática': '#5a3a7a',
  'Sistemas y Métodos': '#2a5a4a',
  'Introducción a la Programación': '#7a4a2a',
  'Seminario de Comunicación Técnica y Profesional': '#3a5a7a',
}

const PALETTE = Object.values(MATERIA_COLORS)

export function getMateriaColor(nombre: string): string {
  if (MATERIA_COLORS[nombre]) return MATERIA_COLORS[nombre]
  let hash = 0
  for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
