import type { SiteContent } from './example-content'

export type Stat = { value: string; label: string }

/** Média das notas dos depoimentos reais. null quando não há nota. */
export function notaMedia(c: SiteContent): { media: string; total: number } | null {
  const notas = (c.testimonials ?? []).map(t => Number(t.rating)).filter(n => n > 0 && n <= 5)
  if (notas.length === 0) return null
  const media = notas.reduce((a, b) => a + b, 0) / notas.length
  return { media: media.toFixed(1).replace('.', ','), total: notas.length }
}

/**
 * Números que o site pode mostrar sem inventar nada: os stats que o dono
 * escreveu ou, na falta deles, o que dá para contar dos próprios dados.
 * Nunca devolve número fabricado ("+30 mil atendimentos", "4.9").
 */
export function realStats(c: SiteContent): Stat[] {
  if (c.stats && c.stats.length > 0) return c.stats
  const out: Stat[] = []
  if (c.yearsExperience && c.yearsExperience > 0) {
    out.push({ value: `${c.yearsExperience} ${c.yearsExperience === 1 ? 'ano' : 'anos'}`, label: c.city ? `em ${c.city}` : 'de experiência' })
  }
  if (c.services.length > 0) {
    out.push({ value: String(c.services.length), label: c.services.length === 1 ? 'serviço' : 'serviços' })
  }
  const nota = notaMedia(c)
  if (nota) out.push({ value: `${nota.media} ★`, label: nota.total === 1 ? '1 avaliação' : `${nota.total} avaliações` })
  return out
}
