import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
// isAppHost é compartilhado com /api/track (mesma regra de "painel x site de
// cliente" nos dois lugares — se divergir, a telemetria atribui visita errada).
import { isAppHost } from '@/lib/site-host'
import { detectAiBot } from '@/lib/seo/ai-bots'
import { recordAiBotVisit } from '@/lib/analytics/bot-visit'

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const host = request.headers.get('host') ?? ''
  const { pathname } = request.nextUrl

  // Host de site publicado (ex.: cliente.ancoreo.com.br, dominioproprio.com.br):
  // reescreve pra rota dinâmica /[domain], que renderiza o site real.
  // Não roda updateSession — site publicado é público, sem sessão de painel.
  if (!isAppHost(host) && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    const hostname = host.split(':')[0] ?? host

    // Robô de IA lendo o site do cliente: conta em segundo plano (waitUntil),
    // a resposta não espera. É a métrica de AEO que dá pra medir de verdade.
    const bot = request.method === 'GET' ? detectAiBot(request.headers.get('user-agent')) : null
    if (bot) event.waitUntil(recordAiBotVisit(host, pathname, bot))

    const url = request.nextUrl.clone()
    url.pathname = `/${hostname}${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  // Host do painel: fluxo normal de auth.
  return updateSession(request)
}

export const config = {
  matcher: [
    // robots.txt / sitemap.xml / llms.txt são servidos pelos handlers de raiz
    // (app/robots.ts, app/sitemap.ts, app/llms.txt) e leem o host direto.
    // Excluídos do rewrite pra que o arquivo GEO/AEO apareça no domínio do
    // cliente (senão o rewrite pra /[domain]/... nunca acha o handler).
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
