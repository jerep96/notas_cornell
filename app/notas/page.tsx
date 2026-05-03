import { getAllNotas } from '@/lib/notas'
import NotasClient from '@/components/NotasClient'

export default async function NotasPage() {
  const notas = getAllNotas()
  return <NotasClient notas={notas} />
}
