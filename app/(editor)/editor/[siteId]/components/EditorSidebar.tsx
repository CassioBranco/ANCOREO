'use client'

import Link from 'next/link'
import type { SiteData } from '../page'

export type EditorPanel = 'content' | 'design' | 'preview'

type Props = {
  site: SiteData
  activePanel: EditorPanel
  onPanelChange: (panel: EditorPanel) => void
  // Aba clicada enquanto o painel novo ainda está montando. Sem isto o clique
  // não devolve sinal nenhum e, num painel pesado, parece que não funcionou.
  pendingPanel?: EditorPanel | null
}

const TOOLS: { id: EditorPanel; label: string; icon: string }[] = [
  { id: 'content', label: 'Conteúdo', icon: 'ph-text-aa' },
  { id: 'design', label: 'Estilo', icon: 'ph-palette' },
  { id: 'preview', label: 'Prévia ampla', icon: 'ph-arrows-out' },
]

export default function EditorSidebar({ site, activePanel, onPanelChange, pendingPanel = null }: Props) {
  return (
    <nav className="ed-rail" aria-label="Ferramentas do editor">
      <Link href="/sites" className="mk" title="Voltar aos meus sites" aria-label="Voltar aos meus sites">
        <i className="ph-fill ph-anchor" aria-hidden="true" />
      </Link>
      {TOOLS.map(tool => {
        const ativo = activePanel === tool.id
        const carregando = pendingPanel === tool.id && !ativo
        return (
          <button type="button" key={tool.id}
            className={`ed-tab ${ativo ? 'on' : ''} ${carregando ? 'pendente' : ''}`}
            onClick={() => onPanelChange(tool.id)} aria-pressed={ativo} aria-busy={carregando || undefined}>
            <i className={`ph-duotone ${tool.icon}`} aria-hidden="true" />{tool.label}
            {carregando && <span className="ed-tab-spin" aria-hidden="true" />}
          </button>
        )
      })}
      <Link href="/blog" className="ed-tab"><i className="ph-duotone ph-article" aria-hidden="true" />Blog</Link>
      <Link href="/sites" className="ed-tab"><i className="ph-duotone ph-arrow-left" aria-hidden="true" />Meus sites</Link>
      <div className="foot"><span className={`badge ${site.status === 'published' ? 'ok' : 'warn'}`}>
        {site.status === 'published' ? 'No ar' : 'Rascunho'}
      </span></div>
    </nav>
  )
}
