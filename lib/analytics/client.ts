// Telemetria client-side: dispara um evento de funil, fire-and-forget.
// Nunca quebra a UX, nunca envia PII, respeita opt-out (cookie aco_no_track).
// O id de sessão (pseudônimo) é gerido server-side via cookie httpOnly — aqui
// não lemos nem geramos identidade.

import type { AnalyticsEvent } from './events'

function optedOut(): boolean {
  if (typeof document === 'undefined') return true
  return /(?:^|;\s*)aco_no_track=1/.test(document.cookie)
}

type Props = Record<string, string | number | boolean>

function send(body: string): Promise<unknown> {
  // keepalive: o envio sobrevive a navegação/fechamento de aba.
  return fetch('/api/track', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => {})
}

// O cookie de sessão nasce na RESPOSTA do primeiro /api/track. Se dois eventos
// saem juntos numa primeira visita (o onboarding dispara onboarding_start e
// onboarding_step_view no mesmo instante), os dois chegam sem cookie e o
// servidor dá um id diferente pra cada: uma visita vira duas sessões e o funil
// mostra gente "parando" numa tela que nunca existiu. Por isso o primeiro
// evento da página sai sozinho e os demais esperam a resposta dele.
let firstSent: Promise<unknown> | null = null

export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === 'undefined' || optedOut()) return
  try {
    const body = JSON.stringify({ event, path: window.location.pathname, props: props ?? {} })
    if (!firstSent) { firstSent = send(body); return }
    void firstSent.then(() => send(body))
  } catch {
    /* telemetria é best-effort — silenciar qualquer erro */
  }
}
