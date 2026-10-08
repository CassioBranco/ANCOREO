import type { SiteContent } from '@/lib/templates/example-content'
import SiteBrand from '../shared/SiteBrand'
import Icon from '../shared/Icon'
import type { PaletteColors } from '@/lib/templates/palettes'
import { fotoOu } from '@/lib/templates/foto'
import SiteAnswer from '../shared/SiteAnswer'
import { realStats } from '@/lib/templates/real-stats'

function cssVars(p: PaletteColors) {
  return `:root{--sp:${p.primary};--ss:${p.secondary};--sa:${p.accent};--sb:${p.bg};--sf:${p.surface};--st:${p.text};--sm:${p.muted}}`
}

const templateCSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Lexend:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');

:root{
  --font-heading:'Sora',system-ui,sans-serif;
  --font-body:'Lexend',system-ui,sans-serif;
  --font-accent:'Space Mono',monospace;
  --line:color-mix(in srgb,var(--st) 12%,var(--sb));
  --pres-bg:#DCFCE7;--pres-fg:#15803D;
  --online-bg:#DBEAFE;--online-fg:#1D4ED8;
  --hibrido-bg:#FEF3C7;--hibrido-fg:#B45309;
}
.ac-root *{box-sizing:border-box;}
.ac-root{margin:0;font-family:var(--font-body);color:var(--st);background:var(--sb);-webkit-font-smoothing:antialiased;line-height:1.6;}
.ac-root h1,.ac-root h2,.ac-root h3{font-family:var(--font-heading);}
.ac-root img{display:block;max-width:100%;}
.ac-root a{text-decoration:none;color:inherit;}
.ac-wrap{max-width:1180px;margin:0 auto;padding:0 2rem;}

