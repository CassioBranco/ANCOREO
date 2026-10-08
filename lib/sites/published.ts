import { createAdminClient } from '@/lib/supabase/admin'

/** Resolve o proprietário junto com o site antes de qualquer leitura pública. */
export async function publishedSite(domain: string): Promise<{ id: string; tenant_id: string } | null> {
  const { data, error } = await createAdminClient().from('sites')
    .select('id, tenant_id').eq('domain', domain).eq('status', 'published').maybeSingle()
  if (error || !data?.id || !data.tenant_id) return null
  return { id: data.id, tenant_id: data.tenant_id }
}
