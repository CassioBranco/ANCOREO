import type { SiteContent } from '@/lib/templates/example-content'
import SiteBrand from '../shared/SiteBrand'
import Icon from '../shared/Icon'
import type { PaletteColors } from '@/lib/templates/palettes'
import SiteAnswer from '../shared/SiteAnswer'
import { realStats } from '@/lib/templates/real-stats'

function cssVars(p: PaletteColors): string {
  return `:root{--sp:${p.primary};--ss:${p.secondary};--sa:${p.accent};--sb:${p.bg};--sf:${p.surface};--st:${p.text};--sm:${p.muted}}`
}

const templateCSS = `
/* ════════════════════════════════════════════════════════════
   PORTFOLIO — Visual Forte · CSS compartilhado
   A imagem manda: grid 2x2 no hero, galeria hover-overlay, type discreto.
   Paleta via --sp/--ss/--sa/--sb/--sf/--st/--sm.
   ════════════════════════════════════════════════════════════ */
:root {
  --line: color-mix(in srgb, var(--st) 12%, var(--sb));
  --font-heading: 'Syne', system-ui, sans-serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  --font-accent: 'Space Mono', monospace;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: var(--font-body, system-ui, sans-serif); color: var(--st); background: var(--sb); -webkit-font-smoothing: antialiased; line-height: 1.6; }
h1,h2,h3,h4 { font-family: var(--font-heading, system-ui, sans-serif); }
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
.f-wrap { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem; }
.f-kicker { font-size: .72rem; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; color: var(--sp); font-family: var(--font-accent) !important; }
.f-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; background: var(--st); color: #fff; padding: .95rem 2rem; border-radius: 999px; font-weight: 600; font-size: .92rem; transition: background .2s ease, transform .2s ease; cursor: pointer; }
.f-btn:hover { background: var(--sp); transform: translateY(-1px); }
.f-btn-out { background: transparent; color: var(--st); border: 1px solid var(--line); }
.f-btn-out:hover { background: var(--sf); transform: none; }

/* NAV */
nav.f-site { position: sticky; top: 0; z-index: 40; background: color-mix(in srgb, var(--sb) 86%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
nav.f-site .f-wrap { display: flex; align-items: center; justify-content: space-between; padding-top: 1.2rem; padding-bottom: 1.2rem; }
.f-brand { font-family: var(--font-heading); font-weight: 800; font-size: 1.2rem; letter-spacing: .02em; }
.f-brand em { font-style: normal; color: var(--sp); }
.f-nav-links { display: flex; gap: 2.2rem; align-items: center; font-size: .9rem; color: var(--sm); }
.f-nav-links a:not(.f-btn):hover { color: var(--st); }
.f-nav-links a.on { color: var(--sp); font-weight: 600; }

/* HERO 50/50 com grid 2x2 */
.f-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 4.5rem; align-items: center; padding: 3.5rem 0 5rem; }
.f-hero h1 { font-size: clamp(2.4rem, 4.6vw, 4rem); line-height: 1; letter-spacing: -0.03em; margin: 1.2rem 0 1.4rem; font-weight: 800; }
.f-hero h1 em { font-style: italic; color: var(--sp); }
.f-hero p { font-size: 1.12rem; line-height: 1.7; color: var(--sm); margin: 0 0 2rem; max-width: 28rem; }
.f-hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }

/* Hero grid 2x2 */
.f-hero-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 1rem; }
.f-hero-grid .f-cell { position: relative; overflow: hidden; border-radius: 16px; aspect-ratio: 1; }
.f-hero-grid .f-cell:nth-child(1),
.f-hero-grid .f-cell:nth-child(4) { aspect-ratio: 4/5; }
.f-hero-grid .f-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.16,1,.3,1); }
.f-hero-grid .f-cell:hover img { transform: scale(1.05); }
.f-hero-grid .f-ix { position: absolute; top: .7rem; left: .8rem; font-family: var(--font-accent, monospace); font-size: .68rem; color: #fff; background: color-mix(in srgb, var(--st) 50%, transparent); padding: .15rem .5rem; border-radius: 999px; backdrop-filter: blur(4px); }

/* TRUST strip */
.f-trust { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.f-trust .f-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; padding: 2rem 0; }
.f-trust .f-n { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.f-trust .f-l { font-family: var(--font-accent, monospace); font-size: .74rem; color: var(--sm); margin-top: .4rem; }

/* GALLERY header */
section.f-block { padding: 6rem 0; }
.f-gal-head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--line); padding-bottom: 1.2rem; margin-bottom: 1.6rem; gap: 1rem; flex-wrap: wrap; }
.f-gal-head h2 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); margin: 0; font-weight: 800; letter-spacing: -0.02em; }
.f-gal-head .f-lbl { font-family: var(--font-accent, monospace); font-size: .76rem; color: var(--sm); }

/* GALLERY */
.f-gallery { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.2rem; }
.f-cell { position: relative; border-radius: 18px; overflow: hidden; cursor: pointer; }
.f-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.16,1,.3,1); }
.f-cell:hover img { transform: scale(1.05); }
.f-cell .f-ix { position: absolute; top: 1rem; left: 1.1rem; z-index: 3; font-family: var(--font-accent, monospace); font-size: .74rem; color: #fff; mix-blend-mode: difference; }
.f-cell .f-ov { position: absolute; inset: 0; z-index: 2; background: linear-gradient(to top, color-mix(in srgb, var(--st) 88%, transparent), transparent 58%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; }
.f-cell .f-ov .f-tag { font-family: var(--font-accent, monospace); font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: #fff; opacity: 0; transform: translateY(10px); transition: opacity .35s ease, transform .35s ease; }
.f-cell .f-ov h3 { color: #fff; margin: .35rem 0 0; font-size: 1.3rem; font-weight: 700; transform: translateY(10px); transition: transform .35s ease; }
.f-cell:hover .f-ov .f-tag { opacity: .9; transform: translateY(0); }
.f-cell:hover .f-ov h3 { transform: translateY(0); }
.f-cell.f-feature { grid-column: span 6; aspect-ratio: 21/9; }
.f-cell.f-half { grid-column: span 3; aspect-ratio: 4/3; }
.f-cell.f-third { grid-column: span 2; aspect-ratio: 3/4; }

/* SOBRE */
.f-about { background: var(--sf); }
.f-about .f-inner { display: grid; grid-template-columns: 1.05fr .95fr; gap: 4.5rem; align-items: center; }
.f-about img { aspect-ratio: 5/4; object-fit: cover; width: 100%; border-radius: 18px; }
.f-about h2 { font-size: clamp(1.9rem, 3.4vw, 2.7rem); font-weight: 800; letter-spacing: -0.02em; margin: 1rem 0 1.2rem; }
.f-about p { color: var(--sm); line-height: 1.75; margin: 0 0 1.8rem; }
.f-stat-row { display: flex; gap: 3rem; flex-wrap: wrap; }
.f-stat-row .f-s .f-n { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.f-stat-row .f-s .f-l { font-family: var(--font-accent, monospace); font-size: .76rem; color: var(--sm); }

/* CTA full-bleed */
.f-cta { position: relative; border-radius: 28px; overflow: hidden; padding: 5.5rem 3rem; text-align: center; margin-bottom: 6rem; }
.f-cta img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.f-cta .f-cta-ov { position: absolute; inset: 0; background: color-mix(in srgb, var(--st) 70%, transparent); }
.f-cta .f-cta-inner { position: relative; z-index: 2; }
.f-cta .f-kicker { color: #fff; opacity: .85; }
.f-cta h2 { color: #fff; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin: .8rem 0 1rem; }
.f-cta p { color: rgb(255 255 255 / .88); font-size: 1.1rem; margin: 0 0 2rem; }
.f-cta .f-btn { background: #fff; color: var(--st); }
.f-cta .f-btn:hover { background: var(--sf); }

/* blog cards */
.f-post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.f-post img { aspect-ratio: 3/2; object-fit: cover; border-radius: 14px; width: 100%; margin-bottom: 1rem; transition: transform .4s ease; }
.f-post { overflow: hidden; }
.f-post:hover img { transform: scale(1.03); }
.f-post .f-cat { font-size: .7rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--sp); }
.f-post h3 { font-size: 1.2rem; line-height: 1.3; margin: .5rem 0 .5rem; font-weight: 700; }
.f-post:hover h3 { color: var(--sp); }
.f-post p { color: var(--sm); font-size: .9rem; line-height: 1.6; margin: 0 0 .7rem; }
.f-post .f-by { font-size: .76rem; color: var(--sm); }

/* faq */
.f-faq { max-width: 800px; margin: 0 auto; }
.f-faq details { border-bottom: 1px solid var(--line); }
.f-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 1.5rem; align-items: center; padding: 1.4rem 0; font-family: var(--font-heading); font-size: 1.12rem; font-weight: 700; }
.f-faq summary::-webkit-details-marker { display: none; }
.f-faq summary::after { content: '+'; color: var(--sp); font-size: 1.4rem; font-weight: 300; transition: transform .2s; flex-shrink: 0; }
.f-faq details[open] summary::after { transform: rotate(45deg); }
.f-faq details p { color: var(--sm); line-height: 1.75; margin: 0 0 1.4rem; padding-right: 2.5rem; }

/* footer */
footer.f-site { border-top: 1px solid var(--line); padding: 3.5rem 0 2.5rem; }
.f-foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 2.5rem; }
.f-foot-grid h4 { font-size: .72rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--sp); margin: 0 0 1rem; }
.f-foot-grid p, .f-foot-grid a { display: block; margin: 0 0 .5rem; line-height: 1.6; color: var(--sm); font-size: .9rem; }
.f-foot-grid a:hover { color: var(--st); }
.f-foot-bottom { border-top: 1px solid var(--line); padding-top: 1.6rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: .82rem; color: var(--sm); }

/* Serviços (cards reais: imagem só quando o dono subiu) */
.f-svc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.4rem; }
.f-svc { background: var(--sf); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; }
.f-svc img { aspect-ratio: 4/3; object-fit: cover; width: 100%; }
.f-svc .f-svc-body { padding: 1.4rem 1.5rem 1.6rem; }
.f-svc h3 { margin: 0 0 .5rem; font-size: 1.2rem; font-weight: 700; }
.f-svc p { margin: 0; color: var(--sm); font-size: .95rem; line-height: 1.65; }

/* Hero com uma imagem só, ou sem imagem */
.f-hero-one { border-radius: 18px; overflow: hidden; aspect-ratio: 4/5; }
.f-hero-one img { width: 100%; height: 100%; object-fit: cover; }
.f-hero-list { background: var(--sf); border: 1px solid var(--line); border-radius: 18px; padding: 2rem 2.2rem; }
.f-hero-list ul { list-style: none; margin: 1rem 0 0; padding: 0; }
.f-hero-list li { padding: .9rem 0; border-top: 1px solid var(--line); font-weight: 600; font-size: 1.05rem; }
.f-hero-list li:first-child { border-top: 0; }

/* Depoimentos */
.f-dep-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.4rem; }
.f-dep { border: 1px solid var(--line); border-radius: 18px; padding: 1.8rem; display: flex; flex-direction: column; gap: 1rem; }
.f-dep .f-stars { color: var(--sa); display: flex; gap: 2px; }
.f-dep blockquote { margin: 0; line-height: 1.7; color: var(--st); }
.f-dep cite { font-style: normal; font-weight: 700; font-size: .92rem; color: var(--sm); }

.f-about.f-solo .f-inner { grid-template-columns: 1fr; max-width: 760px; }
.f-cta.f-cta-plain { background: var(--st); }

@media (max-width: 880px) {
  .f-wrap { padding: 0 1.4rem; }
  .f-nav-links a:not(.f-btn) { display: none; }
  .f-hero { grid-template-columns: 1fr; gap: 2.5rem; padding: 2.5rem 0 3.5rem; }
  .f-trust .f-row { grid-template-columns: 1fr 1fr; gap: 1.4rem; }
  section.f-block { padding: 4rem 0; }
  .f-gallery { grid-template-columns: 1fr 1fr; }
  .f-cell.f-feature { grid-column: span 2; aspect-ratio: 16/10; }
  .f-cell.f-half { grid-column: span 2; aspect-ratio: 16/10; }
  .f-cell.f-third { grid-column: span 1; aspect-ratio: 3/4; }
  .f-about .f-inner { grid-template-columns: 1fr; gap: 2.5rem; }
  .f-cta { padding: 3.5rem 1.5rem; }
  .f-post-grid { grid-template-columns: 1fr; }
  .f-foot-grid { grid-template-columns: 1fr; gap: 1.8rem; }
}
`

