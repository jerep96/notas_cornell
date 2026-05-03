import fs from 'fs'
import path from 'path'
import { NotaArchivo } from './types'

function getAllJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((e) =>
    e.isDirectory()
      ? getAllJsonFiles(path.join(dir, e.name))
      : e.name.endsWith('.json')
      ? [path.join(dir, e.name)]
      : []
  )
}

export function getAllNotas(): NotaArchivo[] {
  const dir = path.join(process.cwd(), 'data/notas')
  return getAllJsonFiles(dir).flatMap((f) => {
    try {
      return [JSON.parse(fs.readFileSync(f, 'utf-8')) as NotaArchivo]
    } catch {
      return []
    }
  })
}

export function getNotaById(id: string): NotaArchivo | null {
  const dir = path.join(process.cwd(), 'data/notas')
  const file = getAllJsonFiles(dir).find((f) => f.endsWith(`${id}.json`))
  if (!file) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as NotaArchivo
  } catch {
    return null
  }
}
