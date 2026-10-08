// ============================================================
// ANCOREO — Esqueleto de carregamento das rotas do painel.
// Existe pra que trocar de tela seja imediato: sem ele, o Next
// segura a tela ANTIGA até o servidor responder (0,7s de RSC em
// produção, vários segundos em dev), e o painel parece travado.
// Com ele, o título da tela nova aparece na hora e o corpo entra
// como barras cinzas do tamanho aproximado do conteúdo real.
// ============================================================

export default function PainelSkeleton({
  titulo,
  sub,
  cartoes = 2,
}: {
  /** Título real da rota: aparece instantaneamente, sem esperar o servidor.
      Vazio quando o título de verdade é dinâmico (ex.: "Bom dia, Fulano"),
      pra não escrever uma coisa e trocar por outra meio segundo depois. */
  titulo?: string
  sub?: string
  /** Quantos blocos de conteúdo fingir. Aproxima a altura da tela real. */
  cartoes?: number
}) {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="topbar">
        <div>
          {titulo
            ? <h1>{titulo}</h1>
            : <span className="pn-skel-b pn-skel-t" />}
          {sub
            ? <div className="sub">{sub}</div>
            : <span className="pn-skel-b pn-skel-s" />}
        </div>
      </div>

      {Array.from({ length: cartoes }, (_, i) => (
        <div key={i} className="glass pn-skel-card" aria-hidden="true">
          <span className="pn-skel-b" />
          <span className="pn-skel-b" />
          <span className="pn-skel-b" />
        </div>
      ))}
    </div>
  )
}
