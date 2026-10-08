// ============================================================
// ANCOREO — Esqueleto de /templates.
// Sem isto o Next segura a TELA ANTERIOR inteira até o servidor responder
// (esta rota é force-dynamic e lê o perfil no Supabase), e quem clicou acha
// que o botão não funcionou. Aqui a moldura da tela entra na hora.
// ============================================================
import './escolher-modelo.css'

export default function Loading() {
  return (
    <div className="em-page" aria-busy="true" aria-live="polite">
      <div className="em-skel-wrap">
        <span className="em-skel" style={{ width: 220, height: 13 }} />
        <span className="em-skel" style={{ width: 340, height: 26, marginTop: 14 }} />
        <div className="em-skel-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="em-skel" style={{ height: 150 }} />
          ))}
        </div>
        <p className="em-skel-txt">Montando os modelos com os seus dados…</p>
      </div>
    </div>
  )
}
