'use client'

import { NotaArchivo } from '@/lib/types'
import { getMateriaColor } from '@/lib/utils'
import { parseNegrita } from '@/lib/parseNegrita'

interface CornellViewProps {
  nota: NotaArchivo
}

export default function CornellView({ nota }: CornellViewProps) {
  const materiaColor = getMateriaColor(nota.materiaDetectada)

  return (
    <article style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: materiaColor,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--font-ibm-plex)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {nota.materiaDetectada}
          </span>
          <span style={{ color: 'var(--ink-4)', fontSize: '0.75rem' }}>›</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--font-ibm-plex)' }}>{nota.moduloDetectado}</span>
          <span style={{ color: 'var(--ink-4)', fontSize: '0.75rem' }}>›</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--font-ibm-plex)' }}>{nota.tematicaDetectada}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.4rem', lineHeight: 1.25 }}>
          {nota.titulo}
        </h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-4)', fontFamily: 'var(--font-ibm-plex)' }}>
            {nota.fecha}
          </span>
          {nota.fuente && (
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)', fontStyle: 'italic' }}>
              {nota.fuente}
            </span>
          )}
        </div>

        <div className="tags-row" style={{ marginTop: '0.6rem' }}>
          {nota.tags.map((tag) => (
            <span key={tag} className="note-card-tag">#{tag}</span>
          ))}
        </div>
      </header>

      <div
        className="cornell-layout"
        style={{
          border: '1px solid var(--paper-4)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div className="cornell-questions">
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--ink-4)',
            fontFamily: 'var(--font-ibm-plex)',
            marginBottom: '1rem',
          }}>
            Preguntas clave
          </p>
          {nota.preguntas.map((pregunta, i) => (
            <p key={i} className="question-item">
              {pregunta}
            </p>
          ))}
        </div>

        <div className="cornell-notes ruled-paper">
          {nota.notas.map((item, i) => (
            <div key={i} className={item.hl ? 'note-block-hl' : 'note-block'}>
              <p
                style={{ margin: 0, fontSize: '0.9rem', lineHeight: '28px', color: 'var(--ink-2)' }}
                dangerouslySetInnerHTML={{ __html: parseNegrita(item.text) }}
              />
            </div>
          ))}
        </div>

        <div className="cornell-summary">
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--ink-4)',
            fontFamily: 'var(--font-ibm-plex)',
            marginBottom: '0.4rem',
          }}>
            Resumen
          </p>
          <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            {nota.resumen}
          </p>
        </div>
      </div>
    </article>
  )
}
