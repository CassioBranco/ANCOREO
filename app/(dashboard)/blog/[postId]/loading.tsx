// Esqueleto instantâneo desta rota (App Router). Ver PainelSkeleton.
import PainelSkeleton from '../../PainelSkeleton'

export default function Loading() {
  return <PainelSkeleton titulo="Artigo" sub="carregando o editor do artigo" cartoes={3} />
}
