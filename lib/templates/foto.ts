import type { PaletteColors } from '@/lib/templates/palettes'

/**
 * Primeira foto real disponível. Sem nenhuma, devolve um bloco liso nas cores
 * da marca: nunca foto de banco aleatória fingindo ser do negócio.
 */
export function fotoOu(p: PaletteColors, w: number, h: number, ...candidatas: (string | null | undefined)[]): string {
  const real = candidatas.find(u => !!u)
  if (real) return real
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`
    + `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`
    + `<stop offset="0" stop-color="${p.primary}" stop-opacity=".28"/>`
    + `<stop offset="1" stop-color="${p.accent}" stop-opacity=".12"/></linearGradient></defs>`
    + `<rect width="100%" height="100%" fill="${p.surface}"/><rect width="100%" height="100%" fill="url(#g)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
