import { isAppHost } from '@/lib/site-host'
import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { publishedSite } from '@/lib/sites/published'
import { hasSupabaseEnv } from '@/lib/env'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ancoreo.com.br'


// sitemap.xml host-aware: site publicado lista só as SUAS páginas/artigos;
// painel lista só a própria home. (AEO Regra 2 — sitemap por site.)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host') ?? ''

  // ── Painel ou ambiente sem banco ────────────────────────────────────────
  if (!host || isAppHost(host) || !hasSupabaseEnv()) {
    return [{ url: APP_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }]
  }

  // ── Site publicado: só as páginas/artigos DESTE domínio ──────────────────
  const hostname = host.split(':')[0] ?? host
  const baseUrl = `https://${hostname}`

  try {
    const site = await publishedSite(hostname)
    if (!site) return []
    const supabase = createAdminClient()

    const [{ data: pages }, { data: posts }] = await Promise.all([
      supabase
        .from('pages')
        .select('slug')
        .eq('site_id', site.id)
        .eq('tenant_id', site.tenant_id)
        .eq('published', true),
      supabase
        .from('blog_posts')
        .select('slug, published_at')
        .eq('site_id', site.id)
        .eq('tenant_id', site.tenant_id)
        .eq('status', 'published'),
    ])

    const pageEntries: MetadataRoute.Sitemap = (pages ?? []).map(p => ({
      url: p.slug === 'home' ? baseUrl : `${baseUrl}/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: p.slug === 'home' ? 1 : 0.7,
    }))

    const postEntries: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date((p.published_at as string) ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    const all = [...pageEntries, ...postEntries]
    return all.length > 0
      ? all
      : [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }]
  } catch {
    return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }]
  }
}
