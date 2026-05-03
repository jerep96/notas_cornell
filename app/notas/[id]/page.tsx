import { getNotaById } from '@/lib/notas'
import { notFound } from 'next/navigation'
import NotaPageClient from '@/components/NotaPageClient'

export default async function NotaPage({ params }: { params: { id: string } }) {
  const nota = getNotaById(params.id)
  if (!nota) notFound()
  return <NotaPageClient nota={nota} />
}
