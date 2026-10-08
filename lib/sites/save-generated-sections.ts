import type { SupabaseClient } from '@supabase/supabase-js'

// Regenerates drafts only; preserves manual testimonials and locked sections.
// Page metadata is a separate write; errors must reach the caller, never a false success.
export async function saveGeneratedSections(
  supabase: SupabaseClient, siteId: string, tenantId: string, content: Record<string, unknown>
): Promise<string | null> {
  const { error: createError } = await supabase.from('pages').upsert(
    { site_id: siteId, tenant_id: tenantId, slug: 'home', intent: 'transacional', published: false },
    { onConflict: 'site_id,slug', ignoreDuplicates: true }
  )
  if (createError) return createError.message
  const { data: page, error: pageError } = await supabase.from('pages').select('id,published')
    .eq('site_id', siteId).eq('tenant_id', tenantId).eq('slug', 'home').single()
  if (pageError || !page) return pageError?.message ?? 'Página não encontrada.'

  if (page.published) return 'Para proteger o conteúdo no ar, a regeneração está disponível apenas para rascunhos.'

  const { data: existing, error: readError } = await supabase.from('sections')
    .select('section_type,content,order_index,locked').eq('page_id', page.id).eq('tenant_id', tenantId)
  if (readError || !existing) return readError?.message ?? 'Não foi possível ler as seções.'
  const generated = [
    { section_type: 'hero', content: content.hero },
    { section_type: 'about', content: content.about },
    { section_type: 'services', content: { items: content.services } },
    { section_type: 'testimonials', content: { items: [] } },
    { section_type: 'faq', content: { items: content.faq } },
    { section_type: 'meta', content: content.meta },
  ]
  const rows = generated.flatMap((section, index) => {
    const previous = existing.find(row => row.section_type === section.section_type)
    if (previous?.locked || (previous && section.section_type === 'testimonials')) return []
    if (!section.content || typeof section.content !== 'object') return []
    return [{
      page_id: page.id, tenant_id: tenantId, section_type: section.section_type,
      order_index: previous?.order_index ?? index,
      content: { ...previous?.content, ...section.content },
    }]
  })
  if (rows.length) {
    const { data: saved, error: saveError } = await supabase.from('sections')
      .upsert(rows, { onConflict: 'page_id,section_type' }).select('id')
    if (saveError || saved?.length !== rows.length) return saveError?.message ?? 'Nem todas as seções foram salvas.'
  }
  const meta = content.meta as { title?: string; description?: string } | undefined
  if (meta && !existing.some(row => row.section_type === 'meta' && row.locked)) {
    const { error: metaError } = await supabase.from('pages')
      .update({ title: meta.title, meta_description: meta.description })
      .eq('id', page.id).eq('tenant_id', tenantId).select('id').single()
    if (metaError) return metaError.message
  }
  return null
}
