// Esqueleto instantâneo desta rota (App Router). Ver PainelSkeleton.
import PainelSkeleton from '../PainelSkeleton'

export default function Loading() {
  return <PainelSkeleton titulo="Blog" sub="seus artigos" cartoes={3} />
}
