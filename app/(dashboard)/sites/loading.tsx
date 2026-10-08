// Esqueleto instantâneo desta rota (App Router). Ver PainelSkeleton.
// Sem título fixo: o h1 de /sites é a saudação ("Bom dia, Fulano").
import PainelSkeleton from '../PainelSkeleton'

export default function Loading() {
  return <PainelSkeleton cartoes={3} />
}
