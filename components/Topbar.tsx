'use client'

import { useRouter } from 'next/navigation'
import { useIsLocal } from '@/lib/useIsLocal'

interface TopbarProps {
  onMenuClick?: () => void
  onIngestClick: () => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
}

export default function Topbar({ onMenuClick, onIngestClick, searchQuery, onSearchChange }: TopbarProps) {
  const router = useRouter()
  const isLocal = useIsLocal()

  return (
    <header className="topbar">
      {onMenuClick && (
        <button className="btn-ghost" onClick={onMenuClick} aria-label="Menú" style={{ display: 'flex' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <button
        onClick={() => router.push('/notas')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--red)',
          padding: '0 0.25rem',
          whiteSpace: 'nowrap',
        }}
      >
        Cuaderno Cornell
      </button>

      {onSearchChange !== undefined && (
        <input
          type="search"
          className="search-input"
          placeholder="Buscar notas…"
          value={searchQuery ?? ''}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ flex: 1, maxWidth: '400px' }}
        />
      )}

      {isLocal && (
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn-primary" onClick={onIngestClick}>
            Importar apunte
          </button>
        </div>
      )}
    </header>
  )
}