export default function PortfolioLayout({
  c,
  p,
  preview = false,
}: {
  c: SiteContent
  p: PaletteColors
  preview?: boolean
}) {
  const href = (url: string) => (preview ? '#' : url)
  const whatsapp = href(`https://wa.me/${c.whatsapp}?text=Olá, vim pelo site.`)

  // Só números reais (anos, nº de serviços, nota média dos depoimentos).
  const trustStats = realStats(c).slice(0, 4)

  // Fotos que o próprio negócio subiu. Nada de banco de imagem aleatório.
  const fotos = Array.from(new Set(
    [c.heroImage, ...c.services.map(s => s.image), c.aboutImage].filter((u): u is string => !!u),
  ))
  const nomes = c.businessName.trim().split(/\s+/)
  const palavras = c.heroHeadline.split(' ')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars(p) + templateCSS }} />

      {/* NAV */}
      <nav className="f-site">
        <div className="f-wrap">
          <a className="f-brand" href="#">
            <SiteBrand c={c}>{nomes[0]}{nomes.length > 1 && <>{' '}<em>{nomes.slice(1).join(' ')}</em></>}</SiteBrand>
          </a>
          <div className="f-nav-links">
            {c.services.length > 0 && <a href="#servicos">Serviços</a>}
            <a href="#sobre">Sobre</a>
            {c.blogPosts.length > 0 && <a href="#blog">Blog</a>}
            {c.faqs.length > 0 && <a href="#duvidas">Dúvidas</a>}
            <a href={whatsapp} className="f-btn" style={{ padding: '.6rem 1.4rem' }}>Fale conosco</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="f-wrap">
        <div className="f-hero">
          <div>
            {c.city && <span className="f-kicker">{c.city}{c.state ? `/${c.state}` : ''}</span>}
            <h1>{palavras.length > 3 ? (
              <>
                {palavras.slice(0, -2).join(' ')}{' '}
                <em>{palavras.slice(-2).join(' ')}</em>
              </>
            ) : (
              c.heroHeadline
            )}</h1>
            <p>{c.heroSub}</p>
            <SiteAnswer text={c.heroAnswer} />
            <div className="f-hero-cta">
              <a href={whatsapp} className="f-btn">{c.ctaLabel}</a>
              {c.services.length > 0 && <a href="#servicos" className="f-btn f-btn-out">Ver os serviços</a>}
            </div>
          </div>
          {fotos.length >= 4 ? (
            <div className="f-hero-grid">
              {fotos.slice(0, 4).map((src, i) => (
                <div className="f-cell" key={i}>
                  <img src={src} alt={`${c.businessName}, foto ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} />
                </div>
              ))}
            </div>
          ) : fotos.length > 0 ? (
            <div className="f-hero-one">
              <img src={fotos[0]} alt={c.businessName} loading="eager" style={{ objectPosition: c.heroImagePos }} />
            </div>
          ) : c.services.length > 0 ? (
            <div className="f-hero-list">
              <span className="f-kicker">O que fazemos</span>
              <ul>{c.services.slice(0, 5).map((s, i) => <li key={i}>{s.name}</li>)}</ul>
            </div>
          ) : null}
        </div>
      </header>

      {/* NÚMEROS (só aparece com dado real) */}
      {trustStats.length >= 2 && (
        <section className="f-trust">
          <div className="f-wrap f-row" style={{ gridTemplateColumns: `repeat(${trustStats.length}, 1fr)` }}>
            {trustStats.map((s, i) => (
              <div key={i}>
                <div className="f-n">{s.value}</div>
                <div className="f-l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <main>
        {/* SERVIÇOS */}
        {c.services.length > 0 && (
          <section className="f-block f-wrap" id="servicos">
            <div className="f-gal-head">
              <h2>Serviços</h2>
            </div>
            <div className="f-svc-grid">
              {c.services.map((s, i) => (
                <article className="f-svc" key={i}>
                  {s.image && <img src={s.image} alt={s.name} loading="lazy" />}
                  <div className="f-svc-body">
                    <h3>{s.name}</h3>
                    {s.description && <p>{s.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SOBRE */}
        <section className={`f-block f-about${c.aboutImage ? '' : ' f-solo'}`} id="sobre">
          <div className="f-wrap f-inner">
            {c.aboutImage && (
              <img src={c.aboutImage} alt={`Sobre ${c.businessName}`} loading="lazy" style={{ objectPosition: c.aboutImagePos }} />
            )}
            <div>
              <span className="f-kicker">Sobre</span>
              <h2>{c.businessName}</h2>
              <p>{c.about}</p>
              {c.credential && (
                <p style={{ fontWeight: 600, color: 'var(--sp)', marginBottom: '1.8rem' }}>{c.credential}</p>
              )}
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        {c.testimonials.length > 0 && (
          <section className="f-block f-wrap" id="depoimentos">
            <div className="f-gal-head">
              <h2>Quem já é cliente</h2>
            </div>
            <div className="f-dep-grid">
              {c.testimonials.slice(0, 6).map((t, i) => (
                <figure className="f-dep" key={i} style={{ margin: 0 }}>
                  {t.rating > 0 && (
                    <div className="f-stars" aria-label={`${t.rating} de 5`}>
                      {Array.from({ length: Math.min(5, t.rating) }).map((_, s) => <Icon key={s} name="star" size={14} />)}
                    </div>
                  )}
                  <blockquote>{t.text}</blockquote>
                  <cite>{t.name}</cite>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* BLOG */}
        {c.blogPosts && c.blogPosts.length > 0 && (
          <section className="f-block f-wrap" id="blog">
            <div className="f-gal-head">
              <h2>Do nosso blog</h2>
              <a className="f-lbl" href="#blog" style={{ color: 'var(--sp)' }}>
                Ver todos os artigos <Icon name="arrow-right" size={13} />
              </a>
            </div>
            <div className="f-post-grid">
              {c.blogPosts.slice(0, 3).map((post, i) => (
                <a className="f-post" href="#blog" key={i}>
                  {post.image && <img src={post.image} alt={post.title} loading="lazy" />}
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="f-by">{post.date}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {c.faqs && c.faqs.length > 0 && (
          <section className="f-block f-wrap" id="duvidas" style={{ paddingTop: 0 }}>
            <div className="f-gal-head" style={{ justifyContent: 'center', textAlign: 'center', borderBottom: 'none' }}>
              <div>
                <span className="f-kicker">Dúvidas frequentes</span>
                <h2 style={{ marginTop: '.6rem' }}>O que você precisa saber</h2>
              </div>
            </div>
            <div className="f-faq">
              {c.faqs.map((faq, i) => (
                <details key={i}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CONTATO */}
        <section className="f-wrap" id="contato">
          <div className={`f-cta${c.heroImage ? '' : ' f-cta-plain'}`}>
            {c.heroImage && <img src={c.heroImage} alt="" aria-hidden="true" loading="lazy" />}
            {c.heroImage && <div className="f-cta-ov" />}
            <div className="f-cta-inner">
              <span className="f-kicker">Contato</span>
              <h2>Fale com {c.businessName}</h2>
              <p>Mande sua mensagem pelo WhatsApp e tire suas dúvidas direto com a gente.</p>
              <a href={whatsapp} className="f-btn">{c.ctaLabel}</a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="f-site">
        <div className="f-wrap">
          <div className="f-foot-grid">
            <div>
              <h4>{c.businessName}</h4>
              {c.address && <p>{c.address}</p>}
              {(c.ctaPhone || c.email) && <p>{[c.ctaPhone, c.email].filter(Boolean).join(' · ')}</p>}
            </div>
            <div>
              <h4>Localização</h4>
              <p>{c.city}{c.state ? `/${c.state}` : ''}</p>
            </div>
            <div>
              <h4>Navegue</h4>
              {c.services.length > 0 && <a href="#servicos">Serviços</a>}
              <a href="#sobre">Sobre</a>
              {c.blogPosts.length > 0 && <a href="#blog">Blog</a>}
              {c.faqs.length > 0 && <a href="#duvidas">Dúvidas</a>}
            </div>
            <div>
              <h4>Contato</h4>
              {c.ctaPhone && <p>{c.ctaPhone}</p>}
              {c.credential && <p>{c.credential}</p>}
            </div>
          </div>
          <div className="f-foot-bottom">
            <span>© {new Date().getFullYear()} {c.businessName}</span>
            <span>Site criado com ANCOREO</span>
          </div>
        </div>
      </footer>
    </>
  )
}
