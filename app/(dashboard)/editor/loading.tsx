// /editor (sem id) só redireciona pro editor do site mais recente. Sem este
// esqueleto, o clique no menu deixa a tela anterior congelada até o redirect
// resolver no servidor.
import PainelSkeleton from '../PainelSkeleton'

export default function Loading() {
  return <PainelSkeleton titulo="Editor" sub="abrindo o editor do seu site" cartoes={2} />
}
