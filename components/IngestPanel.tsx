'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface IngestPanelProps {
  onClose: () => void
}

export default function IngestPanel({ onClose }: IngestPanelProps) {
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleImport() {
    setError('')

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText.trim())
    } catch {
      setError('JSON inválido. Revisá el formato.')
      return
    }

    const items = Array.isArray(parsed)
      ? (parsed as Record<string, unknown>[])
      : [parsed as Record<string, unknown>]

    for (let i = 0; i < items.length; i++) {
      const obj = items[i]
      const missing = (['titulo', 'notas', 'resumen'] as const).filter((f) => !obj[f])
      if (missing.length > 0) {
        const label = items.length > 1
          ? `Nota ${i + 1}${obj.titulo ? ` ("${obj.titulo}")` : ''}`
          : 'La nota'
        setError(`${label} — faltan campos obligatorios: ${missing.join(', ')}`)
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/save-nota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      const data = await res.json() as { ok?: boolean; ids?: string[]; error?: string }
      if (!data.ok) {
        setError(data.error || 'Error al guardar')
        setLoading(false)
        return
      }
      onClose()
      router.push(`/notas/${data.ids![0]}`)
      router.refresh()
    } catch {
      setError('Error de red al guardar')
      setLoading(false)
    }
  }

  return (
    <div
      className="ingest-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="ingest-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-playfair)' }}>
            Importar apunte
          </h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          Pegá un objeto JSON o un array de objetos. Campos obligatorios por nota:{' '}
          <span style={{ fontFamily: 'var(--font-ibm-plex)', color: 'var(--ink-2)' }}>titulo</span>,{' '}
          <span style={{ fontFamily: 'var(--font-ibm-plex)', color: 'var(--ink-2)' }}>notas</span>,{' '}
          <span style={{ fontFamily: 'var(--font-ibm-plex)', color: 'var(--ink-2)' }}>resumen</span>.
        </p>

        <textarea
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setError('') }}
          placeholder={'Pegá aquí el JSON generado por Claude...'}
          spellCheck={false}
          style={{
            width: '100%',
            minHeight: '300px',
            background: 'var(--paper-2)',
            border: `1px solid ${error ? 'var(--red)' : 'var(--paper-4)'}`,
            borderRadius: '8px',
            padding: '0.875rem',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-ibm-plex), "Courier New", monospace',
            color: 'var(--ink)',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />

        {error && (
          <p style={{
            margin: '0.5rem 0 0',
            fontSize: '0.82rem',
            color: 'var(--red)',
            fontFamily: 'var(--font-source-serif), Georgia, serif',
          }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button
            className="btn-primary"
            onClick={handleImport}
            disabled={!jsonText.trim() || loading}
            style={{ opacity: jsonText.trim() && !loading ? 1 : 0.5 }}
          >
            {loading ? 'Guardando…' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  )
}
