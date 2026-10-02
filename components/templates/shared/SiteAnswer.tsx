import type { CSSProperties } from 'react'

// Resposta direta (answer-first) logo abaixo do título do site: 40 a 60
// palavras que dizem quem é o negócio, o que faz e onde. É o trecho que a IA
// copia ao citar o site, e o JSON-LD aponta pra ele (speakable, seletor
// .site-answer). Sem texto, não renderiza nada: site antigo fica igual.
// Cor e fonte vêm do layout; aqui só o ritmo do bloco.
export default function SiteAnswer({ text, style }: { text?: string; style?: CSSProperties }) {
  if (!text?.trim()) return null
  return (
    <p className="site-answer" style={{ fontSize: '1rem', lineHeight: 1.65, maxWidth: '38rem', margin: '0 0 1.6rem', opacity: 0.88, ...style }}>
      {text}
    </p>
  )
}
