// ============================================================
// ANCOREO — Esqueleto do onboarding.
// É a primeira tela de quem acabou de criar conta. Sem esqueleto, o clique
// em "Começar" deixava a tela anterior parada por segundos, que é a pior
// hora possível pra dar impressão de site travado.
// ============================================================
import './onboarding.css'

export default function Loading() {
  return (
    <div className="ob-page" aria-busy="true" aria-live="polite">
      <div className="ob-skel-wrap">
        <span className="ob-skel" style={{ width: 170, height: 12 }} />
        <span className="ob-skel" style={{ width: 300, height: 30, marginTop: 16 }} />
        <span className="ob-skel" style={{ width: 420, height: 14, marginTop: 10 }} />
        <span className="ob-skel" style={{ height: 52, marginTop: 26 }} />
        <span className="ob-skel" style={{ height: 52, marginTop: 10 }} />
        <span className="ob-skel" style={{ width: 160, height: 44, marginTop: 22, borderRadius: 999 }} />
        <p className="ob-skel-txt">Abrindo a ficha de bordo…</p>
      </div>
    </div>
  )
}
