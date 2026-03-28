'use client'

import { useState, useRef } from 'react'

const CLIENTS = [
  {
    id: 'Jaden (PixVerse)',
    name: 'Jaden',
    sub: 'Direct · Visionary · Manifesto',
  },
  {
    id: 'Huang Li (iSoftStone)',
    name: 'Huang Li',
    sub: 'Reflective · Warm · Prose-first',
  },
  {
    id: 'Leo (Gro.ai)',
    name: 'Leo',
    sub: 'Product · Dramatic · Customer stories',
  },
  {
    id: 'Sunaina (Social Sparkx)',
    name: 'Sunaina',
    sub: 'Bold · Punchy · Community',
  },
]

const SECTION_LABELS = {
  '1. HOOK MECHANICS': '01 — Hook mechanics',
  '2. NARRATIVE ARC': '02 — Narrative arc',
  '3. PACING AND RHYTHM': '03 — Pacing and rhythm',
  '4. PSYCHOLOGICAL JOURNEY': '04 — Psychological journey',
  '5. STEAL VS ADAPT': '05 — Steal vs adapt',
}

function parseSections(text) {
  const parts = text.split(/##\s+/).filter(s => s.trim())
  return parts.map(part => {
    const lines = part.split('\n')
    const rawTitle = lines[0].trim()
    const body = lines.slice(1).join('\n').trim()
    return {
      title: SECTION_LABELS[rawTitle] || rawTitle,
      rawTitle,
      body,
    }
  })
}

function StealSection({ body }) {
  const lines = body.split('\n').filter(l => l.trim())
  const steal = lines.find(l => l.startsWith('What to steal'))
  const adapt = lines.find(l => l.startsWith('What to adapt'))
  const noCopy = lines.find(l => l.startsWith('What not to copy'))
  const summary = lines.find(l => l.startsWith('3-sentence'))

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {steal && (
          <div style={cardStyle}>
            <span style={slabelStyle}>Steal directly</span>
            <p style={{ fontSize: 13, lineHeight: 1.65 }}>{steal.replace('What to steal directly: ', '')}</p>
          </div>
        )}
        {adapt && (
          <div style={cardStyle}>
            <span style={slabelStyle}>What to adapt</span>
            <p style={{ fontSize: 13, lineHeight: 1.65 }}>{adapt.replace('What to adapt: ', '')}</p>
          </div>
        )}
      </div>
      {noCopy && (
        <div style={{ ...cardStyle, background: '#fdf0ec', borderLeft: '3px solid #e8420a', marginBottom: 10 }}>
          <span style={{ ...slabelStyle, color: '#e8420a' }}>Do not copy</span>
          <p style={{ fontSize: 13, lineHeight: 1.65 }}>{noCopy.replace('What not to copy: ', '')}</p>
        </div>
      )}
      {summary && (
        <div style={{ background: '#0d0d0d', borderRadius: 4, padding: '20px 22px' }}>
          <span style={{ ...slabelStyle, color: '#ff6b3d', display: 'block', marginBottom: 10 }}>3-sentence writer summary</span>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' }}>
            {summary.replace(/^3-sentence writer summary for .+?: /, '')}
          </p>
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  background: '#efeae3',
  borderRadius: 4,
  padding: '14px 16px',
}

const slabelStyle = {
  display: 'block',
  fontFamily: "'DM Mono', monospace",
  fontSize: 9,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#8a857e',
  marginBottom: 6,
}

function SectionCard({ section, index }) {
  const [open, setOpen] = useState(true)
  const isSteal = section.rawTitle === '5. STEAL VS ADAPT'

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(13,13,13,0.13)',
      borderRadius: 6,
      marginBottom: 10,
      overflow: 'hidden',
      animation: `fadeUp 0.3s ${index * 0.07}s ease both`,
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 20px',
          cursor: 'pointer',
          background: open ? '#fff' : '#f5f2ed',
          borderBottom: open ? '1px solid rgba(13,13,13,0.1)' : 'none',
          userSelect: 'none',
        }}
      >
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.1em',
          color: '#e8420a',
          minWidth: 20,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          flex: 1,
          letterSpacing: '-0.01em',
        }}>
          {section.title.replace(/^\d+ — /, '')}
        </span>
        <span style={{
          fontSize: 11,
          color: '#8a857e',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s',
        }}>▾</span>
      </div>

      {open && (
        <div style={{ padding: '16px 20px 20px 56px' }}>
          {isSteal
            ? <StealSection body={section.body} />
            : section.body.split('\n\n').map((para, i) => (
                <p key={i} style={{
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  color: '#2a2825',
                  marginBottom: i < section.body.split('\n\n').length - 1 ? 12 : 0,
                }}>
                  {para.replace(/\*\*(.+?)\*\*/g, '$1')}
                </p>
              ))
          }
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rawOutput, setRawOutput] = useState('')
  const [done, setDone] = useState(false)
  const abortRef = useRef(null)

  async function analyse() {
    setError('')
    if (!selectedClient) { setError('Select a client first.'); return }
    if (post.trim().length < 20) { setError('Post too short — paste the full text.'); return }

    setLoading(true)
    setRawOutput('')
    setDone(false)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post, client: selectedClient }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'API error ' + res.status)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        full += decoder.decode(value, { stream: true })
        setRawOutput(full)
      }

      setDone(true)
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const sections = done ? parseSections(rawOutput) : []
  const clientObj = CLIENTS.find(c => c.id === selectedClient)

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .cbtn { transition: all 0.14s; }
        .cbtn:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.25) !important; }
        .run-btn:hover { background: #e8420a !important; }
        .run-btn:disabled { opacity: 0.35 !important; cursor: not-allowed !important; }
        textarea:focus { border-color: #e8420a !important; outline: none; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(13,13,13,0.15); border-radius: 3px; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{
          background: '#0d0d0d',
          padding: '32px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ff6b3d' }}>
            GroundAI
          </div>

          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.02em' }}>
              Post <span style={{ color: '#ff6b3d' }}>Analyst</span>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.55, marginTop: 8 }}>
              5-section ghostwriter brief, tailored per client.
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ff6b3d', marginBottom: 10 }}>
              Select client
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CLIENTS.map(c => (
                <button
                  key={c.id}
                  className="cbtn"
                  onClick={() => setSelectedClient(c.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 4,
                    border: `1px solid ${selectedClient === c.id ? '#e8420a' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedClient === c.id ? '#e8420a' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'block', fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    {c.name}
                  </span>
                  <span style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: 10, color: selectedClient === c.id ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)', lineHeight: 1.4, marginTop: 2 }}>
                    {c.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.15)', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.6 }}>
            GroundAI · Content Engine v2.3
          </div>
        </aside>

        {/* Main */}
        <main style={{ padding: '44px 52px', maxWidth: 860, background: '#f5f2ed' }}>

          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(13,13,13,0.13)', animation: 'fadeUp 0.4s ease both' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Analyse a post
            </h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#8a857e' }}>
              Paste · select client · get full brief in browser
            </p>
          </div>

          {/* Input card */}
          <div style={{ background: '#fff', border: '1px solid rgba(13,13,13,0.13)', borderRadius: 6, padding: 28, marginBottom: 16, animation: 'fadeUp 0.4s 0.05s ease both' }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a857e', display: 'block', marginBottom: 10 }}>
              LinkedIn post
            </label>
            <textarea
              value={post}
              onChange={e => setPost(e.target.value)}
              placeholder="Paste the full post here..."
              style={{
                width: '100%',
                minHeight: 160,
                padding: '12px 14px',
                border: '1px solid rgba(13,13,13,0.13)',
                borderRadius: 4,
                background: '#f5f2ed',
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 15,
                color: '#0d0d0d',
                lineHeight: 1.65,
                resize: 'vertical',
                transition: 'border-color 0.14s',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#8a857e' }}>
                {post.length} characters
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                padding: '3px 10px',
                borderRadius: 2,
                background: selectedClient ? '#e8420a' : '#efeae3',
                color: selectedClient ? '#fff' : '#8a857e',
                letterSpacing: '0.04em',
                border: selectedClient ? '1px solid #e8420a' : '1px solid rgba(13,13,13,0.1)',
                transition: 'all 0.14s',
              }}>
                {clientObj ? clientObj.name : 'No client selected'}
              </span>
            </div>
          </div>

          <button
            className="run-btn"
            onClick={analyse}
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              background: '#0d0d0d',
              color: '#fff',
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'background 0.14s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              animation: 'fadeUp 0.4s 0.1s ease both',
            }}
          >
            {loading ? (
              <>
                <span>Analysing</span>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#fff',
                    display: 'inline-block',
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </>
            ) : 'Analyse post →'}
          </button>

          {error && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: '#fdf0ec',
              border: '1px solid #e8420a',
              borderRadius: 4,
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: '#e8420a',
            }}>
              {error}
            </div>
          )}

          {/* Streaming raw output while loading */}
          {loading && rawOutput && (
            <div style={{
              marginTop: 24, padding: '20px 24px',
              background: '#fff',
              border: '1px solid rgba(13,13,13,0.13)',
              borderRadius: 6,
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 14,
              lineHeight: 1.75,
              color: '#2a2825',
              whiteSpace: 'pre-wrap',
            }}>
              {rawOutput}
              <span style={{ display: 'inline-block', width: 8, height: 16, background: '#e8420a', marginLeft: 2, animation: 'pulse 0.8s infinite' }} />
            </div>
          )}

          {/* Parsed results */}
          {done && sections.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: 20, paddingBottom: 14,
                borderBottom: '1px solid rgba(13,13,13,0.1)',
              }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', flex: 1 }}>
                  Ghostwriter brief
                </h3>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  padding: '3px 10px', background: '#e8420a', color: '#fff',
                  borderRadius: 2, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  {clientObj?.name}
                </span>
                <a href="/api/download" download="groundai-brief.html" style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  padding: '5px 14px', background: '#0d0d0d', color: '#fff',
                  borderRadius: 3, textDecoration: 'none', letterSpacing: '0.04em',
                  marginLeft: 8,
                }}>
                  &#8595; Download HTML
                </a>
              </div>
              {sections.map((s, i) => (
                <SectionCard key={i} section={s} index={i} />
              ))}
            </div>
          )}

          {/* Sample download */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(13,13,13,0.1)' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#8a857e', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Sample export
            </div>
            <a href="/api/download" download="groundai-brief-sample.html" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px',
              border: '1px solid rgba(13,13,13,0.2)',
              borderRadius: 4,
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: '#0d0d0d',
              textDecoration: 'none',
              background: '#fff',
            }}>
              &#8595; Download sample brief (Sunaina / dummy data)
            </a>
          </div>
        </main>
      </div>
    </>
  )
}
