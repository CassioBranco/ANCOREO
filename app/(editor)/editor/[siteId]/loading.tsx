// ============================================================
// ANCOREO — Esqueleto do editor. O editor troca o chrome inteiro
// (rail de 236px do painel vira rail de ícones de 76px), então sem
// esqueleto o clique deixava a tela do painel parada e depois
// trocava tudo de uma vez, o que passa a sensação de "quebrou".
// Aqui a grade do editor entra na hora, já nas medidas certas.
// ============================================================

export default function Loading() {
  return (
    <div className="painel-shell">
      <div className="aura" />
      <div className="ed" aria-busy="true" aria-live="polite">
        <div className="ed-score" aria-hidden="true">
          <span className="pn-skel-b" style={{ width: 56, height: 56, borderRadius: '50%' }} />
          <span className="pn-skel-b" style={{ width: 180, height: 14 }} />
        </div>
        <div className="ed-rail" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="pn-skel-b" style={{ width: 34, height: 34, borderRadius: 9 }} />
          ))}
        </div>
        <aside className="ed-panel ed-panel-l" aria-hidden="true">
          <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="ed-skel"><i /><i /><i /></div>
          </div>
        </aside>
        <div className="ed-stage" style={{ display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: '.9rem' }}>
          Carregando editor…
        </div>
        <aside className="ed-panel ed-panel-r" aria-hidden="true">
          <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="ed-skel"><i /><i /><i /></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
