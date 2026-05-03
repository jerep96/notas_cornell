'use client'

import Link from 'next/link'
import { Nota } from '@/lib/types'

interface NoteCardProps {
  nota: Nota
  materiaColor?: string
  materiaName?: string
}

export default function NoteCard({ nota, materiaColor, materiaName }: NoteCardProps) {
  const preview = nota.notas[0]?.text.replace(/\*\*(.+?)\*\*/g, '$1') ?? ''

  return (
    <Link href={`/notas/${nota.id}`} className="note-card">
      {materiaName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: materiaColor ?? 'var(--ink-4)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {materiaName}
          </span>
        </div>
      )}

      <h3 style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--ink)',
        margin: '0 0 0.5rem',
        lineHeight: 1.3,
      }}>
        {nota.titulo}
      </h3>

      <p style={{
        fontSize: '0.8rem',
        color: 'var(--ink-3)',
        margin: '0 0 0.75rem',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {preview}
      </p>

      <div className="tags-row">
        {nota.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="note-card-tag">#{tag}</span>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)' }}>
          {nota.fecha}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)' }}>
          {nota.preguntas.length} preg.
        </span>
      </div>
    </Link>
  )
}
