// Esqueleto instantâneo desta rota (App Router). Ver PainelSkeleton.
import PainelSkeleton from '../PainelSkeleton'

export default function Loading() {
  return <PainelSkeleton titulo="Agendamentos" sub="solicitações de horário do seu site" cartoes={2} />
}
