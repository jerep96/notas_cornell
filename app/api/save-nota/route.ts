import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { nanoid } from 'nanoid'
import { toSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'No disponible en producción' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const items = Array.isArray(body)
    ? (body as Record<string, unknown>[])
    : [body as Record<string, unknown>]

  const ids: string[] = []

  for (const nota of items) {
    const id = nanoid()
    const matSlug = toSlug((nota.materiaDetectada as string) || 'general')
    const modSlug = toSlug((nota.moduloDetectado as string) || 'modulo-1')
    const file = path.join(
      process.cwd(),
      'data/notas',
      matSlug,
      modSlug,
      `${id}.json`
    )
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(
      file,
      JSON.stringify(
        { ...nota, id, fecha: (nota.fecha as string) || new Date().toISOString().split('T')[0] },
        null,
        2
      )
    )
    ids.push(id)
  }

  return NextResponse.json({ ok: true, ids })
}