/* NAVBAR */
.ac-nav{background:color-mix(in srgb,var(--sb) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:40;}
.ac-nav .ac-wrap{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 2rem;}
.ac-brand{font-family:var(--font-heading);font-weight:800;font-size:1.4rem;color:var(--st);letter-spacing:-0.02em;}
.ac-brand b{color:var(--sp);}
.ac-nav-links{display:flex;gap:1.8rem;align-items:center;font-size:.92rem;color:var(--sm);}
.ac-nav-links a:not(.ac-btn):hover{color:var(--st);}

/* BUTTONS */
.ac-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:var(--sp);color:#fff;padding:.95rem 1.9rem;border-radius:999px;font-weight:700;font-size:.95rem;transition:transform .18s ease,box-shadow .18s ease;}
.ac-btn:hover{transform:translateY(-2px);box-shadow:0 12px 24px color-mix(in srgb,var(--sp) 35%,transparent);}
.ac-btn-amber{background:var(--sa);color:#3a2c05;}
.ac-btn-amber:hover{box-shadow:0 12px 24px color-mix(in srgb,var(--sa) 45%,transparent);}
.ac-btn-ghost{background:transparent;color:var(--st);border:2px solid var(--st);}
.ac-btn-ghost:hover{background:var(--st);color:#fff;box-shadow:none;}

/* KICKER */
.ac-kicker{font-family:var(--font-accent);font-size:.74rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--sp);}

.ac-block{padding:5.5rem 0;}
.ac-head{max-width:44rem;margin-bottom:3rem;}
.ac-head.ac-center{margin-left:auto;margin-right:auto;text-align:center;}
.ac-head h2{font-size:clamp(2rem,4.2vw,3.2rem);font-weight:800;letter-spacing:-0.03em;line-height:1.02;margin:.8rem 0 .8rem;}
.ac-head h2 .ac-mark{background:var(--sa);padding:0 .2em;border-radius:4px;}
.ac-head p{color:var(--sm);font-size:1.08rem;line-height:1.7;margin:0;}

/* HERO */
.ac-hero{padding:3.5rem 0 1rem;}
.ac-hero .ac-wrap{display:grid;grid-template-columns:1.15fr .85fr;gap:3rem;align-items:center;}
.ac-hero h1{font-size:clamp(2.6rem,6vw,4.6rem);line-height:.98;letter-spacing:-0.035em;margin:1.1rem 0 1.3rem;font-weight:800;}
.ac-hero h1 .ac-mark{background:var(--sa);padding:0 .12em;border-radius:6px;}
.ac-hero p{font-size:1.2rem;line-height:1.6;color:var(--sm);max-width:30rem;margin:0 0 2rem;}
.ac-hero-cta{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center;}
.ac-hero-art{position:relative;}
.ac-hero-art img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:24px;}
.ac-hero-art .ac-sticker{position:absolute;top:-18px;right:-10px;background:var(--sa);color:#3a2c05;width:116px;height:116px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:var(--font-heading);font-weight:800;font-size:.9rem;line-height:1;transform:rotate(8deg);box-shadow:0 10px 24px rgb(0 0 0/.15);}
.ac-hero-art .ac-sticker span{font-family:var(--font-accent);font-size:.6rem;font-weight:700;margin-top:.25rem;text-transform:uppercase;}
.ac-hero-art .ac-chip{position:absolute;bottom:18px;left:-16px;background:var(--sb);border:1px solid var(--line);border-radius:14px;padding:.7rem 1rem;box-shadow:0 12px 30px rgb(0 0 0/.1);display:flex;align-items:center;gap:.6rem;font-size:.85rem;font-weight:600;color:var(--st);}

/* MARQUEE */
.ac-greet{overflow:hidden;border-top:2px solid var(--st);border-bottom:2px solid var(--st);margin-top:2.5rem;background:var(--st);}
.ac-greet .ac-track{display:flex;gap:2.5rem;padding:.8rem 0;white-space:nowrap;animation:ac-scroll 24s linear infinite;font-family:var(--font-heading);font-weight:800;font-size:1.3rem;color:#fff;text-transform:uppercase;letter-spacing:-0.01em;}
.ac-greet .ac-track .ac-sep{color:var(--sa);}
@keyframes ac-scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
@media(prefers-reduced-motion:reduce){.ac-greet .ac-track{animation:none;}}

/* STATS */
.ac-stats .ac-wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;}
.ac-stat{border-left:3px solid var(--sa);padding-left:1.1rem;}
.ac-stat .ac-n{font-family:var(--font-heading);font-size:clamp(2.2rem,4vw,3.2rem);font-weight:800;letter-spacing:-0.03em;line-height:1;}
.ac-stat .ac-l{color:var(--sm);font-size:.9rem;margin-top:.4rem;}

/* IDIOMAS / SERVIÇOS COLOR BLOCKS */
.ac-langs{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;}
.ac-lang{border-radius:20px;padding:1.4rem;color:#fff;aspect-ratio:3/4;display:flex;flex-direction:column;justify-content:space-between;transition:transform .2s ease;cursor:default;}
.ac-lang:hover{transform:translateY(-5px);}
.ac-lang .ac-big{font-family:var(--font-heading);font-size:2.6rem;font-weight:800;line-height:1;}
.ac-lang .ac-greet-w{font-family:var(--font-accent);font-size:.82rem;opacity:.9;}
.ac-lang h3{margin:0;font-size:1.2rem;font-weight:700;}
.ac-lang .ac-lvl{font-family:var(--font-accent);font-size:.7rem;opacity:.85;margin-top:.2rem;}
.ac-lang:nth-child(1){background:#1D4ED8;}.ac-lang:nth-child(2){background:#DC2626;}
.ac-lang:nth-child(3){background:#0F766E;}.ac-lang:nth-child(4){background:#7C3AED;}
.ac-lang:nth-child(5){background:#EA580C;}.ac-lang:nth-child(6){background:#0F766E;}

/* MÉTODO TIMELINE */
.ac-method{background:var(--sf);}
.ac-method-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;counter-reset:step;}
.ac-mstep{position:relative;padding-top:2.6rem;}
.ac-mstep::before{counter-increment:step;content:counter(step,decimal-leading-zero);position:absolute;top:0;left:0;font-family:var(--font-heading);font-weight:800;font-size:1.4rem;color:var(--sp);}
.ac-mstep::after{content:'';position:absolute;top:.7rem;left:2.6rem;right:-.75rem;height:2px;background:var(--ss);}
.ac-mstep:last-child::after{display:none;}
.ac-mstep h3{font-size:1.1rem;margin:0 0 .4rem;font-weight:700;}
.ac-mstep p{color:var(--sm);font-size:.9rem;line-height:1.55;margin:0;}

/* CURSOS / TURMAS */
.ac-courses{display:grid;grid-template-columns:repeat(3,1fr);gap:1.6rem;}
.ac-course{border:2px solid var(--st);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;background:var(--sb);transition:transform .2s ease,box-shadow .2s ease;}
.ac-course:hover{transform:translateY(-4px);box-shadow:8px 8px 0 var(--sa);}
.ac-course .ac-ctop{padding:1.4rem 1.4rem 0;display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;}
.ac-course .ac-ctop .ac-ico{font-size:1.8rem;color:var(--sp);}
.ac-course .ac-cbody{padding:1rem 1.4rem 1.4rem;display:flex;flex-direction:column;flex:1;}
.ac-course h3{font-size:1.25rem;margin:0 0 .4rem;font-weight:800;letter-spacing:-0.01em;}
.ac-course p{color:var(--sm);font-size:.9rem;line-height:1.55;margin:0 0 1.1rem;}
.ac-course .ac-meta{display:flex;gap:1rem;font-family:var(--font-accent);font-size:.76rem;color:var(--sm);margin-bottom:1.2rem;flex-wrap:wrap;}
.ac-course .ac-meta span{display:inline-flex;align-items:center;gap:.35rem;}
.ac-course .ac-cfoot{margin-top:auto;}
.ac-course .ac-cfoot .ac-btn{width:100%;}

/* MODALITY BADGE */
.ac-modality{font-family:var(--font-accent);font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:.3rem .65rem;border-radius:999px;}
.ac-m-pres{background:var(--pres-bg);color:var(--pres-fg);}
.ac-m-online{background:var(--online-bg);color:var(--online-fg);}
.ac-m-hibrido{background:var(--hibrido-bg);color:var(--hibrido-fg);}

/* DEPOIMENTO DESTAQUE */
.ac-testi{background:var(--sp);color:#fff;}
.ac-testi .ac-wrap{padding:4.5rem 2rem;max-width:900px;text-align:center;}
.ac-testi blockquote{font-family:var(--font-heading);font-size:clamp(1.4rem,3vw,2.1rem);font-weight:700;line-height:1.35;letter-spacing:-0.02em;margin:1.2rem 0 1.4rem;}
.ac-testi blockquote .ac-mark{background:var(--sa);color:#3a2c05;padding:0 .15em;border-radius:4px;}
.ac-testi cite{font-family:var(--font-accent);font-style:normal;color:rgb(255 255 255/.85);font-size:.9rem;}

/* BLOG POSTS */
.ac-post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.8rem;}
.ac-post{border:1px solid var(--line);border-radius:18px;overflow:hidden;transition:box-shadow .2s,transform .2s;background:var(--sb);}
.ac-post:hover{box-shadow:0 16px 36px rgb(0 0 0/.09);transform:translateY(-4px);}
.ac-post img{aspect-ratio:16/10;object-fit:cover;width:100%;}
.ac-post .ac-pbody{padding:1.3rem;}
.ac-post .ac-cat{font-family:var(--font-accent);font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--sp);}
.ac-post h3{font-size:1.12rem;line-height:1.25;margin:.5rem 0 .5rem;font-weight:700;letter-spacing:-0.01em;}
.ac-post p{color:var(--sm);font-size:.88rem;line-height:1.55;margin:0 0 .6rem;}
.ac-post .ac-by{font-family:var(--font-accent);font-size:.72rem;color:var(--sm);}

/* FAQ */
.ac-faq{max-width:820px;margin:0 auto;}
.ac-faq details{border:2px solid var(--st);border-radius:14px;margin-bottom:.9rem;overflow:hidden;background:var(--sb);}
.ac-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1.2rem 1.4rem;font-family:var(--font-heading);font-size:1.05rem;font-weight:700;letter-spacing:-0.01em;}
.ac-faq summary::-webkit-details-marker{display:none;}
.ac-faq summary::after{content:'+';color:var(--sp);font-size:1.5rem;font-weight:300;transition:transform .2s;flex-shrink:0;}
.ac-faq details[open] summary::after{transform:rotate(45deg);}
.ac-faq details p{color:var(--sm);line-height:1.7;margin:0 1.4rem 1.2rem;}

/* CTA BOX */
.ac-cta{text-align:center;}
.ac-cta .ac-cta-box{background:var(--st);color:#fff;border-radius:28px;padding:4rem 2rem;position:relative;overflow:hidden;}
.ac-cta h2{font-size:clamp(2rem,4.5vw,3.4rem);font-weight:800;letter-spacing:-0.03em;margin:0 0 1rem;line-height:1;}
.ac-cta h2 .ac-mark{background:var(--sa);color:#3a2c05;padding:0 .15em;border-radius:6px;}
.ac-cta p{color:rgb(255 255 255/.8);font-size:1.1rem;margin:0 0 2rem;}

/* FOOTER */
.ac-footer{background:var(--st);color:rgb(255 255 255/.72);}
.ac-footer .ac-wrap{padding-top:3.5rem;padding-bottom:2.5rem;}
.ac-foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem;}
.ac-foot-grid h4{font-family:var(--font-accent);font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--sa);margin:0 0 1rem;}
.ac-foot-grid p,.ac-foot-grid a{display:block;margin:0 0 .5rem;line-height:1.6;color:rgb(255 255 255/.72);font-size:.9rem;}
.ac-foot-grid a:hover{color:#fff;}
.ac-foot-bottom{border-top:1px solid rgb(255 255 255/.15);padding-top:1.6rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;font-size:.82rem;}

@media(max-width:880px){
  .ac-wrap{padding:0 1.4rem;}
  .ac-nav-links a:not(.ac-btn){display:none;}
  .ac-block{padding:4rem 0;}
  .ac-hero .ac-wrap{grid-template-columns:1fr;gap:2.5rem;}
  .ac-hero-art{max-width:360px;}
  .ac-stats .ac-wrap{grid-template-columns:1fr 1fr;gap:1.8rem;}
  .ac-langs{grid-template-columns:1fr 1fr;}
  .ac-method-grid{grid-template-columns:1fr 1fr;}
  .ac-mstep::after{display:none;}
  .ac-courses{grid-template-columns:1fr;}
  .ac-post-grid{grid-template-columns:1fr;}
  .ac-foot-grid{grid-template-columns:1fr;gap:1.8rem;}
}
`

const LANG_COLORS = ['#1D4ED8', '#DC2626', '#0F766E', '#7C3AED', '#EA580C']

export default function AcademiaLayout({ c, p, preview }: { c: SiteContent; p: PaletteColors; preview: boolean }) {
  const href = (url: string) => preview ? '#' : url
  const whatsapp = `https://wa.me/${c.whatsapp}?text=Olá, vim pelo site.`
  const courses = c.courses ?? []
  const posts = c.blogPosts ?? []
  const services = c.services ?? []
  // Só números reais (anos, nº de serviços, nota média dos depoimentos).
  const stats = realStats(c)
  const faqs = c.faqs ?? []

  // Headline: highlight first word with .ac-mark
  const headline = c.heroHeadline
  const headlineWords = headline.split(' ')
  const firstWord = headlineWords[0]
  const restWords = headlineWords.slice(1).join(' ')

  // Best testimonial
  const bestTestimonial = (c.testimonials ?? []).reduce((best, t) =>
    (t.rating ?? 0) >= (best.rating ?? 0) ? t : best,
    (c.testimonials ?? [])[0] ?? { name: '', text: '', rating: 5 }
  )

  function modalityClass(mod: string) {
    if (mod === 'Presencial') return 'ac-modality ac-m-pres'
    if (mod === 'EAD' || mod === 'Online') return 'ac-modality ac-m-online'
    return 'ac-modality ac-m-hibrido'
  }

  return (
    <div className="ac-root">
      <style dangerouslySetInnerHTML={{ __html: cssVars(p) + templateCSS }} />

      {/* NAVBAR */}
      <nav className="ac-nav">
        <div className="ac-wrap">
          <a className="ac-brand" href={href('/')}>
            <SiteBrand c={c}>{c.businessName.split(' ')[0]}<b>{c.businessName.split(' ').slice(1).join(' ')}</b></SiteBrand>
          </a>
          <div className="ac-nav-links">
            {services.length > 0 && <a href="#servicos">Serviços</a>}
            {posts.length > 0 && <a href="#blog">Blog</a>}
            {faqs.length > 0 && <a href="#duvidas">Dúvidas</a>}
            <a href={href(whatsapp)} className="ac-btn ac-btn-amber">Fale conosco</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="ac-hero">
        <div className="ac-wrap">
          <div>
            <span className="ac-kicker">{c.city}{c.state ? `/${c.state}` : ''}</span>
            <h1>
              {firstWord && <span className="ac-mark">{firstWord}</span>}{restWords ? ` ${restWords}` : ''}
            </h1>
            <p>{c.heroSub}</p>
            <SiteAnswer text={c.heroAnswer} />
            <div className="ac-hero-cta">
              {services.length > 0 && <a href="#servicos" className="ac-btn">Ver os serviços</a>}
              <a href={href(whatsapp)} className="ac-btn ac-btn-ghost">Fale no WhatsApp</a>
            </div>
          </div>
          <div className="ac-hero-art">
            <img
              src={fotoOu(p, 620, 780, c.heroImage, c.aboutImage)}
              alt={`${c.businessName} em ${c.city}`}
              loading="eager"
            />
          </div>
        </div>

        {/* MARQUEE */}
        {services.length > 0 && (
          <div className="ac-greet" aria-hidden="true">
            <div className="ac-track">
              {[0, 1].map(k => services.map((svc, i) => (
                <span key={`${k}-${i}`}>{svc.name} <span className="ac-sep">✸</span> </span>
              )))}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* STATS */}
        {stats.length >= 2 && (
          <section className="ac-block ac-stats">
            <div className="ac-wrap">
              {stats.map((s, i) => (
                <div key={i} className="ac-stat">
                  <div className="ac-n">{s.value}</div>
                  <div className="ac-l">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVIÇOS COLOR BLOCKS */}
        {services.length > 0 && (
        <section className="ac-block" id="servicos">
          <div className="ac-wrap">
            <div className="ac-head">
              <span className="ac-kicker">O que oferecemos</span>
              <h2>{c.businessName}{c.city ? ` em ${c.city}` : ''}</h2>
            </div>
            <div className="ac-langs">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className="ac-lang"
                  style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                >
                  <div>
                    <h3>{svc.name}</h3>
                    {svc.description && <div className="ac-lvl">{svc.description.split('.')[0]}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}


        {/* CURSOS (só quando o negócio cadastrou cursos) */}
        {courses.length > 0 && (
        <section className="ac-block" id="cursos">
          <div className="ac-wrap">
            <div className="ac-head">
              <span className="ac-kicker">Cursos</span>
              <h2>Escolha o que combina com você</h2>
            </div>
              <div className="ac-courses">
                {courses.map((course, i) => (
                  <article key={i} className="ac-course">
                    <div className="ac-ctop">
                      <span className="ac-ico" style={{ fontSize: '1.8rem' }}><Icon name="book" size={28} /></span>
                      <span className={modalityClass(course.modality)}>{course.modality}</span>
                    </div>
                    <div className="ac-cbody">
                      <h3>{course.name}</h3>
                      <p>{course.description}</p>
                      <div className="ac-meta">
                        {course.hours ? <span><Icon name="clock" size={15} /> {course.hours}h</span> : null}
                      </div>
                      <div className="ac-cfoot">
                        <a href={href(whatsapp)} className="ac-btn">Quero saber mais</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
          </div>
        </section>
        )}

        {/* DEPOIMENTO DESTAQUE — bestTestimonial tem fallback vazio, então
            guarda pelo .text pra não renderizar seção sem depoimento real */}
        {bestTestimonial.text && (
          <section className="ac-testi">
            <div className="ac-wrap">
              <span className="ac-kicker" style={{ color: 'var(--sa)' }}>Depoimento</span>
              <blockquote>
                &quot;{bestTestimonial.text.split(' ').slice(0, 6).join(' ')} <span className="ac-mark">{bestTestimonial.text.split(' ').slice(6, 10).join(' ')}</span> {bestTestimonial.text.split(' ').slice(10).join(' ')}&quot;
              </blockquote>
              <cite>{bestTestimonial.name}</cite>
            </div>
          </section>
        )}

        {/* BLOG */}
        {posts.length > 0 && (
          <section className="ac-block" id="blog">
            <div className="ac-wrap">
              <div className="ac-head">
                <span className="ac-kicker">Blog</span>
                <h2>Do nosso blog</h2>
              </div>
              <div className="ac-post-grid">
                {posts.slice(0, 3).map((post, i) => (
                  <a key={i} className="ac-post" href={href('#')}>
                    {post.image && <img src={post.image} alt={post.title} />}
                    <div className="ac-pbody">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="ac-by">{post.date || c.businessName}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
        <section className="ac-block" id="duvidas" style={{ background: 'var(--sf)' }}>
          <div className="ac-wrap">
            <div className="ac-head ac-center">
              <span className="ac-kicker">Dúvidas frequentes</span>
              <h2>O que você precisa saber</h2>
            </div>
            <div className="ac-faq">
              {faqs.map((faq, i) => (
                <details key={i}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* CTA */}
        <section className="ac-block ac-cta" id="contato">
          <div className="ac-wrap">
            <div className="ac-cta-box">
              <span className="ac-kicker" style={{ color: 'var(--sa)' }}>Contato</span>
              <h2>Fale com <span className="ac-mark">{c.businessName}</span></h2>
              <p>Mande sua mensagem pelo WhatsApp e tire suas dúvidas direto com a gente.</p>
              <a href={href(whatsapp)} className="ac-btn ac-btn-amber" style={{ padding: '1.1rem 2.4rem', fontSize: '1.05rem' }}>
                <Icon name="whatsapp" size={18} /> {c.ctaLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ac-footer">
        <div className="ac-wrap">
          <div className="ac-foot-grid">
            <div>
              <h4>{c.businessName}</h4>
              {c.address && <p>{c.address}</p>}
              {(c.ctaPhone || c.email) && <p>{[c.ctaPhone, c.email].filter(Boolean).join(' · ')}</p>}
            </div>
            {services.length > 0 && (
              <div>
                <h4>Serviços</h4>
                {services.slice(0, 5).map((svc, i) => (
                  <p key={i}>{svc.name}</p>
                ))}
              </div>
            )}
            <div>
              <h4>Navegue</h4>
              {services.length > 0 && <a href="#servicos">Serviços</a>}
              {posts.length > 0 && <a href="#blog">Blog</a>}
              {faqs.length > 0 && <a href="#duvidas">Dúvidas</a>}
              <a href="#contato">Contato</a>
            </div>
            <div>
              <h4>Localização</h4>
              <p>{c.city}{c.state ? `/${c.state}` : ''}</p>
              {c.credential && <p>{c.credential}</p>}
            </div>
          </div>
          <div className="ac-foot-bottom">
            <span>© {new Date().getFullYear()} {c.businessName}</span>
            <span>Site criado com ANCOREO</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
