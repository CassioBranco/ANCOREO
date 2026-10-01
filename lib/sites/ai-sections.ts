// ============================================================
// ANCOREO — Gravar seções escritas pela IA sem apagar o trabalho do dono
//
// Usado por /api/generate/site (gerar ou "Preencher tudo com IA") e por
// /api/ai/page (reescrever a página). Antes, os dois faziam upsert cego:
//  • o texto que o dono corrigiu à mão voltava a ser o da IA;
//  • a foto que ele subiu sumia (mora em content.image do bloco);
//  • a geração zerava os depoimentos reais que ele cadastrou.
//
// Regras, nesta ordem:
//  1. Bloco com locked=true foi editado à mão no editor: a IA não toca.
//  2. Depoimento que já existe nunca é regravado (a IA não escreve
//     depoimento; só pode criar o bloco vazio quando ele ainda não existe).
//  3. Campos que só o dono preenche (foto, telefone) sobrevivem à reescrita.
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js'

export type AiSection = { section_type: string; order_index: number; content: unknown }
export type ExistingSection = { section_type: string; content: unknown; locked: boolean | null }

/** Campos que a IA nunca produz e o dono preenche no editor. */
const OWNER_FIELDS = ['image', 'cta_phone'] as const

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Decide o que gravar. Função pura (sem banco) pra ser checável:
 * scripts/check-ai-sections.ts.
 */
export function planAiSectionWrites(existing: ExistingSection[], generated: AiSection[]) {
  const byType = new Map(existing.map(e => [e.section_type, e]))
  const writes: AiSection[] = []
  const kept: string[] = []

  for (const s of generated) {
    const cur = byType.get(s.section_type)
    if (cur?.locked) { kept.push(s.section_type); continue }
    if (s.section_type === 'testimonials' && cur) { kept.push(s.section_type); continue }

    let content = s.content
    if (cur && isObj(cur.content) && isObj(content)) {
      const owner: Record<string, unknown> = {}
      for (const f of OWNER_FIELDS) if (cur.content[f]) owner[f] = cur.content[f]
      content = { ...content, ...owner }
    }
    writes.push({ ...s, content })
  }
  return { writes, kept }
}

/**
 * Grava as seções geradas na página. Devolve o erro (ou null) e os tipos de
 * bloco que foram mantidos como estavam.
 */
export async function saveAiSections(
  supabase: SupabaseClient,
  pageId: string,
  tenantId: string,
  generated: AiSection[],
): Promise<{ error: string | null; kept: string[] }> {
  const { data: existing, error: readErr } = await supabase
    .from('sections')
    .select('section_type, content, locked')
    .eq('page_id', pageId)
  // Sem conseguir ler o que existe, não grava: gravar às cegas é exatamente
  // o que apagava o trabalho do dono.
  if (readErr) return { error: readErr.message, kept: [] }

  const { writes, kept } = planAiSectionWrites((existing ?? []) as ExistingSection[], generated)
  for (const s of writes) {
    const { error } = await supabase
      .from('sections')
      .upsert({ page_id: pageId, tenant_id: tenantId, ...s }, { onConflict: 'page_id,section_type' })
    if (error) return { error: error.message, kept }
  }
  return { error: null, kept }
}
