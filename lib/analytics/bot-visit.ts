// ============================================================
// ANCOREO — Registro de visita de robô de IA no site do cliente
// Chamado pelo middleware (edge), em segundo plano via waitUntil: a página do
// visitante nunca espera por isto e nenhum erro daqui chega nela.
//
// Por que no servidor e não no /api/track: robô não roda JavaScript, então o
// site_view do navegador nunca o vê. O user-agent só existe na requisição.
//
// Por que fetch cru no REST do Supabase: o middleware roda no edge e o
// supabase-js inteiro incharia o bundle de toda requisição.
//
// LGPD: não guarda IP nem user-agent cru, só o nome do robô. Robô não é
// pessoa, mas a regra da tabela vale pra tudo que entra nela.
//
// 'ai_bot_visit' fica FORA da allowlist do /api/track de propósito: se
// estivesse lá, qualquer navegador poderia inflar a contagem de um cliente.
// ============================================================

import type { AiBot } from '@/lib/seo/ai-bots'
import { bareHost } from '@/lib/site-host'

export const AI_BOT_VISIT_EVENT = 'ai_bot_visit'

export async function recordAiBotVisit(host: string, path: string, bot: AiBot): Promise<void> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) return

  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' }
  const domain = bareHost(host)

  try {
    // O dono da visita vem do Host, nunca de algo que o robô mande.
    // Host desconhecido ou site não publicado: descarta, igual ao site_view.
    const q = `${base}/rest/v1/sites?select=id,tenant_id&status=eq.published&domain=eq.${encodeURIComponent(domain)}&limit=1`
    const res = await fetch(q, { headers })
    if (!res.ok) return
    const [site] = (await res.json()) as { id: string; tenant_id: string | null }[]
    if (!site) return

    await fetch(`${base}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({
        event: AI_BOT_VISIT_EVENT,
        tenant_id: site.tenant_id,
        path: path.slice(0, 200),
        props: { bot: bot.ua, dono: bot.dono, ia: bot.ia, site_id: site.id, domain },
      }),
    })
  } catch {
    /* telemetria é best-effort */
  }
}
