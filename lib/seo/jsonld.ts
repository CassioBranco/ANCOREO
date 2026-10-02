// Serializa um objeto JSON-LD para injeção segura em
// <script type="application/ld+json">. Escapa o caractere '<' para a sequência
// unicode <, impedindo breakout via "</script>" ou "<!--" quando o schema
// carrega dados do usuário (nome do negócio, título de artigo, FAQ). O
// resultado continua sendo JSON válido e é interpretado igual pelo parser.
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

// Seletores do trecho que a IA (e assistente de voz) deve ler em voz alta:
// a resposta direta abaixo do título. Os mesmos usados nos componentes.
export const SPEAKABLE_HOME = '.site-answer'
export const SPEAKABLE_POST = '.ancoreo-article-body > p:first-of-type'

/** speakable só quando existe resposta direta de verdade; senão, nada. */
export function speakableSpec(selector: string, hasAnswer: boolean) {
  return hasAnswer ? { '@type': 'SpeakableSpecification', cssSelector: [selector] } : undefined
}
