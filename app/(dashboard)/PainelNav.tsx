'use client'

// Itens de navegação do painel (liquid-glass). Estado ativo via pathname.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/metrics',  label: 'Painel',         icon: 'ph-chart-line-up' },
  { href: '/sites',    label: 'Meus sites',    icon: 'ph-globe-hemisphere-west' },
  { href: '/editor',   label: 'Editor',         icon: 'ph-pencil-ruler' },
  { href: '/blog',     label: 'Blog',           icon: 'ph-article' },
  { href: '/agendamentos', label: 'Agendamentos', icon: 'ph-calendar-check' },
  { href: '/leads',    label: 'Leads',          icon: 'ph-envelope-simple' },
  { href: '/gbp',      label: 'Google',         icon: 'ph-google-logo' },
  { href: '/parcerias', label: 'Parcerias',     icon: 'ph-handshake' },
  { href: '/settings', label: 'Configurações',  icon: 'ph-gear' },
]

export default function PainelNav() {
  const pathname = usePathname()
  // Item clicado enquanto a rota nova ainda não chegou. Sem isto o clique não
  // devolve sinal nenhum até a tela trocar e a sensação é de painel travado.
  const [pendente, setPendente] = useState<string | null>(null)

  // Chegou na rota nova (ou o usuário mudou de ideia): apaga o pendente.
  useEffect(() => { setPendente(null) }, [pathname])

  // Rede caiu, redirect falhou, navegação abortada: não deixa o item preso
  // girando pra sempre.
  useEffect(() => {
    if (!pendente) return
    const t = setTimeout(() => setPendente(null), 12000)
    return () => clearTimeout(t)
  }, [pendente])

  return (
    <>
      {NAV.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        const carregando = pendente === item.href && !active
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active ? 'on' : ''} ${carregando ? 'pendente' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={e => {
              // Abrir em outra aba (ctrl/cmd/shift/meio) não troca esta tela.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
              if (active) return
              setPendente(item.href)
            }}
          >
            <i className={`ph-duotone ${item.icon}`} /> {item.label}
            {carregando && <span className="nav-spin" aria-hidden="true" />}
          </Link>
        )
      })}
    </>
  )
}
